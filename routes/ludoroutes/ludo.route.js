const express = require("express");
const {
  UpdateSingleUser,
  GetSingleUser,
  UserLogin,
} = require("../../controllers/ludocontroller/user.controller");
const {
  GetAllCasinoBet,
} = require("../../controllers/ludocontroller/casino.controller");
const {
  GetAllTransaction,
  GetSingleTransaction,
  CreateTransaction,
  UpdateSingleTransaction,
} = require("../../controllers/ludocontroller/Transaction.controller");

const LudoRouter = express.Router();

LudoRouter.post("/user-login", UserLogin);
LudoRouter.patch("/update-single-user", UpdateSingleUser);
LudoRouter.get("/get-single-user", GetSingleUser);
LudoRouter.get("/get-all-bet", GetAllCasinoBet);
LudoRouter.get("/get-all-transaction", GetAllTransaction);
LudoRouter.get("/get-single-transaction", GetSingleTransaction);
LudoRouter.patch("/create-transaction", CreateTransaction);
LudoRouter.delete("/update-single-transaction", UpdateSingleTransaction);

[
  {
    marketId: "1.223742001",
    updateTime: "2024-01-23T16:06:26.579584+01:00",
    status: "OPEN",
    inplay: false,
    totalMatched: 227510.37,
    runners: [
      {
        selectionId: 16606,
        handicap: 0,
        status: "ACTIVE",
        lastPriceTraded: 1.23,
        totalMatched: 198379.8,
        adjustmentFactor: 0,
        ex: {
          availableToBack: [
            { price: 1.23, size: 635 },
            { price: 1.22, size: 3995.58 },
            { price: 1.21, size: 3052.75 },
          ],
          availableToLay: [
            { price: 1.24, size: 516.21 },
            { price: 1.25, size: 11.71 },
            { price: 1.26, size: 8.73 },
          ],
        },
      },
      {
        selectionId: 235,
        handicap: 0,
        status: "ACTIVE",
        lastPriceTraded: 48,
        totalMatched: 3788.29,
        adjustmentFactor: 0,
        ex: {
          availableToBack: [
            { price: 48, size: 22 },
            { price: 46, size: 73.3 },
            { price: 44, size: 83.15 },
          ],
          availableToLay: [
            { price: 50, size: 35.45 },
            { price: 55, size: 169.61 },
            { price: 65, size: 90 },
          ],
        },
      },
      {
        selectionId: 60443,
        handicap: 0,
        status: "ACTIVE",
        lastPriceTraded: 5.8,
        totalMatched: 25342.28,
        adjustmentFactor: 0,
        ex: {
          availableToBack: [
            { price: 5.8, size: 58.19 },
            { price: 5.7, size: 55.22 },
            { price: 5.5, size: 2.45 },
          ],
          availableToLay: [
            { price: 6, size: 563.59 },
            { price: 6.2, size: 228.21 },
            { price: 6.4, size: 333.29 },
          ],
        },
      },
    ],
  },
];

[
  {
    SelectionId: "3",
    RunnerName: "10 over runs ADKR(ADKR vs MIE)adv",
    LayPrice1: "53.00",
    LaySize1: "100.00",
    BackPrice1: "54.00",
    BackSize1: "100.00",
    GameStatus: "",
    MarkStatus: "",
  },
  {
    SelectionId: "5",
    RunnerName: "15 over runs ADKR(ADKR vs MIE)adv",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "116",
    RunnerName: "10 over run bhav ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "147",
    RunnerName: "Only 11 over run ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "SUSPENDED",
    MarkStatus: "",
  },
  {
    SelectionId: "110",
    RunnerName: "9.3 over run ADKR",
    LayPrice1: "49.00",
    LaySize1: "100.00",
    BackPrice1: "50.00",
    BackSize1: "100.00",
    GameStatus: "",
    MarkStatus: "",
  },
  {
    SelectionId: "125",
    RunnerName: "12 over run ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "204",
    RunnerName: "8.4 to 8.6 ball No Boundaries ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "205",
    RunnerName: "9.1 to 9.3 ball No Boundaries ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "SUSPENDED",
    MarkStatus: "",
  },
  {
    SelectionId: "8",
    RunnerName: "20 over runs ADKR(ADKR vs MIE)adv",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "36",
    RunnerName: "20 over run ADKR 2",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "37",
    RunnerName: "20 over run bhav ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "38",
    RunnerName: "20 over run bhav ADKR 2",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "66",
    RunnerName: "Fall of 7th wkt ADKR",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "SUSPENDED",
    MarkStatus: "",
  },
  {
    SelectionId: "173",
    RunnerName: "I Wasim run",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "Ball Running",
    MarkStatus: "",
  },
  {
    SelectionId: "176",
    RunnerName: "A Russell run",
    LayPrice1: "36.00",
    LaySize1: "110.00",
    BackPrice1: "36.00",
    BackSize1: "90.00",
    GameStatus: "",
    MarkStatus: "",
  },
  {
    SelectionId: "182",
    RunnerName: "I Wasim run bhav",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "SUSPENDED",
    MarkStatus: "",
  },
  {
    SelectionId: "183",
    RunnerName: "A Russell run bhav",
    LayPrice1: "18.00",
    LaySize1: "12.00",
    BackPrice1: "18.00",
    BackSize1: "9.00",
    GameStatus: "",
    MarkStatus: "",
  },
  {
    SelectionId: "177",
    RunnerName: "A Russell boundaries",
    LayPrice1: "0.00",
    LaySize1: "0.00",
    BackPrice1: "0.00",
    BackSize1: "0.00",
    GameStatus: "SUSPENDED",
    MarkStatus: "",
  },
  {
    SelectionId: "178",
    RunnerName: "How many balls face by A Russell",
    LayPrice1: "23.00",
    LaySize1: "120.00",
    BackPrice1: "23.00",
    BackSize1: "100.00",
    GameStatus: "",
    MarkStatus: "",
  },
];




