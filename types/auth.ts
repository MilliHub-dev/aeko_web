export interface EmailVerification {
  isVerified: boolean;
  verificationCode: string | null;
  codeExpiresAt: string | null;
  codeAttempts: number;
  lastCodeSent: string | null;
}

export interface ProfileCompletion {
  completionPercentage: number;
  hasProfilePicture: boolean;
  hasBio: boolean;
  hasFollowers: boolean;
  hasWalletConnected: boolean;
  completedAt: string | null;
  hasVerifiedEmail: boolean;
}
