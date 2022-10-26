import '../css/App.css';
import useMovieStore from '../store';
import MovieCards from './MovieCards';

const App = () => {
  const movies = useMovieStore(state => state.movies)
  return (
    <div className="flex justify-center ml-20 mr-20">
      <MovieCards movies={movies} />
    </div>
  );
}

export default App;
