export async function trackHabit(habitID, status, habitDate = new Date()) {
  // Function to send post request to Server to track Habit for any given date
  habitDate.setHours(0, 0, 0, 0);
  const response = await fetch("/habit/trackhabit", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      habitID: habitID,
      status: status,
      date: habitDate,
    }),
  });
  return response.json();
}

export async function unTrackHabit(habitID, habitDate = new Date()) {
  // Function to send post request to Server to Untrack Habit for any given date
  habitDate.setHours(0, 0, 0, 0);
  const response = await fetch("/habit/untrackhabit", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      habitID: habitID,
      date: habitDate,
    }),
  });
  return response.json();
}
