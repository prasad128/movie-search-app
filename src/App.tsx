import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHouseUser } from "@fortawesome/free-solid-svg-icons";

const MovieDetails = lazy(() => import("./pages/MovieDetails"));

function App() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-gray-100 min-h-screen">
      <nav className="flex justify-between">
        <Link to="/" className=" font-semibold text-red-600">
          <span className="mr-1 text-purple-600">
            <FontAwesomeIcon icon={faHouseUser} />
          </span>
          Home
        </Link>
        <Link to="/favorites" className="text-purple-600 font-semibold">
          <span className="mr-1 text-red-600">
            <FontAwesomeIcon icon={faHeart} />
          </span>
          Favorites
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/movie/:imdbID"
          element={
            <Suspense fallback={<p>Loading...</p>}>
              <MovieDetails />
            </Suspense>
          }
        />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
