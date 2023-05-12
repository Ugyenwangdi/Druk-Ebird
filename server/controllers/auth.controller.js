import * as dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

import { Admin } from "../mongodb/models/admin.js";
import sendEmail from "../utils/sendEmail.js";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile.emails[0].value);
      Admin.findOrCreate(
        {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

const googleAuth = passport.authenticate("google", {
  scope: ["profile"],
});

const successGoogleLogin = async (req, res) => {
  if (req.user) {
    // console.log("id: ", req.user.id);
    // console.log("email: ", req.user.email);
    console.log(req.user);

    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        googleId: req.user.googleId,
        userType: req.user.userType,
      },
      process.env.JWTPRIVATEKEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      token,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

const failedGoogleLogin = async (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
};

const googleAuthCallback = passport.authenticate("google", {
  successRedirect: "http://localhost:3000/",
  failureRedirect: "/auth/login/failed",
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: "Unauthorized! token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    // console.log("decoded: ", decoded.userType);
    // console.log("decoded: ", decoded.googleId);
    // console.log("decoded: ", decoded.name);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ valid: false, message: "Unauthorized! Invalid token" });
  }
};

// route to check if user is logged in
const checkAuthStatus = (req, res) => {
  return res
    .status(200)
    .json({ user: req.user, valid: true, message: "User is logged in" });
};

function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,26}$/;
  return regex.test(password);
}

const baseRoute = (req, res) => {
  console.log("user: ", req.user);
  res.send({ message: "Hello World!" });
};

// const validateSession = (req, res) => {
//   const { sessionId } = req.body;
//   console.log("sessionId: ", req.user);
//   console.log("clientId: ", sessionId);

//   if (!sessionId) {
//     return res.status(401).json({ valid: false });
//   }

//   if (sessionId !== req.user.id) {
//     return res.status(401).json({
//       valid: false,
//     });
//   }
//   return res.status(200).json({
//     valid: true,
//   });
// };

// const checkAuthStatus = (req, res) => {
//   if (req.isAuthenticated()) {
//     // assuming you are using Passport.js for authentication
//     res.json({ isLoggedIn: true });
//   } else {
//     res.json({ isLoggedIn: false });
//   }
// };

const getAllUsers = async (req, res) => {
  // console.log("user: ", req.user);

  try {
    const users = await Admin.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  console.log("user register: ", req.user);

  try {
    // Check if the user is authorized to add new users
    if (req.user.userType !== "root-user") {
      console.log("not root user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("user: ", req.user.email);
    console.log("user: ", req.user.userType);

    // Check that name does not start with a number or is all numbers
    const name = req.body.name;
    if (/^\d/.test(name) || /^\d+$/.test(name)) {
      return res
        .status(400)
        .json({ message: "Name cannot start with a number or be all numbers" });
    }

    if (
      typeof req.body.name !== "string" ||
      req.body.name.length < 2 ||
      req.body.name.length > 50
    ) {
      return res
        .status(400)
        .json({ message: "Name must be a string between 2 and 50 characters" });
    }

    // Check that email does not contain uppercase
    const email = req.body.email.toLowerCase();
    if (req.body.email !== email) {
      return res
        .status(400)
        .json({ message: "Email must not contain uppercase letters" });
    }

    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check password validation
    if (
      !req.body.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,26}$/
      )
    ) {
      return res.status(400).json({
        message:
          "Password must be between 8 and 26 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    Admin.register(
      {
        email: email, // explicitly set the username field
        name: name,
      },
      req.body.password,
      (err, user) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        passport.authenticate("local")(req, res, () => {
          return res
            .status(200)
            .json({ message: "User registered successfully!" });
        });
      }
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", async (authErr, user, info) => {
    try {
      if (authErr || !user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      req.login(user, { session: false }, async (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            userType: user.userType,
            name: user.name,
            googleId: user.googleId,
          },
          process.env.JWTPRIVATEKEY,
          {
            expiresIn: "7d",
          }
        );

        return res.status(200).json({
          token,
          message: "Login successful",
        });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};

const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Admin.findOne({ _id: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editAdminUser = async (req, res) => {
  const { id } = req.params;

  // Check if the user is authorized to add new users
  if (req.user.userType !== "root-user") {
    console.log("not root user");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const name = req.body.name;
  console.log(name);
  if (/^\d/.test(name) || /^\d+$/.test(name)) {
    return res
      .status(400)
      .json({ message: "Name cannot start with a number or be all numbers" });
  }

  if (
    typeof req.body.name !== "string" ||
    req.body.name.length < 2 ||
    req.body.name.length > 50
  ) {
    return res
      .status(400)
      .json({ message: "Name must be a string between 2 and 50 characters" });
  }

  // Check that email does not contain uppercase
  const email = req.body.email.toLowerCase();
  if (req.body.email !== email) {
    return res
      .status(400)
      .json({ message: "Email must not contain uppercase letters" });
  }

  const updatedUser = await Admin.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      userType: req.body.userType,
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      error: true,
      message: "User not found",
    });
  }

  if (req.body.password) {
    const user = await Admin.findOne({ _id: id });
    // Step 3: Update user's password in the database
    user.setPassword(req.body.password, async (err) => {
      try {
        await user.save();
        await sendEmail(
          user.email,
          "Your password has been changed",
          `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
        );
        console.error("Password reset successful!");
        return res.status(200).send({ message: "Password reset successful!" }); // Added return statement here
      } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
    });
    return; // Added return statement here
  }

  return res.status(200).json({
    // Moved the return statement inside this block
    error: false,
    message: "User updated successfully",
    user: updatedUser,
  });
};

const updateProfile = async (req, res) => {
  const userId = req.params.id;
  console.log(req.body);
  const { name, email, photo } = req.body;

  // Check logged in user and the user to be updated are same
  if (userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this password!" });
  }

  try {
    let updatedUser = await Admin.findById(userId);
    // console.log(updateSpecies);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    updatedUser.name = name;
    updatedUser.email = email;

    if (photo) {
      const uploadedResponse = await cloudinary.uploader.upload(photo, {
        upload_preset: "druk-ebird-profiles",
      });

      if (uploadedResponse) {
        updatedUser.photo = uploadedResponse.secure_url;
      }
    }

    const savedUser = await updatedUser.save();

    res.status(200).json({
      data: savedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    // Check logged in user and the user to be updated are same
    if (userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this password!" });
    }

    if (!req.body.oldPassword || !req.body.newPassword) {
      return res
        .status(400)
        .json({ message: "Old Password and New Password are required" });
    }

    if (!isValidPassword(req.body.newPassword)) {
      return res.status(400).send({
        message:
          "Password must be between 8 and 26 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
      });
    }

    const user = await Admin.findOne({ _id: userId });
    if (!user) return res.status(400).send({ message: "User not found!" });

    // Change the password
    await user.changePassword(req.body.oldPassword, req.body.newPassword);
    await sendEmail(
      user.email,
      "Your password has been changed",
      `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    );

    return res.status(200).send({ message: "Password reset successful!" });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Admin.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const secretPage = async (req, res) => {
  console.log(req.user);
  return res.status(200).json({ message: "Congrats!" });
};

const logoutUser = async (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logout successful" });
};

export {
  // passport local controllers
  baseRoute,
  // validateSession,
  checkAuthStatus,
  authMiddleware,
  getAllUsers,
  logoutUser,
  registerUser,
  loginUser,
  getUserByID,
  editAdminUser,
  updatePassword,
  deleteUser,
  secretPage,

  // google auth controllers
  googleAuth,
  successGoogleLogin,
  failedGoogleLogin,
  googleAuthCallback,
};
