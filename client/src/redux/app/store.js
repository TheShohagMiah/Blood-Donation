import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import uiReducer from "../slices/uiSlice";
import { authApi } from "../features/isAuth/authApi";

import { rtkQuerySuccessLogger } from "../middleware/successLogger";
import { bloodRequestApi } from "../features/bloodRequest/bloodRequestApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [bloodRequestApi.reducerPath]: bloodRequestApi.reducer,
    auth: authReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      bloodRequestApi.middleware,
      rtkQuerySuccessLogger,
    ),
});
