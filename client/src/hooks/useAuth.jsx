import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user } = useSelector((state) => state.auth);

  // If user object exists, we consider them authenticated.
  return !!user;
};
