import { faMeh } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie, MovieStatus } from "../interfaces/Movie"
import useMovieStore from "../store"

interface TimePassButtonProps {
	movie: Movie
}

const TimePassButton = (props: TimePassButtonProps) => {
	const movie = props.movie
	const updateStatus = useMovieStore((state) => state.updateMovieStatus)
	const addToTimePassList = () => {
		movie.status =
			movie.status === MovieStatus.Timepass
				? MovieStatus.None
				: MovieStatus.Timepass
		updateStatus(movie)
		console.log(`Timepass movie: ${movie.name}`)
	}

	return movie.status === MovieStatus.None ? (
		<button title='Liked?' onClick={addToTimePassList}>
			<FontAwesomeIcon icon={faMeh} />
		</button>
	) : null
}

export default TimePassButton
