import { Movie } from "../interfaces/Movie"

interface MovieCardProps {
	movie: Movie
}

const MovieCard = (props: MovieCardProps) => {
	return (
		<div
			key={props.movie.id}
			className='w-64 h-80 text-3xl m-2 text-center bg-zinc-50 border-2 transition ease-in-out duration-300 hover:shadow-2xl'>
			{props.movie.name}
		</div>
	)
}
export default MovieCard
