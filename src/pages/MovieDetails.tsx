import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../api/movies";
import type { RootState } from "../store";
import { addToFavorites, removeFromFavorites } from "../store/favoriteSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const dispatch = useDispatch();

  const favorites = useSelector((state: RootState) => state.favorites.items);

  const isFavorite = favorites.some((item) => item.imdbID === imdbID);

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", imdbID],
    queryFn: () => getMovieDetails(imdbID!),
    enabled: !!imdbID,
  });

  if (isLoading) return <p>Loading movie details...</p>;
  if (isError || !movie) return <p>Movie not found.</p>;

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(imdbID!));
    } else {
      dispatch(addToFavorites(movie));
    }
  };

  console.log("Favorites->", favorites);
  console.log("Favorite->", isFavorite);

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-8">
        <button onClick={toggleFavorite} className="cursor-pointer">
          {isFavorite ? (
            <>
              Remove{" "}
              <span>
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </span>
            </>
          ) : (
            <>
              Add to Favorites{" "}
              <span className="text-red-600">
                <FontAwesomeIcon icon={faHeart} />
              </span>
            </>
          )}
        </button>
      </div>
      <img
        src={movie?.Poster}
        alt={movie?.Title}
        className="w-full h-[370px] object-cover"
      />
      <h1 className="text-2xl font-bold">{movie.Title}</h1>
      <p>
        <strong>Year: </strong>
        {movie.Year}
      </p>
      <p>
        <strong>Genre: </strong>
        {movie.Genre}
      </p>
      <p>
        <strong>Plot: </strong>
        {movie.Plot}
      </p>
    </div>
  );
};

export default MovieDetails;
