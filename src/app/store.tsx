import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "@/states/user/userSlice";
import friendSlice from "@/states/user/friendSlice";
import settingSlice from "@/states/user/settingSlice";

const combinedReducer = combineReducers({
  user: userSlice,
  friend: friendSlice,
  setting: settingSlice,
});

// @ts-ignore
const rootReducer = (state, action) => {
  if (action.type === "user/setUserLoggedOut") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //@ts-ignore
        ignoreActions: ["user/setFriendChatHistory"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
