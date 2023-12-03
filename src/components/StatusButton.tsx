import {
	faGrinStars,
	faMeh,
	faSmile,
	faXmarkCircle,
} from "@fortawesome/free-regular-svg-icons"
import { faThumbTack } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Movie, MovieStatus } from "../interfaces/Movie"
import useMovieStore from "../store"

interface StatusButtonProps {
	movie: Movie
	status: MovieStatus
	toggleHover?: () => void
	updateMovie?: (movie: Movie) => void
}

const StatusButton = (props: StatusButtonProps) => {
	const movie = props.movie
	const updateStatus = useMovieStore((state) => state.updateMovieStatus)
	const onClickStatusButton = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		movie.status = props.status
		updateStatus(movie)
		if (props.updateMovie) props.updateMovie(movie)
		if (props.toggleHover) props.toggleHover()
	}

	const icon = (status: MovieStatus) => {
		switch (status) {
			case MovieStatus.WatchLater:
				return faThumbTack
			case MovieStatus.Liked:
				return faSmile
			case MovieStatus.Recommendation:
				return faGrinStars
			case MovieStatus.Timepass:
				return faMeh
			case MovieStatus.DidntWatch:
				return faXmarkCircle
		}
	}

	return (
		<button title={props.status} onClick={onClickStatusButton}>
			<FontAwesomeIcon icon={icon(props.status)} className='hover:text-3xl' />
		</button>
	)
}

export default StatusButton
