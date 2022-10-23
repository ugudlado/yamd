import '../css/MovieCard.css';
import { Movie } from '../interfaces/Movie';

interface MovieCardProps {
    movie: Movie
}

const MovieCard = (props: MovieCardProps) => {
    return (
        <div key= {props.movie.id} className="card text-3xl m-2 border-2 border-black text-center">
            {props.movie.name}
        </div>
    )
}
export default MovieCard
