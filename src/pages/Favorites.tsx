import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector((state: RootState) => state.favorites.items);
  console.log("Favorites-->", favorites);
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
        {" "}
        💖 Favorite Movies
      </h1>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">No favorites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.map(({ imdbID, Poster, Title, Year }) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
