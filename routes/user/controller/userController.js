const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");


async function signup(req, res, next) {
  const { email, password } = req.body;
  const { errorObj } = res.locals;

  console.log(req.file.path)

  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  }

  try {
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new User({
      email,
      password: hashedPassword,
      userImage: req.file.path
    });

    let newUser = await createdUser.save();

    let jwtToken = jwt.sign(
      {
        email: newUser.email,
        userImage: newUser.userImage
      },
      process.env.PRIVATE_JWT_KEY,
      {
        expiresIn: "5d",
      }
    );

    res.json({ message: "success", payload: jwtToken });

  } catch (e) {
    next(e);
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const { errorObj } = res.locals;

  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  }

  try {
    let foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      res.status(400).json({
        message: "failure",
        payload: "Please check your email and password",
      });
    } else {
      //password = 1, foundUser.password = $2a$12$tauL3AEb5gvKdcQdDKNWLeIYv422jNq2aRsaNWF5J4TdcWEdhq4CO
      let comparedPassword = await bcrypt.compare(password, foundUser.password);

      if (!comparedPassword) {
        res.status(400).json({
          message: "failure",
          payload: "Please check your email and password",
        });
      } else {
        console.log(foundUser)
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
            userImage: foundUser.userImage
          },
          process.env.PRIVATE_JWT_KEY,
          {
            expiresIn: "5d",
          }
        );

        res.json({ message: "success", payload: jwtToken });
      }
    }
  } catch (e) {
    res.json({ message: "error", error: e });
  }
}

module.exports = { signup, login };
