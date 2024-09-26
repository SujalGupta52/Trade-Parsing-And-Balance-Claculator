import { Schema, model } from "mongoose";

const tradeSchema = Schema({
  UTC_Time: { type: Date, required: true },
  Operation: { type: String, enum: ["BUY", "SELL"], required: true },
  Market: { type: String, required: true },
  BaseCoin: { type: String, required: true },
  QuoteCoin: { type: String, required: true },
  Amount: { type: Number, required: true },
  Price: { type: Number, required: true },
});

const Trade = model("Trade", tradeSchema);
export default Trade;
