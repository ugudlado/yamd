import "../css/MovieCards.css";
import { Movie } from "../interfaces/Movie";
import MovieCard from "./MovieCard";

interface MovieCardsProps{
    movies: Movie[]
}

const MovieCards = (props: MovieCardsProps) => {
    const movieComponents = props.movies.map(movie => MovieCard({movie}));
    return (
        <div className="flex flex-wrap">
            {movieComponents}
        </div>
    )
}
export default MovieCards;
