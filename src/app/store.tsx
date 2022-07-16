import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../states/user/userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
  },
});
