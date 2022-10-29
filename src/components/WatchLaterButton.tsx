import { faThumbTack } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie, MovieStatus } from "../interfaces/Movie"
import useMovieStore from "../store"

interface WatchLaterButtonProps {
	movie: Movie
}

const WatchLaterButton = (props: WatchLaterButtonProps) => {
	const movie = props.movie
	const updateStatus = useMovieStore((state) => state.updateMovieStatus)
	const addToWatchList = () => {
		movie.status =
			movie.status === MovieStatus.WatchLater
				? MovieStatus.None
				: MovieStatus.WatchLater
		updateStatus(movie)
		console.log(`Added ${movie.name} to watchlist`)
	}

	return movie.status === MovieStatus.None ? (
		<button title='Watch later' onClick={addToWatchList}>
			<FontAwesomeIcon icon={faThumbTack} />
		</button>
	) : null
}

export default WatchLaterButton
