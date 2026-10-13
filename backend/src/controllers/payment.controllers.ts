import { razorPayInstance } from "../index.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import TryCatch from "../middlewares/tryCatch.middleware.js";
import User from "../models/user.model.js";

export const checkOut = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user_id = req.user?._id;
  if (!user_id) {
    return res.status(400).json({
      message: "No user id!",
    });
  }
  const user = await User.findById(user_id);
  const subTime = user?.subscription
    ? new Date(user.subscription).getTime()
    : 0;
  const now = Date.now();
  const isSubscribed = subTime > now;
  if (isSubscribed) {
    return res.status(400).json({
      message: "User already subscribed!",
    });
  }
  const { duration } = req.body;
  let amount;
  if (duration === 1) {
    amount = Number(299 * 100);
  } else {
    amount = Number(1499 * 100);
  }
  const options = {
    amount,
    currency: "INR",
    notes: {
      user_id: user_id?.toString(),
      duration: duration.toString(),
    },
  };
  const order = await razorPayInstance.orders.create(options);
  res.status(201).json({
    order,
  });
});
