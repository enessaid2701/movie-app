import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchPopularMovies, fetchMovies } from '../api/tmdbApi';

function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // sonsuz kaydırma için

  useEffect(() => {
    const fetchPopularMoviesData = async () => {
      const popularMoviesData = await fetchPopularMovies();
      setPopularMovies(popularMoviesData);
    };

    fetchPopularMoviesData();
  }, []);

  useEffect(() => {
    const fetchAllMoviesByPage = async () => {
      console.log('Fetching movies for page:', currentPage); // Konsol logu eklendi
      const allMoviesData = await fetchMovies(currentPage);
      console.log('Movies fetched:', allMoviesData); // Konsol logu eklendi
      if (allMoviesData.length > 0) {
        setAllMovies((prevMovies) => [...prevMovies, ...allMoviesData]);
      } else {
        setHasMore(false);
      }
    };

    fetchAllMoviesByPage();
  }, [currentPage]);

  const fetchMoreMovies = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const truncateOverview = (overview, maxLength) => {
    if (overview.length <= maxLength) {
      return overview;
    } else {
      return overview.substring(0, maxLength) + '...';
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true, // Slider'ı durdurmak için eklendi
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Popular Movies</h1>
      <Slider {...settings}>
        {popularMovies.map((movie) => (
          <div key={movie.id}>
            <div className="card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />
              </Link>
            </div>
          </div>
        ))}
      </Slider>

      <h1 className="mt-4 mb-4">All Movies</h1>
      <InfiniteScroll
        dataLength={allMovies.length}
        next={fetchMoreMovies}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more movies to load.</p>}
      >
        <div className="row">
          {allMovies.map((movie) => (
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

export default HomePage;