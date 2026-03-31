import { isFulfilled } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const rtkQuerySuccessLogger = (api) => (next) => (action) => {
  if (isFulfilled(action) && action.meta.arg.type === "mutation") {
    const serverMessage = action.payload?.message;
    const endpoint = action.meta.arg.endpointName;

    const catalog = {
      userRegistration: "Account has been created",
      userLogin: "Access Granted.",
    };

    const finalMessage = serverMessage || catalog[endpoint];

    if (finalMessage) {
      toast.success(finalMessage);
    }
  }

  return next(action);
};
