import mongoose from "mongoose";

const habitTrackerSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: function () {
        // if date is not provided while tracking the habit, today is considered by default
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
      validate: {
        validator: async function () {
          // validates habit track date, if it is not being marked before habit created date or future date
          const today = new Date();

          today.setHours(0, 0, 0, 0);
          this.date.setHours(0, 0, 0, 0);

          await this.populate("habit");
          const habitCreatedDay = this.habit.createdDate;

          return this.date >= habitCreatedDay && this.date <= today;
        },
        message:
          "Date should not be of future date or should not be before habit created date",
      },
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* Compound index, each record should be unique for each habit and date. 
  i.e there should be no two records who has same habit id and status marked for same date.
*/
habitTrackerSchema.index(
  {
    habit: 1,
    date: -1,
  },
  { unique: true }
);

const HabitTracker = mongoose.model("HabitTracker", habitTrackerSchema);

export default HabitTracker;
