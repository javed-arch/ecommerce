import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startServer } from "./config/server.js";
import { handleError } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

//configure env
dotenv.config();

//exp object
const app = express();

//middelwares
app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/order", orderRoutes);
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce Backend</h1>");
});

// error handler
app.use(handleError);

//run listen
const PORT = process.env.PORT || 8080;
startServer(app, PORT, process.env.CONNECTION_URL);
