import { createApp } from "https://unpkg.com/petite-vue?module";
import { trackHabit, unTrackHabit } from "./habitActions.js";

// Manipulating Week View page, using VUE js library
createApp({
  date: new Date(),
  week: [],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  habits: [],

  get currentMonth() {
    return this.months[this.date.getMonth()];
  },
  get currentYear() {
    return this.date.getFullYear();
  },

  updateWeek() {
    const startDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate() - this.date.getDay()
    );
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i
      );
      week.push(date);
    }
    this.week = week;
  },

  nextWeek() {
    // Updating calendar dates to next week
    this.date.setDate(this.date.getDate() + 7);
    this.date = new Date(this.date.toISOString());
    this.updateWeek();

    // get Habit status only for present date, not for future date
    if (Date.now() - this.date >= 0) {
      this.getHabitsStatus();
    }
  },

  prevWeek() {
    // Updating calendar dates to prev week
    this.date.setDate(this.date.getDate() - 7);
    this.date = new Date(this.date.toJSON());
    this.updateWeek();

    // get Habit status only for present date, not for future date
    if (Date.now() - this.date >= 0) {
      this.getHabitsStatus();
    }
  },

  habitStatusForDate(habit, date) {
    // get habit status for any date
    let status = null;
    for (let habitStatus of habit.statusForWeek) {
      if (new Date(habitStatus.date) - date == 0) {
        status = habitStatus.status;
        break;
      }
    }
    return status;
  },

  async changeHabitStatus(habit, date) {
    // Change habit status on click
    const habitCreatedDate = new Date(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);

    // Not updating habit status of future date or before habit created date
    if (habitCreatedDate - date > 0 || Date.now() - date < 0) {
      return;
    }

    for (let habitStatus of habit.statusForWeek) {
      // Find if habit status already tracked for that date
      if (new Date(habitStatus.date) - date == 0) {
        // Toggling between completed, not completed, no action
        if (habitStatus.status == true) {
          await trackHabit(habit._id, false, date);
          habitStatus.status = false;
        } else if (habitStatus.status == false) {
          await unTrackHabit(habit._id, date);
          habitStatus.status = null;
        } else {
          await trackHabit(habit._id, true, date);
          habitStatus.status = true;
        }
        return;
      }
    }

    // Status of habit for the date was never marked
    const data = await trackHabit(habit._id, true, date);
    const habitStatus = data.habitTrack;
    habit.statusForWeek.push(habitStatus);
  },

  async getHabitsStatus() {
    // getting all habits and its status for entire week of the date.
    const response = await fetch(
      "/habit/week-status?" +
        new URLSearchParams({ date: this.date.toISOString() }),
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data.habits;
  },

  async mounted() {
    this.date.setHours(0, 0, 0, 0);
    this.habits = await this.getHabitsStatus();
    this.updateWeek();
  },
}).mount("#week-view-container");
