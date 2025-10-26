import express from "express";
import cors from "cors";
import { profileRouter } from "./profile-router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/profile", profileRouter);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
