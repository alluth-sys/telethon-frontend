import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/states/user/userSlice";
import socketSlice from "@/states/socket/socketSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
