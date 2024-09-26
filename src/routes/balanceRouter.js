import { Router } from "express";
import Trade from "../models/Trade.js";

const balanceRouter = Router();
balanceRouter.post("/", async (req, res, next) => {
  try {
    const { timestamp } = req.body;
    const result = await Trade.aggregate([
      {
        // Match all trades before the given timestamp
        $match: { UTC_Time: { $lte: new Date(timestamp) } },
      },
      {
        // Group by BaseCoin and calculate total buy and sell amounts
        $group: {
          _id: "$BaseCoin", // Group by BaseCoin (each unique coin)
          totalBuy: {
            $sum: {
              $cond: [{ $eq: ["$Operation", "BUY"] }, "$Amount", 0],
            },
          },
          totalSell: {
            $sum: {
              $cond: [{ $eq: ["$Operation", "SELL"] }, "$Amount", 0],
            },
          },
        },
      },
      {
        // Subtract total sell from total buy to get net balance for each coin
        $project: {
          _id: 1, // Keep the BaseCoin identifier
          balance: { $subtract: ["$totalBuy", "$totalSell"] }, // Calculate balance
        },
      },
    ]);
    const balance = {};
    result.forEach((coin) => {
      balance[coin._id] = coin.balance;
    });

    console.log(balance);

    res.json(balance);
  } catch (err) {
    next(err);
  }
});

export default balanceRouter;
