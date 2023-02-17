import mongoose from "mongoose";
import HabitTracker from "./habitTracker.js";

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    virtuals: {
      createdDate: {
        get() {
          /* Reset time part of habit created datetimestamps.
            To consider habit created date for whole day.
          */
          this.createdAt.setHours(0, 0, 0, 0);
          return this.createdAt;
        },
      },
    },
    methods: {
      // Several usefull habit methods to avoid writing these functionalities in controllers multiple times & Easy to Test

      async getHabitStatus(date = new Date()) {
        // returns habit status for the given date or null if habit not marked for that date.
        if (!(date instanceof Date) || isNaN(date)) {
          throw new Error(
            "date should be instance of Date class with valid date"
          );
        }

        date.setHours(0, 0, 0, 0);
        let habitTrack = await HabitTracker.findOne({
          habit: this,
          date: date,
        });

        return habitTrack ? habitTrack.status : null;
      },

      async trackHabit(status, date = new Date()) {
        // tracks habit status for given date
        if (typeof status != "boolean") {
          throw new Error("status should be boolean type");
        }

        if (!(date instanceof Date) || isNaN(date)) {
          throw new Error(
            "date should be instance of Date class with valid date"
          );
        }

        // Resetting time part of datetime.
        date.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date > today || date < this.createdDate) {
          // throw error if habit is being marked for future date or before habit was created
          throw new Error(
            "Date should not be of future date or should not be before habit created date"
          );
        }

        // Updates status if exists
        let habitTrack = await HabitTracker.findOneAndUpdate(
          {
            habit: this,
            date: date,
          },
          { status: status },
          { new: true }
        );

        // Track the habit if not marked before
        if (!habitTrack) {
          habitTrack = await HabitTracker.create({
            habit: this,
            date: date,
            status: status,
          });
        }

        return habitTrack;
      },

      async unTrackHabit(date = new Date()) {
        // untracks the status for habit if tracked before
        if (!(date instanceof Date) || isNaN(date)) {
          throw new Error(
            "date should be instance of Date class with valid date"
          );
        }

        date.setHours(0, 0, 0, 0);

        await HabitTracker.deleteOne({
          habit: this,
          date: date,
        });
      },

      async deleteHabitTracker() {
        // delete all habit trackers related to current habit
        await HabitTracker.deleteMany({
          habit: this,
        });
      },

      async getHabitStatusForWeek(date = new Date()) {
        // for week view, returns all the track status for current week of the given date
        if (!(date instanceof Date) || isNaN(date)) {
          throw new Error(
            "date should be instance of Date class with valid date"
          );
        }

        const startDateOfWeek = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - date.getDay()
        );

        const endDateOfWeek = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 6 - date.getDay()
        );

        const habitTracks = await HabitTracker.find({
          habit: this,
          date: {
            $gte: startDateOfWeek,
            $lte: endDateOfWeek,
          },
        }).sort({ date: 1 });

        return habitTracks;
      },
    },
  }
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
