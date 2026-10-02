import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import resumeAnalyzerRoutes from "./routes/resumeAnalyzer.routes.js";
import cors from "cors";

dotenv.config();

await connectToDB();

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/user", userRoutes);
app.use("/api/resumeAnalyzer", resumeAnalyzerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
