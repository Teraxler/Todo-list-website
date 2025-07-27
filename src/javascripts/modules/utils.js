// ID
function idGenerator() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Date & Time
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
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
];

function getDateTime() {
  const date = new Date();

  return normalizeDateTime(date);
}

function normalizeDateTime(dateTime) {
  // Input Format: "2024-05-10T09:45:37.408Z"
  const date = new Date(dateTime);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay() + 1,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    milliSecond: date.getMilliseconds(),
  };
}

function formattingDateTime(dateTime) {
  const stringDateTime = {
    year: dateTime.year,
    month: dateTime.month,
    day: dateTime.day,
    hour: dateTime.hour,
    minute: dateTime.minute,
    second: dateTime.second,
    yearStr: pad(dateTime.year, 4),
    monthStr: pad(dateTime.month),
    dayStr: pad(dateTime.day),
    hourStr: pad(dateTime.hour),
    minuteStr: pad(dateTime.minute),
    secondStr: pad(dateTime.second),

    weekdayName: WEEKDAYS[dateTime.weekday - 1],
    monthName: MONTHS[dateTime.month - 1],
  };

  return {
    ...stringDateTime,
    date: `${stringDateTime.monthStr}/${stringDateTime.dayStr}/${stringDateTime.yearStr}`,
    time: `${stringDateTime.hourStr}:${stringDateTime.minuteStr}:${stringDateTime.secondStr}`,
    iso: `${stringDateTime.yearStr}-${stringDateTime.monthStr}-${stringDateTime.dayStr}T${stringDateTime.hourStr}:${stringDateTime.minuteStr}:${stringDateTime.secondStr}`,
  };
}

// Get, Format, normalize

function calcRelativeDateTimeDifference(
  isoDateTime = "1970-01-01T00:00:00.000Z"
) {
  const currentDateTime = new Date();
  const inputDateTime = new Date(isoDateTime);

  return convertMilliSecondsToDateTime(currentDateTime - inputDateTime);
}

function convertMilliSecondsToDateTime(milliSeconds) {
  let result = null;

  const SEC_TO_MILLISEC = 1000;
  const MIN_TO_MILLISEC = 60 * SEC_TO_MILLISEC;
  const HOUR_TO_MILLISEC = 60 * MIN_TO_MILLISEC;
  const DAY_TO_MILLISEC = 24 * HOUR_TO_MILLISEC;
  const WEEK_TO_MILLISEC = 7 * DAY_TO_MILLISEC;
  const MONTH_TO_MILLISEC = 30.4166 * DAY_TO_MILLISEC;
  const YEAR_TO_MILLISEC = 365.25 * DAY_TO_MILLISEC;

  const seconds = Math.floor(milliSeconds / SEC_TO_MILLISEC);
  const minutes = Math.floor(milliSeconds / MIN_TO_MILLISEC);
  const hours = Math.floor(milliSeconds / HOUR_TO_MILLISEC);
  const days = Math.floor(milliSeconds / DAY_TO_MILLISEC);
  const weeks = Math.floor(milliSeconds / WEEK_TO_MILLISEC);
  const months = Math.floor(milliSeconds / MONTH_TO_MILLISEC);
  const years = Math.floor(milliSeconds / YEAR_TO_MILLISEC);

  if (months >= 12) {
    result = `${years} Years ago`;
  } else if (days >= 30) {
    result = `${months} Months ago`;
  } else if (days >= 7) {
    result = `${weeks} Weeks ago`;
  } else if (hours >= 24) {
    result = `${days} Days ago`;
  } else if (minutes >= 60) {
    result = `${hours} Hours ago`;
  } else if (seconds >= 60) {
    result = `${minutes} Minutes ago`;
  } else {
    result = `Moments ago`;
  }

  return result;
}

function convertMonthToMonthName(month) {
  return MONTHS[month - 1];
}

// String
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function pad(num, length = 2) {
  return String(num).padStart(length, 0);
}

// Mathmatics
const clacDegreesOfPercent = (percents) => (360 * percents) / 100;

function calcStatistics(todos) {
  let notStarted, inProgress, completed, statistics;
  const count = todos.length;

  notStarted = inProgress = completed = 0;

  const statusMap = {
    "not started": () => notStarted++,
    "in progress": () => inProgress++,
    completed: () => completed++,
  };

  if (count) {
    todos.forEach((todo) => statusMap[todo.status]());

    statistics = {
      completed: Math.round((completed / count) * 100),
      "in progress": Math.round((inProgress / count) * 100),
      "not started": Math.round((notStarted / count) * 100),
    };
  } else {
    statistics = {
      completed: 0,
      "in progress": 0,
      "not started": 0,
    };
  }
  return statistics;
}

// Search
function searchTodo(searchValue, todos) {
  return todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchValue.toLowerCase())
  );
}

// Filter
function filterCompletedTodos(todos) {
  return todos.filter((todo) => todo.status === "completed");
}

function filterNotCompletedTodos(todos) {
  return todos.filter((todo) => todo.status !== "completed");
}

function filterList(list, key, value, isIncludes = true) {
  if (isIncludes) {
    return list.filter((item) => item[key] === value) || [];
  } else {
    return list.filter((item) => item[key] !== value) || [];
  }
}

// Find
function findUser(id, users) {
  const userIndex = users.findIndex((user) => String(user.id) === String(id));

  return users[userIndex] ?? null;
}

function findTodo(id, todos) {
  return todos.find((todo) => todo.id === id);
}

function findUserIndex(users, id) {
  return users.findIndex((user) => user.id === id);
}

const findTodoIndex = (id, todos) =>
  todos.findIndex((todo) => String(todo.id) === String(id));

function findUserByUserPass({ username, password }, users) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}

function findItem(list, key, value) {
  return list.find((item) => item[key] === value);
}

// Sort

function bubbleSort(list, measure, increametal = true) {
  const length = array.length;
  const array = [...list];
  let isSort = true;

  for (let i = 0; i < length; i++) {
    isSort = true;

    for (let j = 0; j < length; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        isSort = false;
      }
    }

    if (isSort) break;
  }

  return array;
}

// LocalStorage
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || null;
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
    swal({
      title: "Your Browser Storage is full",
      text: "Please remove a todo to free space for new todo",
    });
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    swal({
      title: "Remove From LocalStorage Failed!",
    });
    new Error(error);
  }
}

// URL
function getQueryParam(param) {
  return new URLSearchParams(location.search).get(param);
}

// Insert Content
function insertTextContent(content, identifier) {
  let elements = [...document.getElementsByClassName(identifier)];

  if (elements.length) {
    elements?.forEach((element) => {
      element.textContent = content;
    });
  } else {
    const element = document.getElementById(identifier);

    if (element) {
      element.textContent = content;
    }
  }
}

// Cookie
function setCookieUserId(userId, rememberMe = false) {
  const SECENDS_OF_YEAR = 365 * 24 * 60 * 60;

  if (rememberMe) {
    document.cookie = `userId=${userId}; Max-Age=${SECENDS_OF_YEAR}; Secure; Path=/src`;
  } else {
    document.cookie = `userId=${userId}; Secure; Path=/src`;
  }
}

function setCookie({ key, value, path = "./" }) {
  document.cookie = `${key}=${value}; Path=${path}`;
}

function deleteCookie(name, path = "./") {
  document.cookie = `${name}=; Path=${path};  Max-Age=0`;
}

function getAllCookies() {
  const cookie = document.cookie;
  let cookies = cookie.split("; ");

  cookies = cookies.map((cookie) => {
    return cookie.split("=");
  });

  return Object.fromEntries(cookies);
}

function getCookie(name) {
  return getAllCookies()[name] || null;
}

// Copy
function deepCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

//
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function convertImgToCanvas(image) {
  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = image.width;
  imgCanvas.height = image.height;

  const imgContext = imgCanvas.getContext("2d");
  imgContext.drawImage(image, 0, 0, image.width, image.height);

  const imageAsDataUrl = imgCanvas.toDataURL("image/png");

  return imageAsDataUrl;
}

// Escape HTML
const escapeHtml = (unsafe) => {
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

// Error Handlig
function ApiErrorHandler(status, details = null) {
  const statusMap = {
    200: "Successfully",
    201: "Created successfully",
    400: "One of the parameters is not valid",
    401: "Token is not valid",
    404: "Not found",
    500: "Server error",
  };

  if (600 < status && status >= 500) {
    // console.error("Server error");
    console.error(details ?? "Status", statusMap[status]);
  } else if (status >= 400) {
    // console.error("Client error");
    console.error(details ?? "Status", statusMap[status]);
  } else if (status >= 300) {
    // console.info("Redirectoin messages");
    console.info(details ?? "Status", statusMap[status]);
  } else if (status >= 200) {
    // console.info("Successfully");
    console.info(details ?? "Status", statusMap[status]);
  } else if (status >= 100) {
    // console.info("Information");
    console.info(details ?? "Status", statusMap[status]);
  } else {
    console.error("Unknown error");
  }
}

export {
  getDateTime,
  searchTodo,
  findUser,
  findTodo,
  findUserIndex,
  findTodoIndex,
  findUserByUserPass,
  normalizeDateTime,
  calcRelativeDateTimeDifference,
  convertMonthToMonthName,
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
  convertImgToCanvas,
  getBase64Image,
  formattingDateTime,
  idGenerator,
  clacDegreesOfPercent,
  calcStatistics,
  capitalize,
  getQueryParam,
  insertTextContent,
  filterCompletedTodos,
  filterNotCompletedTodos,
  filterList,
  setCookieUserId,
  getAllCookies,
  getCookie,
  deleteCookie,
  escapeHtml,
  deepCopy,
};
