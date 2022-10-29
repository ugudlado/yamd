import { useState } from "react"
import { Movie, MovieStatus } from "../interfaces/Movie"
import ButtonBar from "./ButtonBar"

interface MovieCardProps {
	movie: Movie
}

const MovieCard = (props: MovieCardProps) => {
	let [hover, setHover] = useState(false)
	let movie = props.movie
	const onHover = () => {
		setHover(!hover)
	}

	const getMovieStatus = (status: MovieStatus) => {
		let labelTxt = null
		switch (status) {
			case MovieStatus.WatchLater:
				labelTxt = "Watch later"
				break
			case MovieStatus.Liked:
				labelTxt = "Liked"
				break
			case MovieStatus.Recommended:
				labelTxt = "Recommended"
				break
			case MovieStatus.Timepass:
				labelTxt = "Time pass"
				break
			case MovieStatus.None:
				return null
		}
		return <div>{labelTxt}</div>
	}

	return (
		<div
			onMouseEnter={onHover}
			onMouseLeave={onHover}
			key={movie.id}
			className='w-64 h-80 text-3xl flex flex-col justify-between m-2 text-center bg-zinc-50 border-2 transition ease-in-out duration-300 hover:shadow-2xl'>
			<div>{movie.name}</div>
			<div className='flex flex-row'>
				{getMovieStatus(movie.status)}
				{<ButtonBar movie={movie} />}
			</div>
		</div>
	)
}
export default MovieCard
