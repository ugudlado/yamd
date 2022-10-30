export interface Movie {
	id: number
	name: string
	status: MovieStatus
}

export enum MovieStatus {
	DidntWatch = "Didn't watch",
	WatchLater = "Watch later",
	Liked = "Liked",
	Recommendation = "Recommendation",
	Timepass = "Time pass",
}
