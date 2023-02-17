import Habit from "../models/habit.js";
import Category from "../models/category.js";
import HabitTracker from "../models/habitTracker.js";

export async function home(req, res) {
  const habits = await Habit.find({}).populate("category");
  for (let habit of habits) {
    habit.todayStatus = await habit.getHabitStatus();
  }

  const categories = await Category.find({ name: { $ne: "_default" } });
  res.render("home", { habits, categories });
}

export async function weekView(req, res) {
  const categories = await Category.find({ name: { $ne: "_default" } });
  res.render("weekView", { categories });
}
