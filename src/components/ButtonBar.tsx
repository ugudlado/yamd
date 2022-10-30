import { Movie, MovieStatus } from "../interfaces/Movie"
import StatusButton from "./StatusButton"

interface ButtonBarProps {
	movie: Movie
}

const ButtonBar = (props: ButtonBarProps) => {
	const movie = props.movie

	return movie.status === MovieStatus.DidntWatch ? (
		<div className='flex justify-between grow'>
			<StatusButton movie={movie} status={MovieStatus.WatchLater} />
			<StatusButton movie={movie} status={MovieStatus.Timepass} />
			<StatusButton movie={movie} status={MovieStatus.Liked} />
			<StatusButton movie={movie} status={MovieStatus.Recommendation} />
		</div>
	) : (
		<StatusButton movie={movie} status={MovieStatus.DidntWatch} />
	)
}

export default ButtonBar
