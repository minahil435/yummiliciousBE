const express = require("express");
const router = express.Router();
const multer = require("multer")

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') { cb(null, false) }
  else { cb(null, true) }
}
const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,'./uploads/')
  },
  filename:function(req,file,cb){
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage , limits :{filesize: 1024 * 1024 * 5}})

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
  upload.single('userImage'),
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsStrongPasswordFunc,
  checkIsEmailFunc,
  // checkIsAlphaFunc,
  // checkIsAlphanumericFunc,
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
