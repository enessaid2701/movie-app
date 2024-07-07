import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { searchMovies } from '../api/tmdbApi';
import { Link } from 'react-router-dom';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query.trim()) {
      const searchResults = await searchMovies(query, 1);
      setResults(searchResults);
      setCurrentPage(1);
      setHasMore(true);
    }
  };

  const fetchMoreMovies = async () => {
    const nextPage = currentPage + 1;
    const searchResults = await searchMovies(query, nextPage);
    if (searchResults.length > 0) {
      setResults((prevResults) => [...prevResults, ...searchResults]);
      setCurrentPage(nextPage);
    } else {
      setHasMore(false);
    }
  };

  const truncateOverview = (overview, maxLength) => {
    if (overview.length <= maxLength) {
      return overview;
    } else {
      return overview.substring(0, maxLength) + '...';
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Search Movies</h1>
      <form onSubmit={handleSearch}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">Search</button>
          </div>
        </div>
      </form>
      <InfiniteScroll
        dataLength={results.length}
        next={fetchMoreMovies}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more movies to load.</p>}
      >
        <div className="row">
          {results.map((movie) => (
            <div className="col-md-3 mb-4" key={movie.id}>
              <div className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{truncateOverview(movie.title, 25)}</h5>
                  <p className="card-text">{truncateOverview(movie.overview, 50)}</p>
                  <Link to={`/movie/${movie.id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default SearchPage;
