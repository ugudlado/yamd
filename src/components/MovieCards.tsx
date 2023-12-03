import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import { Movie } from "../interfaces/Movie"
import MovieCard from "./MovieCard"
import MovieCardDetail from "./MovieCardDetail"

interface MovieCardsProps {
	movies: Movie[]
}

const MovieCards = (props: MovieCardsProps) => {
	const movieComponents = props.movies.map((movie) => {
		return (
			<Popup
				key={movie.id}
				trigger={MovieCard({ movie })}
				closeOnEscape
				closeOnDocumentClick
				className='w-11/12 h-11/12'
				modal>
				<MovieCardDetail movie={movie} />
			</Popup>
		)
	})
	return <div className='grid grid-cols-4 gap-1'>{movieComponents}</div>
}
export default MovieCards
