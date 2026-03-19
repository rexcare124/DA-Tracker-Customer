"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type Path } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ConfigProvider } from "antd";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { clearSmrcFormPrefill } from "@/state/index";
import { useSMRCDraft } from "@/components/SMRC/SMRCDraftContext";
import {
  formDefaultValues,
  getSMRCdefaultValues,
  buildSmrcPayloadFromFormData,
  type SMRCFormInputFields,
} from "./helper";
import { getSmrcApiBase } from "@/lib/smrc-api";

/** Antd theme for SMRC form: Select & DatePicker - height 50px, font 18px, border #38464d, focus 1px outline (globals). */
const SMRC_ANT_THEME = {
  components: {
    Select: {
      controlHeight: 50,
      fontSize: 18,
      colorBorder: "#38464d",
      borderRadius: 5,
      colorText: "#38464d",
      colorTextPlaceholder: "#757575",
      colorPrimary: "#38464d",
      colorPrimaryHover: "#38464d",
    },
    DatePicker: {
      controlHeight: 50,
      fontSize: 18,
      colorBorder: "#38464d",
      borderRadius: 5,
      colorText: "#38464d",
      colorTextPlaceholder: "#757575",
      colorPrimary: "#38464d",
      colorPrimaryHover: "#38464d",
    },
  },
} as const;
import PlaceOfResidenceForm from "./PlaceOfResidenceForm";
import PrivateFeedbackFields from "./PrivateFeedbackFields";
import PublicFeedbackFields from "./PublicFeedbackFields";
import Review from "./Review";
import SubmittedReviewModal from "./SubmittedReviewModal";
import VideoTestimonialStepImport from "./VideoTestimonialStep";
import type { SMRC } from "@/types/smrc";
import Loading from "@/components/Loading";

const VideoTestimonialStep = VideoTestimonialStepImport as React.ComponentType<{ defaultSmrc?: SMRC | null }>;
import type { LocationOption } from "@/types/smrc";

type SMRCFormProps = {
  isPreviousResidence?: boolean;
  notResident?: boolean;
  defaultSmrc?: SMRC | null;
  /** When completing a draft from review history, load this draft and PATCH on submit */
  draftId?: string | null;
};

const STEP_LABELS = [
  "Place of Residence",
  "Private Feedback",
  "Public Feedback",
  "Video Testimonial (Optional)",
  "Submit",
];

export default function SMRCForm({
  isPreviousResidence = false,
  notResident = false,
  defaultSmrc,
  draftId: draftIdFromUrl,
}: SMRCFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const draftContext = useSMRCDraft();
  const activeStepRef = useRef(1);
  const [activeStep, setActiveStep] = useState(1);
  activeStepRef.current = activeStep;
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  /** When completing a draft, use the draft's residence type so the correct fields and labels show */
  const [loadedDraftResidence, setLoadedDraftResidence] = useState<{
    isPreviousResidence: boolean;
    notResident: boolean;
  } | null>(null);
  /** When we have draftId in URL, show loading until draft is fetched and form populated */
  const [draftLoadStatus, setDraftLoadStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSubmittedReviewModal, setShowSubmittedReviewModal] = useState(false);
  const [submissionState, setSubmissionState] = useState<{
    loading: boolean;
    successful: boolean;
    error: string;
  }>({ loading: false, successful: false, error: "" });
  const [agencyLevelIsValid, setAgencyLevelIsValid] = useState<{
    isChecking: boolean;
    isChecked: boolean;
    isValid: boolean;
    error: string;
  }>({ isChecking: false, isChecked: false, isValid: false, error: "" });
  const [locations, setLocations] = useState<{
    loading: boolean;
    states: LocationOption[];
    cities: LocationOption[];
    zips: LocationOption[];
  }>({ loading: true, states: [], cities: [], zips: [] });

  const dispatch = useAppDispatch();
  const smrcFormPrefill = useAppSelector((state) => state.global.smrcFormPrefill);
  const prefillAppliedRef = useRef(false);

  const user = session?.user as
    | ({ email?: string | null; name?: string | null; id?: string } & Record<string, unknown>)
    | undefined;
  const profile = (session?.user as { state?: string; city?: string; zipCode?: string }) ?? {};
  const userRef = useRef(user);
  const profileRef = useRef(profile);
  userRef.current = user;
  profileRef.current = profile;

  const formDefaults = formDefaultValues({
    isPreviousResidence,
    notResident,
    user: user ? { ...profile, email: user.email } : null,
    defaultSmrc,
  });
  const baseDefaults: Partial<SMRCFormInputFields> = {
    ...formDefaults,
    // When viewing a submitted review, keep ratings/comments from the review; otherwise use empty
    ...(defaultSmrc
      ? {}
      : {
          nonBusinessRating: Object.fromEntries(
            Array.from({ length: 15 }, (_, i) => [`metric${i + 1}`, ""]),
          ) as SMRCFormInputFields["nonBusinessRating"],
          businessRating: Object.fromEntries(
            Array.from({ length: 10 }, (_, i) => [`metric${i + 1}`, ""]),
          ) as SMRCFormInputFields["businessRating"],
          recommendationComments: [],
          businessRecommendationComments: [],
        }),
  };
  // Ensure metric keys exist when loading a review (getSMRCdefaultValues may omit empty keys)
  if (defaultSmrc && baseDefaults.nonBusinessRating) {
    for (let i = 1; i <= 15; i++) {
      const key = `metric${i}`;
      if (!(key in baseDefaults.nonBusinessRating))
        (baseDefaults.nonBusinessRating as Record<string, string>)[key] = "";
    }
  }
  if (defaultSmrc && baseDefaults.businessRating) {
    for (let i = 1; i <= 10; i++) {
      const key = `metric${i}`;
      if (!(key in baseDefaults.businessRating)) (baseDefaults.businessRating as Record<string, string>)[key] = "";
    }
  }
  if (defaultSmrc && !Array.isArray(baseDefaults.recommendationComments)) baseDefaults.recommendationComments = [];
  if (defaultSmrc && !Array.isArray(baseDefaults.businessRecommendationComments))
    baseDefaults.businessRecommendationComments = [];
  const formMethods = useForm<SMRCFormInputFields>({
    defaultValues: baseDefaults as SMRCFormInputFields,
    mode: "onChange",
  });
  const formMethodsRef = useRef(formMethods);
  formMethodsRef.current = formMethods;

  // Subscribe to isDirty so RHF keeps it updated when user edits; needed for draft modal to show correctly
  const { isDirty } = formMethods.formState;

  // Register with draft context so Save Draft can POST new draft or PATCH existing
  useEffect(() => {
    if (!draftContext) return;
    draftContext.registerForm(
      () => formMethods.getValues() as unknown as Record<string, unknown>,
      () => activeStepRef.current,
      () => formMethods.formState.isDirty,
      () => ({
        ...buildSmrcPayloadFromFormData(formMethods.getValues()),
        status: "draft",
        draftStep: activeStepRef.current,
      }),
      () => editingDraftId,
    );
    return () => draftContext.unregisterForm();
  }, [draftContext, formMethods, editingDraftId]);

  // When viewing a submitted review, reset form so ratings and all fields are applied (RHF defaultValues can miss nested fields)
  const defaultSmrcIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!defaultSmrc?.id) return;
    if (defaultSmrcIdRef.current === defaultSmrc.id) return;
    defaultSmrcIdRef.current = defaultSmrc.id;
    const formDefaults = formDefaultValues({
      isPreviousResidence,
      notResident,
      user: user ? { ...profile, email: user.email } : null,
      defaultSmrc,
    });
    const fromReview = getSMRCdefaultValues(defaultSmrc);
    const nbRating = fromReview.nonBusinessRating ?? {};
    const bRating = fromReview.businessRating ?? {};
    const fullDefaults: SMRCFormInputFields = {
      ...formDefaults,
      nonBusinessRating: Object.fromEntries(
        Array.from({ length: 15 }, (_, i) => {
          const key = `metric${i + 1}`;
          return [key, (nbRating as Record<string, string>)[key] ?? ""];
        }),
      ) as SMRCFormInputFields["nonBusinessRating"],
      businessRating: Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => {
          const key = `metric${i + 1}`;
          return [key, (bRating as Record<string, string>)[key] ?? ""];
        }),
      ) as SMRCFormInputFields["businessRating"],
      recommendationComments: Array.isArray(fromReview.recommendationComments) ? fromReview.recommendationComments : [],
      businessRecommendationComments: Array.isArray(fromReview.businessRecommendationComments)
        ? fromReview.businessRecommendationComments
        : [],
    } as SMRCFormInputFields;
    formMethods.reset(fullDefaults);
  }, [defaultSmrc, isPreviousResidence, notResident, user, profile, formMethods]);

  // Load draft when completing from review history (draftId in URL)
  const draftFetchRunRef = useRef<object | null>(null);
  useEffect(() => {
    if (!draftIdFromUrl || defaultSmrc) {
      setDraftLoadStatus("idle");
      return;
    }
    setDraftLoadStatus("loading");
    const runId = {};
    draftFetchRunRef.current = runId;
    fetch(`${getSmrcApiBase()}/${encodeURIComponent(draftIdFromUrl)}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (draftFetchRunRef.current !== runId) return;
        if (!res.ok) {
          setDraftLoadStatus("error");
          return;
        }
        return data;
      })
      .then((data) => {
        if (draftFetchRunRef.current !== runId || !data) return;
        if (data.status !== "draft") {
          setDraftLoadStatus("loaded");
          return;
        }
        const draftIsPrevious = !data.currentResidence && !data.notResident;
        const draftNotResident = !!data.notResident;
        setLoadedDraftResidence({ isPreviousResidence: draftIsPrevious, notResident: draftNotResident });
        const formDefaults = formDefaultValues({
          isPreviousResidence: draftIsPrevious,
          notResident: draftNotResident,
          user: userRef.current ? { ...profileRef.current, email: userRef.current.email } : null,
          defaultSmrc: data,
        });
        const fromReview = getSMRCdefaultValues(data);
        const nbRating = fromReview.nonBusinessRating ?? {};
        const bRating = fromReview.businessRating ?? {};
        const fullDefaults: SMRCFormInputFields = {
          ...formDefaults,
          nonBusinessRating: Object.fromEntries(
            Array.from({ length: 15 }, (_, i) => {
              const key = `metric${i + 1}`;
              return [key, (nbRating as Record<string, string>)[key] ?? ""];
            }),
          ) as SMRCFormInputFields["nonBusinessRating"],
          businessRating: Object.fromEntries(
            Array.from({ length: 10 }, (_, i) => {
              const key = `metric${i + 1}`;
              return [key, (bRating as Record<string, string>)[key] ?? ""];
            }),
          ) as SMRCFormInputFields["businessRating"],
          recommendationComments: Array.isArray(fromReview.recommendationComments)
            ? fromReview.recommendationComments
            : [],
          businessRecommendationComments: Array.isArray(fromReview.businessRecommendationComments)
            ? fromReview.businessRecommendationComments
            : [],
        } as SMRCFormInputFields;
        // Normalize empty strings to "no_option" for select fields so UI shows placeholder
        const selectFields: (keyof SMRCFormInputFields)[] = [
          "residenceType",
          "timeAtResidence",
          "lengthOfVisit",
          "agencyLevel",
          "deliveryMethod",
          "requestStatus",
          "contactedByGovernmentMethod",
        ];
        selectFields.forEach((key) => {
          const v = fullDefaults[key];
          if (v === "" || v == null) (fullDefaults as unknown as Record<string, string>)[key] = "no_option";
        });
        formMethodsRef.current.reset(fullDefaults);
        setActiveStep(Math.min(5, Math.max(1, data.draftStep ?? 1)));
        setEditingDraftId(draftIdFromUrl);
        setDraftLoadStatus("loaded");
      })
      .catch(() => {
        if (draftFetchRunRef.current === runId) setDraftLoadStatus("error");
      });
    return () => {
      draftFetchRunRef.current = null;
    };
  }, [draftIdFromUrl, defaultSmrc, isPreviousResidence, notResident]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { decompress } = await import("compress-json");
        const statesData = (await import("@/utils/locations-states.json")).default as unknown;
        const citiesData = (await import("@/utils/locations-cities.json")).default as unknown;
        const zipsData = (await import("@/utils/locations-zips.json")).default as unknown;
        const states = decompress(statesData as never) as LocationOption[];
        const cities = decompress(citiesData as never) as LocationOption[];
        const zips = decompress(zipsData as never) as LocationOption[];
        if (mounted)
          setLocations({
            loading: false,
            states: states ?? [],
            cities: cities ?? [],
            zips: zips ?? [],
          });
      } catch {
        if (mounted) setLocations({ loading: false, states: [], cities: [], zips: [] });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Apply one-time prefill from map selection (datasearch → Submit a review → got-smrc). Match state/city to dropdown options (case-insensitive); then clear prefill so user edits are not overwritten.
  useEffect(() => {
    if (locations.loading || defaultSmrc || draftIdFromUrl) return;
    const prefill = smrcFormPrefill;
    if (!prefill || (!prefill.state && !prefill.city)) return;
    if (prefillAppliedRef.current) return;
    prefillAppliedRef.current = true;

    const states = locations.states ?? [];
    const cities = locations.cities ?? [];
    const setValue = formMethodsRef.current?.setValue;
    if (!setValue) return;

    const prefillStateRaw = (prefill.state ?? "").trim();
    const prefillCityRaw = (prefill.city ?? "").trim();
    const stateOpt = states.find(
      (opt) =>
        (opt.label ?? "").toLowerCase() === prefillStateRaw.toLowerCase() ||
        (opt.value ?? "").toLowerCase() === prefillStateRaw.toLowerCase(),
    );
    const stateValue = stateOpt?.value ?? (prefillStateRaw || "no_option");
    if (stateValue && stateValue !== "no_option") {
      setValue("state", stateValue, { shouldValidate: false });
      setValue("zipCode", "no_option", { shouldValidate: false });
      setValue("agencyLevel", "no_option", { shouldValidate: false });
      setValue("agencyName", "", { shouldValidate: false });
    }

    const stateFilteredCities = cities.filter(
      (opt) => (opt as LocationOption & { state?: string }).state === stateValue,
    );
    const cityIndex = stateFilteredCities.findIndex((opt) => {
      const label = (opt.label ?? "").toLowerCase();
      const val = (opt.value ?? "").toLowerCase();
      const cityLower = prefillCityRaw.toLowerCase();
      return label === cityLower || val === cityLower;
    });
    if (cityIndex >= 0) {
      const cityOpt = stateFilteredCities[cityIndex];
      const county = (cityOpt as LocationOption & { county?: string }).county ?? "";
      const cityFormValue = cityIndex === 0 ? cityOpt.value : `${county} County/${cityOpt.value}`;
      setValue("city", cityFormValue || "no_option", { shouldValidate: false });
    } else if (stateValue && stateValue !== "no_option") {
      setValue("city", "no_option", { shouldValidate: false });
    }

    dispatch(clearSmrcFormPrefill());
    prefillAppliedRef.current = false;
  }, [
    locations.loading,
    locations.states,
    locations.cities,
    smrcFormPrefill?.state,
    smrcFormPrefill?.city,
    defaultSmrc,
    draftIdFromUrl,
    dispatch,
  ]);

  const stepFields: Path<SMRCFormInputFields>[][] = [
    [
      "timeAtResidence",
      "residenceType",
      "lengthOfVisit",
      "visitDays",
      "endDate",
      "visitBeganAt",
      "state",
      "city",
      "zipCode",
      "agencyLevel",
      "agencyName",
    ],
    [
      "serviceReceivedDate",
      "deliveryMethod",
      "requestStatus",
      "representativeName",
      "agencyWebsite",
      "representativeEmail",
      "dateLastEmailReceived",
      "representativePhone",
      "dateLastPhoneContact",
      "locationStreetAddressOne",
      "locationStreetAddressTwo",
      "locationCity",
      "locationState",
      "locationZipCode",
      "shortDescription",
      "recommendation",
      "recommendationComment",
      "recommendationComments",
      "recommendationCommentExplanation",
      "businessOwner",
      "businessRecommendation",
      "businessRecommendationComment",
      "businessRecommendationComments",
      "businessRecommendationCommentExplanation",
      "contactedByGovernment",
      "contactedByGovernmentMethod",
      "contactedByGovernmentPhone",
      "contactedByGovernmentPhoneTime",
      "contactedByGovernmentEmail",
      "contactedByGovernmentConfirmEmail",
    ],
    [
      "nonBusinessRating.metric1",
      "nonBusinessRating.metric2",
      "nonBusinessRating.metric3",
      "nonBusinessRating.metric4",
      "nonBusinessRating.metric5",
      "nonBusinessRating.metric6",
      "nonBusinessRating.metric7",
      "nonBusinessRating.metric8",
      "nonBusinessRating.metric9",
      "nonBusinessRating.metric10",
      "nonBusinessRating.metric11",
      "nonBusinessRating.metric12",
      "nonBusinessRating.metric13",
      "nonBusinessRating.metric14",
      "nonBusinessRating.metric15",
      "nonBusinessExperienceFeedback",
      "businessRating.metric1",
      "businessRating.metric2",
      "businessRating.metric3",
      "businessRating.metric4",
      "businessRating.metric5",
      "businessRating.metric6",
      "businessRating.metric7",
      "businessRating.metric8",
      "businessRating.metric9",
      "businessRating.metric10",
      "businessExperienceFeedback",
    ],
  ];

  const onChangeStep = useCallback(
    async (type: "next" | "prev") => {
      if (!defaultSmrc) setIsLoadingStep(true);
      let valid = true;
      if (!defaultSmrc && type === "next") {
        const stepIndex = activeStep - 1;
        if (stepIndex < stepFields.length) {
          setIsValidating(true);
          valid = await formMethods.trigger(stepFields[stepIndex], { shouldFocus: true });
          setIsValidating(false);
        }
        if (activeStep === 1 && !(agencyLevelIsValid.isChecked && agencyLevelIsValid.isValid)) valid = false;
      }
      if (valid && (defaultSmrc || activeStep !== 1 || (agencyLevelIsValid.isChecked && agencyLevelIsValid.isValid))) {
        if (!defaultSmrc && activeStep === 3) {
          const state = formMethods.getValues("state");
          const city = formMethods.getValues("city");
          router.push(
            `${pathname}?email=${user?.email ?? ""}&full_name[first_name]=${(user?.name ?? "").split(" ")[0] ?? ""}&full_name[last_name]=${(user?.name ?? "").split(" ").slice(1).join(" ") ?? ""}&state=${state}&city=${city}`,
            { scroll: false },
          );
        }
        if (type === "prev") formMethods.clearErrors();
        setActiveStep((s) => s + (type === "next" ? 1 : -1));
        setIsLoadingStep(false);
        window.scrollTo({ top: 0, left: 0 });
      } else {
        setIsLoadingStep(false);
      }
    },
    [activeStep, formMethods, agencyLevelIsValid, defaultSmrc, pathname, router, user],
  );

  const onSubmit = useCallback(
    async (data: SMRCFormInputFields) => {
      if (submissionState.successful || defaultSmrc) return;

      const payload = buildSmrcPayloadFromFormData(data);
      const payloadWithUser = {
        ...payload,
        user_id: user?.id,
      };
      setSubmissionState({ loading: true, successful: false, error: "" });

      try {
        const base = getSmrcApiBase();
        const url = editingDraftId ? `${base}/${encodeURIComponent(editingDraftId)}` : base;
        const res = await fetch(url, {
          method: editingDraftId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payloadWithUser),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            Array.isArray(json.message) ? json.message.join(". ") : (json.message ?? json.error ?? "Failed to submit"),
          );
        }
        setShowSubmittedReviewModal(true);
        setSubmissionState({ loading: false, successful: true, error: "" });
        if (editingDraftId) {
          setEditingDraftId(null);
          setLoadedDraftResidence(null);
        }
      } catch (err) {
        setSubmissionState({
          loading: false,
          successful: false,
          error: err instanceof Error ? err.message : "Error submitting the form. Please try again.",
        });
      }
    },
    [defaultSmrc, submissionState.successful, editingDraftId, user],
  );

  const title = activeStep === 5 ? (defaultSmrc ? "Done" : "Submit") : (STEP_LABELS[activeStep - 1] ?? "");

  /** When completing a draft, show the draft's residence type (previous/current/not resident) so the right fields appear */
  const effectiveIsPreviousResidence = loadedDraftResidence?.isPreviousResidence ?? isPreviousResidence;
  const effectiveNotResident = loadedDraftResidence?.notResident ?? notResident;

  if (draftIdFromUrl && draftLoadStatus === "loading") {
    return <Loading />;
  }
  if (draftIdFromUrl && draftLoadStatus === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-lg text-muted-foreground">Could not load the draft. It may have been deleted.</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/review-history")}
          className="rounded border border-[#0b83e6dc] bg-[#0b83e6dc] px-4 py-2 text-white"
        >
          Back to Review History
        </button>
      </div>
    );
  }

  return (
    <>
      <SubmittedReviewModal isOpen={showSubmittedReviewModal} onClose={() => setShowSubmittedReviewModal(false)} />
      <div className="font-lato smrc-ant-form">
        <h1
          className="text-center text-[#38464d] mb-8"
          style={{ fontSize: "30px", lineHeight: 1.4, marginBottom: "30px" }}
        >
          {title}
        </h1>
        <ConfigProvider theme={SMRC_ANT_THEME}>
          <FormProvider {...formMethods}>
            {/* Steps indicator - GovUNLEASHED: single continuous light gray line behind 30px circles */}
            <div
              className="relative flex flex-col justify-center gap-5 md:flex-row md:gap-x-[100px]"
              style={{ marginTop: "50px" }}
            >
              {/* Single continuous line connecting center of all circles (GovUNLEASHED style) */}
              <div className="absolute left-0 top-[15px] z-0 hidden h-px w-full bg-[#d9d9d9] md:block" aria-hidden />
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className="relative z-10 flex cursor-default items-center gap-2 md:flex-col md:gap-2.5 md:text-center md:items-center"
                  style={{ fontWeight: 700, fontSize: "17px" }}
                >
                  <div
                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      activeStep === step ? "bg-[#0b83e6] text-white" : "bg-[#b0b0b0] text-[#6c757d]"
                    }`}
                  >
                    {step}
                  </div>
                  <span className={activeStep === step ? "text-[#0b83e6]" : "text-[#6c757d]"}>
                    {STEP_LABELS[step - 1]}
                  </span>
                </div>
              ))}
            </div>

            <form className="mt-8 space-y-8" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {activeStep === 1 && (
                  <>
                    <p className="text-[#38464d] text-lg leading-snug">
                      {effectiveNotResident
                        ? "Please provide information on the public service(s) you received while traveling."
                        : `Please provide information on your ${effectiveIsPreviousResidence ? "previous" : "current"} place of residence.`}
                    </p>
                    <p className="-mt-4 text-sm text-[#38464d]">
                      <span className="text-destructive">*</span> indicates required field
                    </p>
                    <PlaceOfResidenceForm
                      isPreviousResidence={effectiveIsPreviousResidence}
                      notResident={effectiveNotResident}
                      isValidating={isValidating}
                      locations={locations}
                      agencyLevelIsValid={agencyLevelIsValid}
                      setAgencyLevelIsValid={setAgencyLevelIsValid}
                      defaultSmrc={defaultSmrc}
                    />
                  </>
                )}
                {activeStep === 2 && (
                  <PrivateFeedbackFields
                    isValidating={isValidating}
                    locations={locations}
                    defaultSmrc={defaultSmrc}
                    isPreviousResidence={effectiveIsPreviousResidence}
                    notResident={effectiveNotResident}
                  />
                )}
                {activeStep === 3 && <PublicFeedbackFields isValidating={isValidating} defaultSmrc={defaultSmrc} />}
                {activeStep === 4 && <VideoTestimonialStep defaultSmrc={defaultSmrc} />}
                {activeStep === 5 && <Review defaultSmrc={defaultSmrc} />}
              </div>

              <div
                className="mt-12 flex flex-wrap items-center justify-center gap-4"
                style={{ marginTop: "50px", gap: "15px" }}
              >
                {activeStep === 5 && submissionState.error && (
                  <p className="w-full text-center font-semibold text-destructive">{submissionState.error}</p>
                )}
                {activeStep === 1 && (
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/review-history")}
                    disabled={isLoadingStep || submissionState.loading}
                    className="cursor-pointer rounded-[5px] border border-[#e20a0a] bg-[#e20a0a] px-12 py-2.5 text-center text-lg text-white hover:opacity-90 disabled:opacity-50"
                    style={{ height: 50, padding: "10px 50px", fontSize: "18px" }}
                  >
                    Cancel
                  </button>
                )}
                {activeStep > 1 && !submissionState.successful && (
                  <button
                    type="button"
                    onClick={() => onChangeStep("prev")}
                    disabled={isLoadingStep || submissionState.loading}
                    className="cursor-pointer rounded-[5px] border border-[#838080] bg-transparent px-12 py-2.5 text-center text-lg text-[#838080] hover:border-black hover:text-black disabled:opacity-50"
                    style={{ height: 50, padding: "10px 50px", fontSize: "18px" }}
                  >
                    Previous
                  </button>
                )}
                {activeStep < 5 && (
                  <button
                    type="button"
                    onClick={() => onChangeStep("next")}
                    disabled={
                      isLoadingStep ||
                      submissionState.loading ||
                      agencyLevelIsValid.isChecking ||
                      (agencyLevelIsValid.isChecked && !agencyLevelIsValid.isValid)
                    }
                    className="cursor-pointer rounded-[5px] border border-[#838080] bg-transparent px-12 py-2.5 text-center text-lg text-[#838080] hover:border-black hover:text-black disabled:opacity-50"
                    style={{ height: 50, padding: "10px 50px", fontSize: "18px" }}
                  >
                    Next
                  </button>
                )}
                {!defaultSmrc && activeStep === 5 && (
                  <button
                    type="submit"
                    disabled={isLoadingStep || submissionState.loading || submissionState.successful}
                    className="cursor-pointer rounded-[5px] border border-[#0b83e6dc] bg-[#0b83e6dc] px-12 py-2.5 text-center text-lg text-white hover:border-[#95c8f1dc] hover:bg-[#95c8f1dc] hover:text-[#0b83e6dc] disabled:opacity-50"
                    style={{ height: 50, padding: "10px 50px", fontSize: "18px" }}
                  >
                    {submissionState.loading ? "Submitting..." : "Submit"}
                  </button>
                )}
                {defaultSmrc && activeStep === 5 && (
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/review-history")}
                    className="cursor-pointer rounded-[5px] border border-[#0b83e6dc] bg-[#0b83e6dc] px-12 py-2.5 text-center text-lg text-white hover:opacity-90"
                    style={{ height: 50, padding: "10px 50px", fontSize: "18px" }}
                  >
                    Done
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </ConfigProvider>
      </div>
    </>
  );
}
