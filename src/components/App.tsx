import "../css/App.css"
import useMovieStore from "../store"
import Footer from "./Footer"
import MovieCards from "./MovieCards"
import NavBar from "./NavBar"

const App = () => {
	const movies = useMovieStore((state) => state.movies)
	return (
		<div className='ml-10 mr-10 justify-center flex flex-col'>
			<NavBar />
			<MovieCards movies={movies} />
			<Footer />
		</div>
	)
}

export default App
