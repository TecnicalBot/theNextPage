import mongoose from "mongoose";

const connectionString = `${process.env.DB_URL}/theNextPage`;

if (!connectionString) {
  throw new Error("Database connection string is invalid");
}

const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Failed to connect to database: ", error);
  }
};

export default dbConnect;
