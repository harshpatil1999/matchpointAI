import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";

dotenv.config();

await connectToDB();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
