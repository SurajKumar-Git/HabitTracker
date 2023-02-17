import Habit from "../models/habit.js";
import Category from "../models/category.js";
import HabitTracker from "../models/habitTracker.js";

export async function addHabit(req, res) {
  /* Add Habit action */
  try {
    let category = await Category.findById(req.body.category);

    // if Category is not provide, Use default
    if (!category) {
      category = await Category.defaultCategory();
    }

    // Create habit
    await Habit.create({
      name: req.body.name,
      description: req.body.description,
      category: category.id,
    });
    res.redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    res.render("internalServerError.ejs");
  }
}

export async function deleteHabit(req, res) {
  // Delete habit action
  try {
    let habit = await Habit.findByIdAndRemove(req.params.id);
    await habit.deleteHabitTracker();
    res.redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    res.render("internalServerError.ejs");
  }
}

export async function trackHabit(req, res) {
  // Track habit action
  try {
    const habitID = req.body.habitID;
    const habit = await Habit.findById(habitID);

    if (!habit) {
      return res.status(404).json({
        updated: false,
        message: "Incorrect Habit ID, Habit not found",
      });
    }

    const status = req.body.status;
    const date = new Date(req.body.date);
    // Call to trackHabit method of Habit Schema
    const habitTrack = await habit.trackHabit(status, date);

    res.status(200).json({
      updated: true,
      message: "Habit tracked successfully",
      habitTrack,
    });
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ updated: false, message: "Something went wrong, Try later" });
  }
}

export async function unTrackHabit(req, res) {
  // UnTrack habit action
  try {
    const habitID = req.body.habitID;
    const habit = await Habit.findById(habitID);

    if (!habit) {
      return res.status(404).json({
        updated: false,
        message: "Incorrect Habit ID, Habit not found",
      });
    }

    const date = new Date(req.body.date);
    // Call to unTrackHabit method of Habit Schema
    await habit.unTrackHabit(date);

    res
      .status(200)
      .json({ updated: true, message: "Habit unTracked successfully" });
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ updated: false, message: "Something went wrong, Try later" });
  }
}

export async function getHabitsStatusForWeek(req, res) {
  // Return habits status for week of given date
  try {
    const habits = await Habit.find({});
    const date = new Date(req.query.date);

    // Call to method getHabitStatusForWeek for each habit
    const habitsCopy = [];
    for (let habit of habits) {
      // Converting Habit object of Model Habit to normal object
      // To add additional properities or data apart from Habit Model properties
      let habitCopy = habit.toJSON();
      habitCopy.statusForWeek = await habit.getHabitStatusForWeek(date);
      habitsCopy.push(habitCopy);
    }

    res.status(200).json({
      result: true,
      habits: habitsCopy,
    });
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ updated: false, message: "Something went wrong, Try later" });
  }
}
