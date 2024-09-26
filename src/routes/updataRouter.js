import { Router } from "express";
import multer from "multer";
import fs from "fs";
import csvParser from "csv-parser";
import Trade from "../models/Trade.js";

const updateRouter = Router();
const upload = multer({ dest: "uploads/" });

updateRouter.post("/", upload.single("file"), (req, res, next) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => {
      const [BaseCoin, QuoteCoin] = data.Market.split("/");
      results.push({
        UTC_Time: new Date(data.UTC_Time),
        Operation: data.Operation.toUpperCase(),
        Market: data.Market,
        BaseCoin,
        QuoteCoin,
        Amount: parseFloat(data["Buy/Sell Amount"]),
        Price: parseFloat(data.Price),
      });
    })
    .on("end", async () => {
      await Trade.deleteMany({});
      await Trade.insertMany(results);
      res.json({ message: "File successfully uploaded and data stored." });
    })
    .on("error", (err) => {
      console.log(err);
      next(err);
    });
});

export default updateRouter;
