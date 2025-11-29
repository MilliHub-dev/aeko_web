export interface Interest {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface InterestsResponse {
  success: boolean;
  data: Interest[];
}

export interface SubmitInterestsRequest {
  interestIds: string[];
}
