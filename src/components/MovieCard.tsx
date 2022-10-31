import { useState } from "react"
import { Movie, MovieStatus } from "../interfaces/Movie"
import ButtonBar from "./ButtonBar"
import ShareButton from "./ShareButton"

interface MovieCardProps {
	movie: Movie
}

const MovieCard = (props: MovieCardProps) => {
	let [hover, setHover] = useState(false)
	let movie = props.movie
	const toggleHover = () => {
		setHover(!hover)
	}

	const getMovieStatus = (status: MovieStatus) => {
		return movie.status !== MovieStatus.DidntWatch ? (
			<div className='text-lg'>{status}</div>
		) : null
	}

	return (
		<div
			onMouseEnter={toggleHover}
			onMouseLeave={toggleHover}
			key={movie.id}
			className='w-64 h-80 text-3xl flex flex-col rounded-lg justify-between m-2 text-center bg-zinc-50 border-2 transition ease-in-out duration-300 hover:shadow-2xl hover:border-black'>
			<div className='font-sans text-5xl font-extralight'>{movie.name}</div>
			<div className='flex flex-row justify-between gap-5'>
				<ShareButton movie={movie} />
				{getMovieStatus(movie.status)}
				{(hover || movie.status !== MovieStatus.DidntWatch) && (
					<ButtonBar movie={movie} toggleHover={toggleHover} />
				)}
			</div>
		</div>
	)
}
export default MovieCard
