import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import storeRoutes from "./modules/store/store.routes";
import productRoutes from "./modules/product/product.routes";
const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/stores/:storeId/products", productRoutes);

export default app;
