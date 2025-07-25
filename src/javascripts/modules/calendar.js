import { hideTransparentOverlay, showTransparentOverlay } from "./shared.js";
import {
  convertMonthToMonthName,
  getDateTime,
  normalizeDateTime,
} from "./utils.js";

const dateTime = getDateTime();

let currentMonth = dateTime.month;
let currentDay = dateTime.day;
let currentYear = dateTime.year;
let numberOfDaysOnMonth = calcNumberOfDaysOnMonth();
let fisrtDayOfMonthOnWeek = calcFisrtDayOfMonthOnWeek();

function calcNumberOfDaysOnMonth() {
  const daysOfMonthMap = {
    1: 31,
    2: currentYear % 4 === 0 ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  return daysOfMonthMap[currentMonth];
}

function nextMonth() {
  if (currentMonth < 12) {
    currentMonth++;
  } else {
    currentMonth = 1;
    currentYear++;
  }

  fisrtDayOfMonthOnWeek = calcFisrtDayOfMonthOnWeek();
  numberOfDaysOnMonth = calcNumberOfDaysOnMonth();

  insertDaysOnCalendar();
  insertMonthYearOnCalendar();
  updateDateOnCalendarInput();
}

const nextMonthBtn = document.getElementById("next-month-btn");
nextMonthBtn.addEventListener("click", nextMonth);

function previousMonth() {
  if (currentMonth > 1) {
    currentMonth--;
  } else {
    currentMonth = 12;
    currentYear > 1 ? currentYear-- : null;
  }

  fisrtDayOfMonthOnWeek = calcFisrtDayOfMonthOnWeek();
  numberOfDaysOnMonth = calcNumberOfDaysOnMonth();

  insertDaysOnCalendar();
  insertMonthYearOnCalendar();
  updateDateOnCalendarInput();
}

document
  .getElementById("previous-month-btn")
  .addEventListener("click", previousMonth);

function insertMonthYearOnCalendar() {
  document.getElementById("calendar__month-year").innerHTML = `
    ${convertMonthToMonthName(currentMonth)} ${currentYear}`;
}

function calcFisrtDayOfMonthOnWeek() {
  let fisrtDayOfMonthOnWeek = normalizeDateTime(
    `${currentYear}-${currentMonth}-1`
  ).weekday;

  fisrtDayOfMonthOnWeek = (fisrtDayOfMonthOnWeek + 1) % 7;

  return fisrtDayOfMonthOnWeek > 0 ? fisrtDayOfMonthOnWeek : 7;
}

function normalizeDateForInput() {
  const month = String(currentMonth).padStart(2, 0);
  const day = String(currentDay).padStart(2, 0);

  return `${currentYear}-${month}-${day}`;
}

function updateDateOnCalendarInput() {
  document.getElementById("calendar__input-date").value =
    normalizeDateForInput();
}

function generateCalendarDays() {
  const calendarDays = [];

  for (let i = 1; i < fisrtDayOfMonthOnWeek; i++) {
    calendarDays.push(`<td></td>`);
  }

  for (let i = 1; i <= numberOfDaysOnMonth; i++) {
    calendarDays.push(
      `<td class="${
        currentDay === i ? "calendar__day--active" : "calendar__day"
      }">${i}</td>`
    );
  }

  return calendarDays;
}

function generateCalendarWeeks(days) {
  const daysLen = days.length;
  let template = "",
    temp = "";

  for (let i = 1; i <= daysLen; i++) {
    temp += days[i - 1];

    if (i % 7 === 0) {
      template += `
          <tr class="grid grid-cols-7 gap-x-2 md:gap-x-5">
            ${temp}
          </tr>`;

      temp = "";
    }
  }

  if (temp) {
    template += `
        <tr class="grid grid-cols-7 gap-x-2 md:gap-x-5">
          ${temp}
        </tr>`;
  }

  return template;
}

function insertDaysOnCalendar() {
  const tableBody = document.getElementById("calendar__tbody");

  const calendarDays = generateCalendarDays();
  tableBody.innerHTML = generateCalendarWeeks(calendarDays);
}

window.addEventListener("load", () => {
  insertDaysOnCalendar();
  insertMonthYearOnCalendar();
  updateDateOnCalendarInput();
});

function updateCalendar(changeEvent) {
  const dateTime = normalizeDateTime(changeEvent.target.value);

  currentYear = dateTime.year;
  currentMonth = dateTime.month;
  currentDay = dateTime.day;

  fisrtDayOfMonthOnWeek = calcFisrtDayOfMonthOnWeek();

  insertDaysOnCalendar();
  insertMonthYearOnCalendar();
}

document
  .getElementById("calendar__input-date")
  .addEventListener("change", updateCalendar);

document
  .getElementById("calendar__tbody")
  .addEventListener("click", (clickEvent) => {
    if (clickEvent.target.className === "calendar__day") {
      currentDay = Number(clickEvent.target.textContent);

      insertDaysOnCalendar();
      updateDateOnCalendarInput();
    }
  });

function showCalendar() {
  showTransparentOverlay();
  document
    .getElementById("calendar")
    .classList.remove("opacity-0", "invisible");
}

function hideCalendar() {
  hideTransparentOverlay();
  document.getElementById("calendar").classList.add("opacity-0", "invisible");
}

document
  .getElementById("calendar__hide-btn")
  .addEventListener("click", hideCalendar);

export { showCalendar, hideCalendar };
