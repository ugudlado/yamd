import "../css/App.css"
import useMovieStore from "../store"
import MovieCards from "./MovieCards"

const App = () => {
	const movies = useMovieStore((state) => state.movies)
	return (
		<div className='ml-10 mr-10 justify-center flex'>
			<MovieCards movies={movies} />
		</div>
	)
}

export default App
