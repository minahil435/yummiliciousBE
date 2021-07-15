const express = require("express");
const router = express.Router();

const { signup, login } = require("./controller/userController");

const checkIsUndefined = require("./helper/checkIsUndefined")
const checkIsEmptyFunc = require("./helper/checkIsEmptyFunc");
const checkIsStrongPasswordFunc = require("./helper/checkIsStrongPasswordFunc");

const {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
} = require("./helper/authMiddleware");

router.post(
  "/sign-up",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsStrongPasswordFunc,
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
  signup
);

router.post(
  "/login",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsEmailFunc,
  login
);

module.exports = router;
