import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import spisReducer from "./spisSlice";
import sppsReducer from "./sppsSlice";
import spqsReducer from "./spqsSlice";

const persistConfig = {
  key: "root",
  storage,
};

// Gabungkan semua slice
const appReducer = combineReducers({
  spis: spisReducer,
  spps: sppsReducer,
  spqs: spqsReducer,
});

// 🧹 Reducer utama dengan kemampuan reset semua data
const rootReducer = (state, action) => {
  // Kalau user logout atau submit terakhir, hapus semua state redux
  if (action.type === "RESET_ALL_DOCUMENTS") {
    storage.removeItem("persist:root"); // bersihkan data persist
    state = undefined; // reset state redux ke awal
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);