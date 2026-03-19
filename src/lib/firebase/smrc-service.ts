/**
 * SMRC Firebase Service - Server-side operations using Firebase Admin
 * Mirrors server SMRC service logic with 3-month agency cooldown and full create/get/validate.
 */

import { getAdminDatabase } from './admin';
import { subMonths, addMonths } from 'date-fns';
import { format } from 'date-fns';
import type {
  CreateSMRCDto,
  SMRCDocument,
  GetMySmrcsDto,
  AgencyLevel,
  CreateDraftSMRCDto,
} from './smrc-types';
import { CreateSMRCSchema, CreateDraftSMRCSchema, LengthOfVisit, SMRCStatus } from './smrc-types';
import { FIREBASE_PATHS } from './smrc-constants';
import { reviewMatchesLocationFilter } from './smrc-location-utils';

const SMRC_PATH = FIREBASE_PATHS.SMRC_REVIEWS;

interface ServiceSuccess<T> {
  success: true;
  data: T;
}

interface ServiceError {
  success: false;
  error: string;
  code?: string;
}

type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function buildSMRCDocument(
  dto: CreateSMRCDto,
  userId: string,
  id: string,
  ipAddress?: string,
  status: typeof SMRCStatus.PUBLISHED | typeof SMRCStatus.DRAFT = SMRCStatus.PUBLISHED,
  draftStep?: number
): Omit<SMRCDocument, 'id'> & { id: string } {
  const now = new Date().toISOString();
  const doc: Omit<SMRCDocument, 'id'> & { id: string } = {
    id,
    userId,
    status,
    ...(draftStep != null && { draftStep }),
    currentResidence: dto.currentResidence,
    notResident: dto.notResident,
    state: (dto.state ?? '').trim(),
    city: (dto.city ?? '').trim(),
    zipCode: (dto.zipCode ?? '').trim(),
    agencyLevel: dto.agencyLevel ?? '',
    agencyName: (dto.agencyName ?? '').trim(),
    serviceReceivedDate: dto.serviceReceivedDate ?? '',
    deliveryMethod: dto.deliveryMethod ?? '',
    requestStatus: dto.requestStatus ?? '',
    shortDescription: (dto.shortDescription ?? '').trim(),
    recommendation: dto.recommendation ?? 0,
    contactedByGovernment: dto.contactedByGovernment ?? false,
    nonBusinessRating: (dto.nonBusinessRating as Record<string, number>) ?? {},
    businessOwner: dto.businessOwner ?? false,
    hasRecordedVideo: dto.hasRecordedVideo ?? false,
    ...(dto.videoUrl?.trim() && { videoUrl: dto.videoUrl.trim() }),
    ...(ipAddress != null && ipAddress !== '' && { ipAddress }),
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  if (!dto.notResident && dto.residenceType != null) doc.residenceType = dto.residenceType;
  if (!dto.notResident && dto.timeAtResidence != null) doc.timeAtResidence = dto.timeAtResidence;
  if (dto.notResident && dto.lengthOfVisit != null) doc.lengthOfVisit = dto.lengthOfVisit;
  if (dto.notResident && dto.lengthOfVisit === LengthOfVisit.OTHER && dto.visitDays != null) doc.visitDays = dto.visitDays;
  if (dto.notResident && dto.visitBeganAt) doc.visitBeganAt = dto.visitBeganAt;
  if (!dto.currentResidence && !dto.notResident && dto.endDate) doc.endDate = dto.endDate;

  if (dto.representativeName) doc.representativeName = dto.representativeName.trim();
  if (dto.deliveryMethod === 'online' && dto.agencyWebsite) doc.agencyWebsite = dto.agencyWebsite.trim().toLowerCase();
  if (dto.deliveryMethod === 'email') {
    if (dto.dateLastEmailReceived) doc.dateLastEmailReceived = dto.dateLastEmailReceived;
    if (dto.representativeEmail) doc.representativeEmail = dto.representativeEmail.trim().toLowerCase();
  }
  if (dto.deliveryMethod === 'phone') {
    if (dto.representativePhone) doc.representativePhone = dto.representativePhone;
    if (dto.dateLastPhoneContact) doc.dateLastPhoneContact = dto.dateLastPhoneContact;
  }
  if (dto.deliveryMethod === 'inPerson') {
    if (dto.locationStreetAddressOne) doc.locationStreetAddressOne = dto.locationStreetAddressOne.trim();
    if (dto.locationStreetAddressTwo) doc.locationStreetAddressTwo = dto.locationStreetAddressTwo?.trim();
    if (dto.locationCity) doc.locationCity = dto.locationCity.trim();
    if (dto.locationState) doc.locationState = dto.locationState.trim();
    if (dto.locationZipCode) doc.locationZipCode = dto.locationZipCode.trim();
  }

  if (dto.recommendationComments?.length) doc.recommendationComments = dto.recommendationComments;
  if (dto.recommendationCommentExplanation) doc.recommendationCommentExplanation = dto.recommendationCommentExplanation.trim();
  if (dto.recommendationComment) doc.recommendationComment = dto.recommendationComment.trim();

  if (dto.contactedByGovernment && dto.contactedByGovernmentMethod) {
    doc.contactedByGovernmentMethod = dto.contactedByGovernmentMethod;
    if (dto.contactedByGovernmentMethod === 'phone') {
      if (dto.contactedByGovernmentPhone) doc.contactedByGovernmentPhone = dto.contactedByGovernmentPhone;
      if (dto.contactedByGovernmentPhoneTime) doc.contactedByGovernmentPhoneTime = dto.contactedByGovernmentPhoneTime.trim();
    }
    if (dto.contactedByGovernmentMethod === 'email' && dto.contactedByGovernmentEmail) {
      doc.contactedByGovernmentEmail = dto.contactedByGovernmentEmail.trim().toLowerCase();
    }
  }

  if (dto.nonBusinessExperienceFeedback) doc.nonBusinessExperienceFeedback = dto.nonBusinessExperienceFeedback.trim();
  if (dto.businessOwner) {
    if (dto.businessRecommendation != null) doc.businessRecommendation = dto.businessRecommendation;
    if (dto.businessRecommendationComments?.length) doc.businessRecommendationComments = dto.businessRecommendationComments;
    if (dto.businessRecommendationCommentExplanation) doc.businessRecommendationCommentExplanation = dto.businessRecommendationCommentExplanation.trim();
    if (dto.businessRecommendationComment) doc.businessRecommendationComment = dto.businessRecommendationComment.trim();
    if (dto.businessRating) doc.businessRating = dto.businessRating as Record<string, number>;
    if (dto.businessExperienceFeedback) doc.businessExperienceFeedback = dto.businessExperienceFeedback.trim();
  }

  return doc;
}

/** Build a draft SMRC document from partial payload; fills missing fields with defaults. */
function buildDraftSMRCDocument(
  dto: CreateDraftSMRCDto & Record<string, unknown>,
  userId: string,
  id: string
): Omit<SMRCDocument, 'id'> & { id: string } {
  const now = new Date().toISOString();
  const def = (v: unknown, fallback: string | number | boolean | Record<string, number>) =>
    v !== undefined && v !== null && v !== '' ? v : fallback;
  const doc: Omit<SMRCDocument, 'id'> & { id: string } = {
    id,
    userId,
    status: SMRCStatus.DRAFT,
    draftStep: typeof dto.draftStep === 'number' ? Math.min(5, Math.max(1, dto.draftStep)) : 1,
    currentResidence: def(dto.currentResidence, false) as boolean,
    notResident: def(dto.notResident, false) as boolean,
    state: String(dto.state ?? '').trim(),
    city: String(dto.city ?? '').trim(),
    zipCode: String(dto.zipCode ?? '').trim(),
    agencyLevel: String(dto.agencyLevel ?? '').trim(),
    agencyName: String(dto.agencyName ?? '').trim(),
    serviceReceivedDate: String(dto.serviceReceivedDate ?? '').trim(),
    deliveryMethod: String(dto.deliveryMethod ?? '').trim(),
    requestStatus: String(dto.requestStatus ?? '').trim(),
    shortDescription: String(dto.shortDescription ?? '').trim(),
    recommendation: Number(dto.recommendation) || 0,
    contactedByGovernment: def(dto.contactedByGovernment, false) as boolean,
    nonBusinessRating: (dto.nonBusinessRating && typeof dto.nonBusinessRating === 'object') ? (dto.nonBusinessRating as Record<string, number>) : {},
    businessOwner: def(dto.businessOwner, false) as boolean,
    hasRecordedVideo: def(dto.hasRecordedVideo, false) as boolean,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
  if (dto.videoUrl && String(dto.videoUrl).trim()) doc.videoUrl = String(dto.videoUrl).trim();
  if (!doc.notResident && dto.residenceType != null) doc.residenceType = String(dto.residenceType).trim();
  if (!doc.notResident && dto.timeAtResidence != null) doc.timeAtResidence = String(dto.timeAtResidence).trim();
  if (dto.notResident && dto.lengthOfVisit != null) doc.lengthOfVisit = String(dto.lengthOfVisit).trim();
  if (dto.notResident && dto.lengthOfVisit === LengthOfVisit.OTHER && dto.visitDays != null) doc.visitDays = Number(dto.visitDays);
  if (dto.notResident && dto.visitBeganAt) doc.visitBeganAt = String(dto.visitBeganAt).trim();
  if (!doc.currentResidence && !doc.notResident && dto.endDate) doc.endDate = String(dto.endDate).trim();
  if (dto.representativeName != null) doc.representativeName = String(dto.representativeName).trim();
  if (dto.agencyWebsite != null) doc.agencyWebsite = String(dto.agencyWebsite).trim().toLowerCase();
  if (dto.dateLastEmailReceived) doc.dateLastEmailReceived = String(dto.dateLastEmailReceived).trim();
  if (dto.representativeEmail != null) doc.representativeEmail = String(dto.representativeEmail).trim().toLowerCase();
  if (dto.representativePhone != null) doc.representativePhone = String(dto.representativePhone).trim();
  if (dto.dateLastPhoneContact) doc.dateLastPhoneContact = String(dto.dateLastPhoneContact).trim();
  if (dto.locationStreetAddressOne != null) doc.locationStreetAddressOne = String(dto.locationStreetAddressOne).trim();
  if (dto.locationStreetAddressTwo != null) doc.locationStreetAddressTwo = String(dto.locationStreetAddressTwo).trim();
  if (dto.locationCity != null) doc.locationCity = String(dto.locationCity).trim();
  if (dto.locationState != null) doc.locationState = String(dto.locationState).trim();
  if (dto.locationZipCode != null) doc.locationZipCode = String(dto.locationZipCode).trim();
  if (dto.recommendationComments?.length) doc.recommendationComments = dto.recommendationComments as string[];
  if (dto.recommendationCommentExplanation != null) doc.recommendationCommentExplanation = String(dto.recommendationCommentExplanation).trim();
  if (dto.recommendationComment != null) doc.recommendationComment = String(dto.recommendationComment).trim();
  if (dto.contactedByGovernment && dto.contactedByGovernmentMethod) {
    doc.contactedByGovernmentMethod = String(dto.contactedByGovernmentMethod).trim();
    if (dto.contactedByGovernmentMethod === 'phone') {
      if (dto.contactedByGovernmentPhone) doc.contactedByGovernmentPhone = String(dto.contactedByGovernmentPhone).trim();
      if (dto.contactedByGovernmentPhoneTime) doc.contactedByGovernmentPhoneTime = String(dto.contactedByGovernmentPhoneTime).trim();
    }
    if (dto.contactedByGovernmentMethod === 'email' && dto.contactedByGovernmentEmail)
      doc.contactedByGovernmentEmail = String(dto.contactedByGovernmentEmail).trim().toLowerCase();
  }
  if (dto.nonBusinessExperienceFeedback != null) doc.nonBusinessExperienceFeedback = String(dto.nonBusinessExperienceFeedback).trim();
  if (doc.businessOwner) {
    if (dto.businessRecommendation != null) doc.businessRecommendation = Number(dto.businessRecommendation);
    if (dto.businessRecommendationComments?.length) doc.businessRecommendationComments = dto.businessRecommendationComments as string[];
    if (dto.businessRecommendationCommentExplanation != null) doc.businessRecommendationCommentExplanation = String(dto.businessRecommendationCommentExplanation).trim();
    if (dto.businessRecommendationComment != null) doc.businessRecommendationComment = String(dto.businessRecommendationComment).trim();
    if (dto.businessRating && typeof dto.businessRating === 'object') doc.businessRating = dto.businessRating as Record<string, number>;
    if (dto.businessExperienceFeedback != null) doc.businessExperienceFeedback = String(dto.businessExperienceFeedback).trim();
  }
  return doc;
}

async function checkCooldown(
  userId: string,
  agencyLevel: string,
  agencyName: string
): Promise<{ allowed: true } | { allowed: false; message: string }> {
  const db = getAdminDatabase();
  const ref = db.ref(SMRC_PATH);
  const snapshot = await ref.orderByChild('userId').equalTo(userId).once('value');
  if (!snapshot.exists()) return { allowed: true };

  const threeMonthsAgo = subMonths(new Date(), 3).getTime();
  const trimmedName = agencyName.trim();
  let latestSame: SMRCDocument | null = null;
  let latestTime = 0;

  snapshot.forEach((child) => {
    const doc = child.val() as SMRCDocument;
    if (doc.isDeleted || doc.agencyLevel !== agencyLevel || doc.agencyName !== trimmedName) return;
    const created = new Date(doc.createdAt).getTime();
    if (created >= threeMonthsAgo && created > latestTime) {
      latestTime = created;
      latestSame = doc;
    }
  });

  if (!latestSame) return { allowed: true };
  const latestDoc = latestSame as SMRCDocument;
  const earliestReviewDate = addMonths(new Date(latestDoc.createdAt), 3);
  return {
    allowed: false,
    message: `${agencyName} was recently reviewed. The earliest date that you can review them again is ${format(earliestReviewDate, 'MMM do yyyy')}.`,
  };
}

export class SMRCFirebaseService {
  async createSMRC(
    dto: (CreateSMRCDto | (CreateDraftSMRCDto & Record<string, unknown>)) & { ipAddress?: string },
    userId: string
  ): Promise<ServiceResult<SMRCDocument>> {
    try {
      const isDraft =
        'status' in dto &&
        dto.status === SMRCStatus.DRAFT &&
        'draftStep' in dto &&
        typeof (dto as CreateDraftSMRCDto).draftStep === 'number';
      if (isDraft) {
        const parsed = CreateDraftSMRCSchema.safeParse({
          status: (dto as CreateDraftSMRCDto).status,
          draftStep: (dto as CreateDraftSMRCDto).draftStep,
        });
        if (!parsed.success) {
          return {
            success: false,
            error: parsed.error.errors.map((e) => e.message).join('; '),
            code: 'VALIDATION_ERROR',
          };
        }
        const db = getAdminDatabase();
        const ref = db.ref(SMRC_PATH);
        const newRef = ref.push();
        const id = newRef.key;
        if (!id) return { success: false, error: 'Failed to generate SMRC ID', code: 'DATABASE_ERROR' };
        const doc = buildDraftSMRCDocument(dto as CreateDraftSMRCDto & Record<string, unknown>, userId, id);
        await newRef.set(doc);
        return { success: true, data: doc };
      }

      const parsed = CreateSMRCSchema.safeParse(dto);
      if (!parsed.success) {
        const messages = parsed.error.errors.map(
          (e) => (e.path.length ? `${e.path.join('.')}: ${e.message}` : e.message)
        );
        const message = messages.length ? messages.join('; ') : 'Validation error';
        return {
          success: false,
          error: message,
          code: 'VALIDATION_ERROR',
        };
      }
      const valid = parsed.data;

      const cooldown = await checkCooldown(userId, valid.agencyLevel, valid.agencyName);
      if (!cooldown.allowed) {
        return {
          success: false,
          error: cooldown.message,
          code: 'REVIEW_COOLDOWN',
        };
      }

      const db = getAdminDatabase();
      const ref = db.ref(SMRC_PATH);
      const newRef = ref.push();
      const id = newRef.key;
      if (!id) {
        return { success: false, error: 'Failed to generate SMRC ID', code: 'DATABASE_ERROR' };
      }

      const doc = buildSMRCDocument(valid, userId, id, (dto as CreateSMRCDto & { ipAddress?: string }).ipAddress, SMRCStatus.PUBLISHED);
      await newRef.set(doc);

      return { success: true, data: doc };
    } catch (err) {
      console.error('SMRC create error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'CREATE_SMRC_ERROR',
      };
    }
  }

  async getMySMRCs(
    userId: string,
    query: GetMySmrcsDto
  ): Promise<ServiceResult<{ page: number; lastPage: number; totalCount: number; data: SMRCDocument[] }>> {
    try {
      const perPage = Math.min(Math.max(query.perPage ?? 10, 1), 100);
      const page = Math.max(query.page ?? 1, 1);

      const db = getAdminDatabase();
      const ref = db.ref(SMRC_PATH);
      const snapshot = await ref.orderByChild('userId').equalTo(userId).once('value');
      if (!snapshot.exists()) {
        return {
          success: true,
          data: { page, lastPage: 1, totalCount: 0, data: [] },
        };
      }

      const list: SMRCDocument[] = [];
      const statusFilter = query.status ?? SMRCStatus.PUBLISHED;
      snapshot.forEach((child) => {
        const doc = child.val() as SMRCDocument;
        if (doc.isDeleted) return;
        const docStatus = doc.status ?? SMRCStatus.PUBLISHED;
        if (docStatus !== statusFilter) return;
        list.push(doc);
      });

      // Optional filter by state/city: show review if state matches OR city matches (any match). Reviews with only state still show.
      let filtered = list;
      if (query.state?.trim() || query.city?.trim()) {
        filtered = filtered.filter((d) =>
          reviewMatchesLocationFilter(d, query.state, query.city),
        );
      }

      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const totalCount = filtered.length;
      const lastPage = Math.max(1, Math.ceil(totalCount / perPage));
      const start = (page - 1) * perPage;
      const data = filtered.slice(start, start + perPage);

      return {
        success: true,
        data: { page, lastPage, totalCount, data },
      };
    } catch (err) {
      console.error('SMRC getMySMRCs error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'GET_MY_SMRCS_ERROR',
      };
    }
  }

  /** Get all SMRC reviews (all users) with pagination and optional state/city filter. */
  async getAllSMRCs(
    query: GetMySmrcsDto
  ): Promise<ServiceResult<{ page: number; lastPage: number; totalCount: number; data: SMRCDocument[] }>> {
    try {
      const perPage = Math.min(Math.max(query.perPage ?? 10, 1), 100);
      const page = Math.max(query.page ?? 1, 1);

      const db = getAdminDatabase();
      const ref = db.ref(SMRC_PATH);
      const snapshot = await ref.once('value');
      if (!snapshot.exists()) {
        return {
          success: true,
          data: { page, lastPage: 1, totalCount: 0, data: [] },
        };
      }

      const list: SMRCDocument[] = [];
      const pushDoc = (doc: SMRCDocument | null, key: string) => {
        if (!doc || doc.isDeleted) return;
        list.push({ ...doc, id: doc.id || key } as SMRCDocument);
      };

      // Read entire node and iterate; works for flat smrc_reviews/{pushId} and any structure
      const root = snapshot.val() as Record<string, unknown> | null;
      if (root && typeof root === 'object') {
        for (const [key, val] of Object.entries(root)) {
          if (!val || typeof val !== 'object') continue;
          const obj = val as Record<string, unknown>;
          // Direct doc: has userId and agencyName (flat structure)
          if ('userId' in obj && 'agencyName' in obj) {
            pushDoc(obj as unknown as SMRCDocument, key);
            continue;
          }
          // Nested: key is userId, val is { reviewId: doc }
          for (const [innerKey, inner] of Object.entries(obj)) {
            if (inner && typeof inner === 'object' && (inner as Record<string, unknown>).userId != null)
              pushDoc(inner as unknown as SMRCDocument, innerKey);
          }
        }
      }

      // Only completed (published) reviews by default; exclude drafts unless explicitly requested.
      const statusFilter = query.status ?? SMRCStatus.PUBLISHED;
      let filtered = list.filter(
        (d) => (d.status ?? SMRCStatus.PUBLISHED) === statusFilter,
      );

      // Optional filter by state/city: show review if state matches OR city matches (any match). Reviews with only state still show.
      if (query.state?.trim() || query.city?.trim()) {
        filtered = filtered.filter((d) =>
          reviewMatchesLocationFilter(d, query.state, query.city),
        );
      }

      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const totalCount = filtered.length;
      const lastPage = Math.max(1, Math.ceil(totalCount / perPage));
      const start = (page - 1) * perPage;
      const data = filtered.slice(start, start + perPage);

      return {
        success: true,
        data: { page, lastPage, totalCount, data },
      };
    } catch (err) {
      console.error('SMRC getAllSMRCs error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'GET_ALL_SMRCS_ERROR',
      };
    }
  }

  async getSMRC(userId: string, id: string): Promise<ServiceResult<SMRCDocument>> {
    try {
      if (!id || id.trim().length === 0) {
        return { success: false, error: 'Invalid SMRC ID', code: 'VALIDATION_ERROR' };
      }

      const db = getAdminDatabase();
      const ref = db.ref(`${SMRC_PATH}/${id.trim()}`);
      const snapshot = await ref.once('value');
      if (!snapshot.exists()) {
        return { success: false, error: 'SMRC review not found', code: 'SMRC_NOT_FOUND' };
      }

      const doc = snapshot.val() as SMRCDocument;
      if (doc.isDeleted || doc.userId !== userId) {
        return { success: false, error: 'SMRC review not found', code: 'SMRC_NOT_FOUND' };
      }

      return { success: true, data: doc };
    } catch (err) {
      console.error('SMRC getSMRC error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'GET_SMRC_ERROR',
      };
    }
  }

  /** Update a draft to published with full payload. Only allowed when doc.status === 'draft' and doc.userId === userId. */
  async updateSMRC(
    userId: string,
    id: string,
    dto: CreateSMRCDto
  ): Promise<ServiceResult<SMRCDocument>> {
    try {
      const getResult = await this.getSMRC(userId, id);
      if (!getResult.success) return getResult;
      const existing = getResult.data;
      if (existing.status !== SMRCStatus.DRAFT) {
        return { success: false, error: 'Only drafts can be updated to published', code: 'VALIDATION_ERROR' };
      }

      const parsed = CreateSMRCSchema.safeParse(dto);
      if (!parsed.success) {
        const messages = parsed.error.errors.map(
          (e) => (e.path.length ? `${e.path.join('.')}: ${e.message}` : e.message)
        );
        return { success: false, error: messages.join('; '), code: 'VALIDATION_ERROR' };
      }
      const valid = parsed.data;

      const cooldown = await checkCooldown(userId, valid.agencyLevel, valid.agencyName);
      if (!cooldown.allowed) {
        return { success: false, error: cooldown.message, code: 'REVIEW_COOLDOWN' };
      }

      const fullDoc = buildSMRCDocument(valid, userId, id, undefined, SMRCStatus.PUBLISHED);
      const now = new Date().toISOString();
      fullDoc.updatedAt = now;
      const updates: Record<string, unknown> = { ...fullDoc };
      delete updates.id;
      delete updates.createdAt;
      const db = getAdminDatabase();
      const ref = db.ref(`${SMRC_PATH}/${id}`);
      await ref.update(updates);

      return { success: true, data: { ...existing, ...fullDoc, id, updatedAt: now } as SMRCDocument };
    } catch (err) {
      console.error('SMRC updateSMRC error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'UPDATE_SMRC_ERROR',
      };
    }
  }

  /** Update draft data and draftStep only. Only allowed when doc.status === 'draft'. */
  async updateDraftSMRC(
    userId: string,
    id: string,
    dto: CreateDraftSMRCDto & Record<string, unknown>
  ): Promise<ServiceResult<SMRCDocument>> {
    try {
      const getResult = await this.getSMRC(userId, id);
      if (!getResult.success) return getResult;
      const existing = getResult.data;
      if (existing.status !== SMRCStatus.DRAFT) {
        return { success: false, error: 'Only drafts can be updated', code: 'VALIDATION_ERROR' };
      }

      const doc = buildDraftSMRCDocument(dto, userId, id);
      const now = new Date().toISOString();
      doc.updatedAt = now;
      const updates: Record<string, unknown> = { ...doc };
      delete updates.id;
      delete updates.createdAt;
      const clean = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
      ) as Record<string, unknown>;
      const db = getAdminDatabase();
      const ref = db.ref(`${SMRC_PATH}/${id}`);
      await ref.update(clean);

      return { success: true, data: { ...existing, ...doc, id, updatedAt: now } as SMRCDocument };
    } catch (err) {
      console.error('SMRC updateDraftSMRC error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'UPDATE_SMRC_ERROR',
      };
    }
  }

  /** Delete a draft from the DB. Only allowed when doc.status === 'draft' and doc.userId === userId. */
  async deleteDraftSMRC(userId: string, id: string): Promise<ServiceResult<{ deleted: true }>> {
    try {
      const getResult = await this.getSMRC(userId, id);
      if (!getResult.success) return getResult;
      if (getResult.data.status !== SMRCStatus.DRAFT) {
        return { success: false, error: 'Only drafts can be deleted', code: 'VALIDATION_ERROR' };
      }
      const db = getAdminDatabase();
      const ref = db.ref(`${SMRC_PATH}/${id}`);
      await ref.remove();
      return { success: true, data: { deleted: true } };
    } catch (err) {
      console.error('SMRC deleteDraftSMRC error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'DELETE_SMRC_ERROR',
      };
    }
  }

  async validateAgencyLevelReview(
    userId: string,
    agencyLevel: AgencyLevel,
    agencyName: string
  ): Promise<ServiceResult<{ valid: true; message: string }>> {
    try {
      const cooldown = await checkCooldown(userId, agencyLevel, agencyName.trim());
      if (!cooldown.allowed) {
        return {
          success: false,
          error: cooldown.message,
          code: 'REVIEW_COOLDOWN',
        };
      }
      return {
        success: true,
        data: { valid: true, message: 'You can review this agency' },
      };
    } catch (err) {
      console.error('SMRC validateAgencyLevelReview error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        code: 'VALIDATE_AGENCY_ERROR',
      };
    }
  }
}

export const smrcFirebaseService = new SMRCFirebaseService();

/** Re-export for callers that import from smrc-service. */
export { stateCanonical, reviewMatchesLocationFilter } from './smrc-location-utils';
