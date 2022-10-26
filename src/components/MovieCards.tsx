import { Movie } from "../interfaces/Movie"
import MovieCard from "./MovieCard"

interface MovieCardsProps {
	movies: Movie[]
}

const MovieCards = (props: MovieCardsProps) => {
	const movieComponents = props.movies.map((movie) => MovieCard({ movie }))
	return <div className='grid grid-cols-4 gap-1'>{movieComponents}</div>
}
export default MovieCards
