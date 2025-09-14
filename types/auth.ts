export interface EmailVerification {
	isVerified: boolean;
}

export interface ProfileCompletion {
	completionPercentage: number;
	hasProfilePicture: boolean;
	hasBio: boolean;
	hasFollowers: boolean;
	hasWalletConnected: boolean;
	hasVerifiedEmail: boolean;
}
