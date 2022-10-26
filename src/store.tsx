import create from 'zustand';
import { Movie } from './interfaces/Movie';

const movies: Movie[] = []
for (let index = 0; index < 10; index++) {
  movies.push({id:index,name:`Movie${index}`})

}

interface MovieState {
  movies: Movie[]
}


const useMovieStore = create<MovieState>((set) => ({
  movies: movies
}))

export default useMovieStore;
