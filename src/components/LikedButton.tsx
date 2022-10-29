import { faSmile } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie, MovieStatus } from "../interfaces/Movie"
import useMovieStore from "../store"

interface LikedButtonProps {
	movie: Movie
}

const LikedButton = (props: LikedButtonProps) => {
	const movie = props.movie
	const updateStatus = useMovieStore((state) => state.updateMovieStatus)
	const addToLikedList = () => {
		movie.status =
			movie.status === MovieStatus.Liked ? MovieStatus.None : MovieStatus.Liked
		updateStatus(movie)
		console.log(`Liked ${movie.name}`)
	}

	return movie.status === MovieStatus.None ? (
		<button title='Liked?' onClick={addToLikedList}>
			<FontAwesomeIcon icon={faSmile} />
		</button>
	) : null
}

export default LikedButton
