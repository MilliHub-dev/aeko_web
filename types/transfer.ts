export interface TransferHistory {
	fromUser: string; // userId
	toUser: string; // userId
	transferDate: string; // ISO date-time
	reason: string;
}
