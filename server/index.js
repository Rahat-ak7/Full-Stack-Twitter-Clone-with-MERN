import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

// CONFIGRAUTION OF ENV FILE
dotenv.config({
  path: ".env",
});

// DATABASE CONNECTION
databaseConnection();
const app = express();

// MIDDLEWARES
app.use(
  express.urlencoded({
    extended: true,
  })
);
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOption));

app.use(express.json());
app.use(cookieParser());

// ROUTES/ API
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
