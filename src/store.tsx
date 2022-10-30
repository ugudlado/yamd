import create from "zustand"
import { Movie, MovieStatus } from "./interfaces/Movie"

const movies: Movie[] = []
for (let index = 0; index < 10; index++) {
	movies.push({
		id: index,
		name: `Movie${index}`,
		status: MovieStatus.DidntWatch,
	})
}

interface MovieState {
	movies: Movie[]
	updateMovieStatus: (movie: Movie) => void
}

const useMovieStore = create<MovieState>((set) => ({
	movies: movies,
	updateMovieStatus: (movie: Movie) => {
		const m = movies.find((m) => m.id === movie.id)
		if (m) {
			m.status = movie.status
			set((state) => {
				state.movies = movies
				return state
			})
		}
		return movie
	},
}))

export default useMovieStore
