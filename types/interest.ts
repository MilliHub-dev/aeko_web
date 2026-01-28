export interface Interest {
  id: string;
  _id?: string; // Keeping for backward compatibility
  name: string;
  displayName: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterestsResponse {
  success: boolean;
  data: Interest[];
}

export interface SubmitInterestsRequest {
  interestIds: string[];
}
