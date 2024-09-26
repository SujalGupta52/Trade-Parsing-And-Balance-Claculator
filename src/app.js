import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import updateRouter from "./routes/updataRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database setup
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use("/update-database", updateRouter);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).send({ message: "An error occurred" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
