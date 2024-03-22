import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const database = process.env.MONGODB_DATABASE;
    const connectionString = `mongodb+srv://${user}:${password}@cluster0.xlz4rue.mongodb.net/${database}?retryWrites=true&w=majority`;
    console.log("connecting to db...");
    await mongoose.connect(connectionString);
    console.log("connected to db");
  } catch (err) {
    console.log("db connection failed", err);
    throw err;
  }
};

export default dbConnect;
