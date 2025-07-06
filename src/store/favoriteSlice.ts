import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MovieType } from "../pages/Home";

export interface favoriteState {
  items: MovieType[];
}

const initialState: favoriteState = {
  items: [],
};

export const FavoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<MovieType>) => {
      const exists = state.items.find(
        (item) => item.imdbID === action.payload.imdbID
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.imdbID !== action.payload
      );
    },
  },
});

export const { addToFavorites, removeFromFavorites } = FavoriteSlice.actions;

export default FavoriteSlice.reducer;
