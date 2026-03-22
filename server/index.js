import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
dotenv.config();

const { PORT, DB_HOST: HOST } = process.env;

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
