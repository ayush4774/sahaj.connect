import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import centerRoutes from "./src/routes/center.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/centers", centerRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});