import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import uiReducer from "../slices/uiSlice";
import { authApi } from "../features/isAuth/authApi";

import { rtkQuerySuccessLogger } from "../middleware/successLogger";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, rtkQuerySuccessLogger),
});
