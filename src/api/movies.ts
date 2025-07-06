import axios from "axios";

const API_KEY = "c7164555";
const BASE_URL = "https://www.omdbapi.com/";

export const searhMovies = async (query: string) => {
  const response = await axios.get(BASE_URL, {
    params: {
      apiKey: API_KEY,
      s: query,
    },
  });

  if (response.data.Response === "False") {
    throw new Error(response.data.Error || "No, results found");
  }

  return response.data.Search;
};

export const getMovieDetails = async (imdbID: string) => {
  const response = await axios.get(BASE_URL, {
    params: {
      apiKey: API_KEY,
      i: imdbID,
      plot: "full",
    },
  });

  if (response.data.Response === "False") {
    throw new Error(response.data.Error || "Movie not found");
  }

  return response.data;
};



export const fetchMovieById = async (id: string) => {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
};