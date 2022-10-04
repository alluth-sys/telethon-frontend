import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/states/user/userSlice";
import playSlice from "@/states/play/playSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    play: playSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
