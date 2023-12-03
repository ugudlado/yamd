import { useEffect, useState } from "react"
import "reactjs-popup/dist/index.css"
import { Movie, MovieStatus } from "../interfaces/Movie"
import ButtonBar from "./ButtonBar"
import ShareButton from "./ShareButton"

interface MovieCardDetailProps {
	movie: Movie
}

const MovieCardDetail = (props: MovieCardDetailProps) => {
	let [movie, setMovie] = useState(props.movie)

	const updateMovie = (movie: Movie) => {
		setMovie(movie)
	}

	const getMovieStatus = (status: MovieStatus) => {
		return status !== MovieStatus.DidntWatch ? (
			<div className='text-lg'>{status}</div>
		) : null
	}

	useEffect(() => {
		setMovie(movie)
	}, [movie, setMovie])

	return (
		<div key={movie.id} className='text-3xl'>
			<div className='font-sans text-5xl font-extralight'>{movie.name}</div>
			<div className='font-sans text-xl font-extralight'>{movie.name}</div>
			<div className='flex flex-row justify-between gap-5'>
				<ShareButton movie={movie} />
				{getMovieStatus(movie.status)}
				<ButtonBar movie={movie} updateMovie={updateMovie} />
			</div>
		</div>
	)
}
export default MovieCardDetail
