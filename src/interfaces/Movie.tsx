export interface Movie {
	id: number
	name: string
	status: MovieStatus
}

export enum MovieStatus {
	None,
	WatchLater,
	Liked,
	Recommended,
	Timepass,
}
