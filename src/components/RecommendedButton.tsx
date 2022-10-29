import { faGrinStars } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie, MovieStatus } from "../interfaces/Movie"
import useMovieStore from "../store"

interface RecommendedButtonProps {
	movie: Movie
}

const RecommendedButton = (props: RecommendedButtonProps) => {
	const movie = props.movie
	const updateStatus = useMovieStore((state) => state.updateMovieStatus)
	const addToRecommendedList = () => {
		movie.status =
			movie.status === MovieStatus.Recommended
				? MovieStatus.None
				: MovieStatus.Recommended
		updateStatus(movie)
		console.log(`Recommended movie: ${movie.name}`)
	}

	return movie.status === MovieStatus.None ? (
		<button title='Recommended?' onClick={addToRecommendedList}>
			<FontAwesomeIcon icon={faGrinStars} />
		</button>
	) : null
}

export default RecommendedButton
