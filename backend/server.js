import express from "express";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orederRouter from "./routes/orderRoutes.js";
import dotenv from "dotenv";
import path from "path";
import { log } from "console";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Mongodb has been connnected"))
  .catch((error) => console.log(error));


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_KEY || "sb");
});

// app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRoutes);
app.use("/api/orders", orederRouter);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "/frontend/build/index.html"));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`listening on ${process.env.MONGODB_URI}`);
});
