import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "matchpointAI",
    });
    console.log("Successfully connected to the database!");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
