import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1/habit_tracker_db");

const db = mongoose.connection;

db.on("error", () => {
  console.log("Error in connecting to DB");
});

db.once("open", () => {
  console.log("Successfully connected to DB");
});
