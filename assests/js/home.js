import { trackHabit, unTrackHabit } from "./habitActions.js";

const trackHabitElements = document.querySelectorAll(".track-habit i");

async function trackHabitEventListner(event) {
  // Event listner to track Habit buttons in Home Page
  let currentElement = event.target;
  let habitID = event.target.parentElement.dataset.id;
  let currentStatus = event.target.dataset.status;
  if (currentStatus == "unmarked") {
    await trackHabit(habitID, true);
    currentElement.className = "fa-solid fa-check green-color";
    currentElement.dataset.status = "marked-completed";
  } else if (currentStatus == "marked-completed") {
    await trackHabit(habitID, false);
    currentElement.className = "fa-solid fa-xmark red-color";
    currentElement.dataset.status = "marked-notcompleted";
  } else if (currentStatus == "marked-notcompleted") {
    await unTrackHabit(habitID);
    currentElement.className = "fa-regular fa-square lightblue-color";
    currentElement.dataset.status = "unmarked";
  } else {
    return;
  }
}

for (let trackHabitElement of trackHabitElements) {
  trackHabitElement.addEventListener("click", trackHabitEventListner);
}
