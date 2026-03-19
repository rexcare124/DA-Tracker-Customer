import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getAdminDatabase } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import { isValidRBCAUserData, type RBCAUserData } from '@/types/rbca-user';

const BCRYPT_SALT_ROUNDS = 12;

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordError {
  error: string;
  details?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' } satisfies ChangePasswordError,
        { status: 401 }
      );
    }

    const body: ChangePasswordRequest = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' } satisfies ChangePasswordError,
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' } satisfies ChangePasswordError,
        { status: 400 }
      );
    }

    const database = getAdminDatabase();
    const firebaseUserId = session.user.id;

    // Fetch user data from Firebase
    const userRef = database.ref(`rbca_users/${firebaseUserId}`);
    const snapshot = await userRef.once('value');
    const firebaseData: unknown = snapshot.val();

    if (!firebaseData || typeof firebaseData !== 'object') {
      return NextResponse.json(
        { error: 'User not found' } satisfies ChangePasswordError,
        { status: 404 }
      );
    }

    if (!isValidRBCAUserData(firebaseData)) {
      return NextResponse.json(
        { error: 'Invalid user data structure' } satisfies ChangePasswordError,
        { status: 500 }
      );
    }

    const userData: RBCAUserData = firebaseData;

    // Verify current password
    const storedPasswordHash = userData.pin?.pwd;
    if (!storedPasswordHash || typeof storedPasswordHash !== 'string') {
      return NextResponse.json(
        { error: 'No password set for this account' } satisfies ChangePasswordError,
        { status: 400 }
      );
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      storedPasswordHash
    );

    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        { error: 'Current password is incorrect' } satisfies ChangePasswordError,
        { status: 401 }
      );
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // Update password in Firebase
    await userRef.update({
      pin: {
        ...userData.pin,
        pwd: newPasswordHash,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to change password:', error);
    const errorResponse: ChangePasswordError = {
      error: 'Failed to change password',
      details: errorMessage
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

