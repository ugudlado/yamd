import { Movie, MovieStatus } from "../interfaces/Movie"
import StatusButton from "./StatusButton"

interface ButtonBarProps {
	movie: Movie
	toggleHover?: () => void
	updateMovie?: (movie: Movie) => void
}

const ButtonBar = (props: ButtonBarProps) => {
	const movie = props.movie

	return movie.status === MovieStatus.DidntWatch ? (
		<div className='flex justify-between grow w-1/5'>
			{[
				MovieStatus.WatchLater,
				MovieStatus.Timepass,
				MovieStatus.Liked,
				MovieStatus.Recommendation,
			].map((ms) => (
				<StatusButton
					key={`${movie.id}-${ms}`}
					movie={movie}
					status={ms}
					toggleHover={props.toggleHover}
					updateMovie={props.updateMovie}
				/>
			))}
		</div>
	) : (
		<StatusButton
			movie={movie}
			status={MovieStatus.DidntWatch}
			toggleHover={props.toggleHover}
			updateMovie={props.updateMovie}
		/>
	)
}

export default ButtonBar
