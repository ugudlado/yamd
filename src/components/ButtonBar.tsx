import { Movie } from "../interfaces/Movie"
import CancelButton from "./CancelButton"
import LikedButton from "./LikedButton"
import RecommendedButton from "./RecommendedButton"
import ShareButton from "./ShareButton"
import TimePassButton from "./TimePassButton"
import WatchLaterButton from "./WatchLaterButton"

interface ButtonBarProps {
	movie: Movie
}

const ButtonBar = (props: ButtonBarProps) => {
	const movie = props.movie

	return (
		<div className='flex flex-row'>
			<WatchLaterButton movie={movie} />
			<TimePassButton movie={movie} />
			<LikedButton movie={movie} />
			<RecommendedButton movie={movie} />
			<CancelButton movie={movie} />
			<ShareButton movie={movie} />
		</div>
	)
}

export default ButtonBar
