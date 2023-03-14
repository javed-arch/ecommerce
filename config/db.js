import mongoose from "mongoose";

const connectDb = async (url) => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`Connected To Database ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error in Database Connection ${err}`);
  }
};

export default connectDb;
