import '../css/App.css';
import { Movie } from '../interfaces/Movie';
import MovieCards from './MovieCards';

const movies: Movie[] = []
for (let index = 0; index < 10; index++) {
  movies.push({id:index,name:`Movie${index}`})

}

const App = () => {
  return (
    <div className="flex justify-center ml-20 mr-20">
      <MovieCards movies={movies} />
    </div>
  );
}

export default App;
