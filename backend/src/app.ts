import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import storeRoutes from "./modules/store/store.routes";

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);

export default app;
