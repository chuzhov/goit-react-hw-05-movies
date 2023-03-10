import { useEffect, useState } from 'react';
import Button from 'components/Button/Button';
import { getPopularMovies } from 'utils/fetchAPI';
import { useLocation } from 'react-router-dom';
import MovieCard from 'components/MovieCard/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1); //getting page from state nor from search
  const location = useLocation();
  // const [isLoading, setIsLoading] = useState(false);

  const updatePage = () => {
    setPage(page => page + 1);
  };

  useEffect(() => {
    const updateTrendings = () => {
      //   setIsLoading(true);
      if (movies.length > 0 && page === 1) return;
      getPopularMovies(page)
        .then(data => {
          //Removing repetitive movies the backend returns sometimes
          if (data.results.length > 0 && movies.length > 0) {
            for (let i = 0; i < movies.length; i++) {
              for (let j = 0; j < data.results.length; j++) {
                if (data.results[j].id === movies[i].id) {
                  data.results.splice(j, 1);
                }
              }
            }
          }
          setMovies(movies =>
            page === 1 ? data.results : [...movies, ...data.results]
          );
          page === 1 && setTotalResults(data.total_results);
        })
        .catch(err => console.log(err));
      //        .finally(() => setIsLoading(false));
    };
    updateTrendings();
    // eslint-disable-next-line
  }, [page]);

  return (
    <>
      <h2 style={{ color: 'orange' }}>Featured this week:</h2>
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          margin: '0 2rem 1rem',
        }}
      >
        {movies.map(movie => (
          <MovieCard key={movie.id} movieData={movie} location={location} />
        ))}
      </ul>

      {/* {isLoading && <h1>Loading...</h1>} */}
      {movies.length > 0 && movies.length < totalResults && (
        <Button onClick={updatePage} />
      )}
    </>
  );
};

export default Home;
