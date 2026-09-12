import axios from "axios";
import { OAuth2Client } from "../config/googleConfig.js";
import TryCatch from "../middlewares/tryCatch.middleware.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const loginUser = TryCatch(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      message: "Authorization code required!",
    });
  }
  const googleRes = await OAuth2Client.getToken(code);
  OAuth2Client.setCredentials(googleRes.tokens);
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
  );
  const { name, email, picture } = userRes.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      image: picture,
    });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });
  res.json({
    message: "Login successful!",
    token,
    user,
  });
});
