// ID
function idGenerator() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Date & Time
function getDateTime() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = date.getDay() + 1;

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
    weekdayName: weekdaysName[weekday - 1],
    monthName: monthsName[month - 1],
    date: `${String(month).padStart(2, 0)}/${String(day).padStart(
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

function getDateTimeV2(dateTime = "now") {
  let date;

  if (dateTime == "now") {
    date = new Date();
  } else {
    date = new Date(dateTime);
  }

  dateTime = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay() + 1,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };

  return dateTime;
}

function formattingDateTime(dateTime) {
  const weekdaysNameMap = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
  };
  const monthsNameMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const stringDateTime = {
    year: String(dateTime.year).padStart(4, 0),
    month: String(dateTime.month).padStart(2, 0),
    day: String(dateTime.day).padStart(2, 0),
    hour: String(dateTime.hour).padStart(2, 0),
    minute: String(dateTime.minute).padStart(2, 0),
    second: String(dateTime.second).padStart(2, 0),

    weekdayName: weekdaysNameMap[dateTime.weekday],
    monthName: monthsNameMap[dateTime.month],
  };

  return {
    ...stringDateTime,

    date: `${stringDateTime.month}/${stringDateTime.day}/${stringDateTime.year}`,
    time: `${stringDateTime.hour}:${stringDateTime.minute}:${stringDateTime.second}`,
    dateTimeISO: `${stringDateTime.year}-${stringDateTime.month}-${stringDateTime.day}T${stringDateTime.hour}:${stringDateTime.minute}:${stringDateTime.second}`,
  };
}

function normalizeDateTime(dateTime) {
  // Input Format: "2024-05-10T09:45:37.408Z"
  const years = dateTime.slice(0, 4);
  const months = dateTime.slice(5, 7);
  const days = dateTime.slice(8, 10);
  const hours = dateTime.slice(11, 13);
  const minutes = dateTime.slice(14, 16);
  const seconds = dateTime.slice(17, 19);
  const milliSeconds = dateTime.slice(20, 23);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliSeconds,
    date: `${years}/${months}/${days}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
}

function calcRelativeDateTimeDifference(dateTime = "1970-01-01T00:00:00.000Z") {
  const currentDateTime = new Date();
  const inputDateTime = new Date(dateTime);

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
  const monthNames = [
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

  return monthNames[month - 1];
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
  localStorage.setItem(key, JSON.stringify(value));
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

function generatorGrayCode(bits = 1) {
  if (bits === 1) {
    return ["0", "1"];
  } else {
    const baseCode = generatorGrayCode(bits - 1);
    const loopLength = 2 ** bits / 2;
    let gray = [];

    for (let i = 0; i < loopLength; i++) {
      gray.push("0" + baseCode[i]);
    }

    for (let i = loopLength - 1; i >= 0; i--) {
      gray.push("1" + baseCode[i]);
    }

    return gray;
  }
}

export {
  getDateTime,
  searchTodo,
  findUser,
  normalizeDateTime,
  calcRelativeDateTimeDifference,
  convertMonthToMonthName,
  getFromLocalStorage,
  saveToLocalStorage,
  convertImgToCanvas,
  getBase64Image,
  getDateTimeV2,
  formattingDateTime,
  idGenerator,
};
