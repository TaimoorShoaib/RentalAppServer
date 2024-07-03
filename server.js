import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";

import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

//dot env config
config();

//database connection
connectDB();

//STRIPE CONFIG
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//CLOUDINARY CONFIG
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//rest object
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
//const io = new Server(httpServer, {});
//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:19006",
    credentials: true,
  })
);
app.use(cookieParser());

//routes import
import userRoutes from "./routes/userRoutes.js";
import bannerImageRoute from "./routes/bannerImageRoute.js";
import carpostRoutes from "./routes/carpostRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import rentedInfoRoute from "./routes/rentedInfoRoute.js";
//route
app.use("/api", userRoutes);
app.use("/api/banner", bannerImageRoute);
app.use("/api/post/car", carpostRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/renter", rentedInfoRoute);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome to node FlexShare</h1>");
});


const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`.bgMagenta.white);
});
