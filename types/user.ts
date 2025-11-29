import { EmailVerification, ProfileCompletion } from "./auth";
import { BotPersonality } from "./bot";

export type UserStatus = "online" | "offline" | "away" | "busy";

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  status: UserStatus;
  botEnabled: boolean;
  botPersonality: BotPersonality;
  solanaWalletAddress: string;
  aekoBalance: number;
  isAdmin: boolean;
  name: string;
  bio: string;
  blueTick: boolean;
  goldenTick: boolean;
  emailVerification: EmailVerification;
  profileCompletion: ProfileCompletion;
  twoFactorEnabled: boolean;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}
