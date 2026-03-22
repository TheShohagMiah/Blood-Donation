export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  samSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
