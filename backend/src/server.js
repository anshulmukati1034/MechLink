import express from "express";
import cors from "cors";
import { connectDB, sequelize } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3001;



// DB Connect + Sync
connectDB();
sequelize.sync(); // auto create tables

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
