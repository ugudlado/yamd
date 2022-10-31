import { Movie, MovieStatus } from "../interfaces/Movie"
import StatusButton from "./StatusButton"

interface ButtonBarProps {
	movie: Movie
	toggleHover: () => void
}

const ButtonBar = (props: ButtonBarProps) => {
	const movie = props.movie

	return movie.status === MovieStatus.DidntWatch ? (
		<div className='flex justify-between grow'>
			{[
				MovieStatus.WatchLater,
				MovieStatus.Timepass,
				MovieStatus.Liked,
				MovieStatus.Recommendation,
			].map((ms) => (
				<StatusButton
					movie={movie}
					status={ms}
					toggleHover={props.toggleHover}
				/>
			))}
		</div>
	) : (
		<StatusButton
			movie={movie}
			status={MovieStatus.DidntWatch}
			toggleHover={props.toggleHover}
		/>
	)
}

export default ButtonBar
