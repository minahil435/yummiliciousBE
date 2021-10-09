var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

require("dotenv").config();
// const rateLimit = require("express-rate-limit");
var mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((e) => {
    console.log(e);
  });

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass");
const errorController = require("./routes/utils/errorController");
const userRouter = require("./routes/user/userRouter");
const recipeRouter = require("./routes/recipe/recipeRouter");

// const limiter = rateLimit({
//     max: 20,
//     windowMs: 1 * 60 * 1000, //this is in millie second
//     message:
//       "Too many requests from this IP, please try again or contact support",
//   });

var app = express();
app.use(cors());
// app.use("/api", limiter);

app.use(logger('dev'));
app.use('/uploads',express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/recipe",recipeRouter)

app.all("*", function (req, res, next) {
    next(
      new ErrorMessageHandlerClass(
        `Cannot find ${req.originalUrl} on this server! Check your URL`,
        404
      )
    );
  });
  
  app.use(errorController);

module.exports = app;
