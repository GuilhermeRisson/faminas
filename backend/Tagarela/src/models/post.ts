export interface Post {
	id: number;
	authorId: number;
	victimId: number;
	gossip: string;
	createdAt: Date;
}