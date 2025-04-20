// Date & Time
function getDateTime() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const weekday = date.getDay();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const weekdaysName = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const monthsName = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };

  return {
    weekdayName: weekdaysName[weekday],
    monthName: monthsName[month],
    date: `${String(day).padStart(2, 0)}/${String(month).padStart(
      2,
      0
    )}/${year}`,
    time: `${hours}:${minutes}:${seconds}`,
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
  };
}

// Search
function searchTodo(searchValue, todos) {
  return todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchValue.toLowerCase())
  );
}

// Find
function findUser(userId, users) {
  const userIndex = users.findIndex(
    (user) => String(user.id) === String(userId)
  );

  return users[userIndex] ?? null;
}

export { getDateTime, searchTodo, findUser };
