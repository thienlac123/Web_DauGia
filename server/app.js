import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import auctionRoutes from "./src/routes/auctionRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);

export default app;