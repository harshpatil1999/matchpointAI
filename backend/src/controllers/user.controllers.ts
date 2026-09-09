import TryCatch from "../middlewares/try-catch.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  res.json(email);
});
