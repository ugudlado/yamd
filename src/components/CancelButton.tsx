import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie, MovieStatus } from "../interfaces/Movie"
import useMovieStore from "../store"

interface CancelButtonProps {
	movie: Movie
}

const CancelButton = (props: CancelButtonProps) => {
	const movie = props.movie
	const updateStatus = useMovieStore((state) => state.updateMovieStatus)
	const cancel = () => {
		movie.status = MovieStatus.None
		updateStatus(movie)
	}

	return movie.status !== MovieStatus.None ? (
		<button title="Didn't watch?" onClick={cancel}>
			<FontAwesomeIcon icon={faXmarkCircle} />
		</button>
	) : null
}

export default CancelButton
