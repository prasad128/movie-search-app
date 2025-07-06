import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { searhMovies } from "../api/movies";
import MovieCard from "../Components/MovieCard";
import useDebounce from "../Hooks/useDebounce";

export interface MovieType {
  imdbID: string;
  Title: string;
  Type: string;
  Year: string;
  Poster: string;
}

const Home = () => {
  const [query, setQuery] = useState<string>(() => {
    const newQuery = localStorage.getItem("inputQuery");
    return newQuery ? newQuery : "";
  });
  const queryRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(query, 400);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movies", debouncedValue],
    queryFn: () => searhMovies(debouncedValue),
    enabled: debouncedValue.length > 2,
  });

  useEffect(() => {
    localStorage.setItem("inputQuery", query);
  }, [query]);

  useEffect(() => {
    if (queryRef.current) {
      queryRef.current.focus();
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        <span className="text-neutral-800">
          <FontAwesomeIcon icon={faVideo} />
        </span>{" "}
        Movies Search
      </h1>
      <input
        type="text"
        value={query}
        ref={queryRef}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
        }}
        className="w-full border rounded shadow p-3 mb-6"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>{(error as Error).message}</p>}
      {!isLoading &&
        !isError &&
        debouncedValue.length > 2 &&
        data.length === 0 && <p>No movies found</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.map((movie: MovieType) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;
