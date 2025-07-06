import React from "react";
import { Link } from "react-router-dom";
import type { MovieType } from "../pages/Home";

interface MovieProps {
  movie: MovieType;
}

const MovieCard: React.FC<MovieProps> = ({
  movie: { Poster, Title, Year, imdbID },
}) => {
  return (
    <Link
      to={`/movie/${imdbID}`}
      className="border rounded shadow p-4 flex flex-col items-center text-center"
    >
      <img
        src={
          Poster !== "N/A"
            ? Poster
            : "https://via.placeholder.com/200x300?text=No+Image"
        }
        alt={Title}
        className="w-full h-72 object-cover mb-4"
      />
      <h2 className="font-semibold text-lg">{Title}</h2>
      <p className="text-gray-500">{Year}</p>
    </Link>
  );
};

export default MovieCard;
