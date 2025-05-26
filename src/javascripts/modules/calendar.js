"use strict";

import {
  hideOverlay,
  hideTransparentOverlay,
  showOverlay,
  showTransparentOverlay,
} from "./shared.js";
import { convertMonthToMonthName } from "./utils.js";

const date = new Date();

let weekday = date.getDay() + 1;
let currentMonth = date.getMonth() + 1;
let currentDay = date.getDate();
let currentYear = date.getFullYear();
let numberOfDaysOnMonth = calcNumberOfDaysOnMonth();
let fisrtDayOfMonthOnWeek = calcFisrtDayOfMonthOnWeek();

function nextMonth() {
  if (currentMonth < 12) {
    currentMonth++;
  } else {
    currentMonth = 1;
    currentYear++;
  }

  fisrtDayOfMonthOnWeek += numberOfDaysOnMonth % 7;

  if (fisrtDayOfMonthOnWeek > 7) {
    fisrtDayOfMonthOnWeek = fisrtDayOfMonthOnWeek % 7;
  }

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
    currentYear--;
  }

  numberOfDaysOnMonth = calcNumberOfDaysOnMonth();

  fisrtDayOfMonthOnWeek -= numberOfDaysOnMonth % 7;

  if (fisrtDayOfMonthOnWeek < 1) {
    fisrtDayOfMonthOnWeek += 7;
  }

  insertDaysOnCalendar();
  insertMonthYearOnCalendar();
  updateDateOnCalendarInput();
}

document
  .getElementById("previous-month-btn")
  .addEventListener("click", previousMonth);

function calcNumberOfDaysOnMonth() {
  if ([1, 3, 5, 7, 8, 10, 12].includes(currentMonth)) {
    return 31;
  } else if ([4, 6, 9, 11].includes(currentMonth)) {
    return 30;
  } else {
    return currentYear % 4 === 0 ? 29 : 28;
  }
}

function insertMonthYearOnCalendar() {
  document.getElementById("calendar__month-year").innerHTML = `
    ${convertMonthToMonthName(currentMonth)} ${currentYear}`;
}

function calcFisrtDayOfMonthOnWeek() {
  let fisrtDayOfMonthOnWeek = new Date(
    `${currentYear}-${currentMonth}-1`
  ).getDay();

  fisrtDayOfMonthOnWeek = (fisrtDayOfMonthOnWeek + 2) % 7;

  return fisrtDayOfMonthOnWeek;
}

function calcFisrtDayOfMonthOnWeekV1() {
  let fisrtDayOfMonthOnWeek = weekday;

  let difference = -(currentDay % 7) + 1;

  if (difference < 1) {
    difference = 7 - (currentDay % 7) + 1;
  }

  for (let i = 0; i < difference; i++) {
    fisrtDayOfMonthOnWeek = (fisrtDayOfMonthOnWeek + 1) % 7;
  }

  return fisrtDayOfMonthOnWeek;
}

function normalizeDateForInput() {
  const year = currentYear;
  const month = String(currentMonth).padStart(2, 0);
  const day = String(currentDay).padStart(2, 0);

  return `${year}-${month}-${day}`;
}

function updateDateOnCalendarInput() {
  document.getElementById("calendar__input-date").value =
    normalizeDateForInput();
}

function insertDaysOnCalendar() {
  const tableBody = document.getElementById("calendar__tbody");

  const calendarDays = [];
  let template = "",
    temp = "";

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

  const calendarDaysLen = calendarDays.length;
  for (let i = 1; i <= calendarDaysLen; i++) {
    temp += calendarDays[i - 1];

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
      <tr class="grid grid-cols-7 gap-x-5.5 gap-y-6.5">
        ${temp}
      </tr>`;
  }

  tableBody.innerHTML = template;
}

function insertDaysOnCalendarV1(container) {
  let template = `
  <span class="calendar__weekday-name">MON</span>
  <span class="calendar__weekday-name">TUE</span>
  <span class="calendar__weekday-name">WED</span>
  <span class="calendar__weekday-name">THU</span>
  <span class="calendar__weekday-name">FRI</span>
  <span class="calendar__weekday-name">SAT</span>
  <span class="calendar__weekday-name">SUN</span>
  `;

  for (let i = 1; i < fisrtDayOfMonthOnWeek; i++) {
    template += `<span></span>`;
  }

  for (let i = 1; i <= numberOfDaysOnMonth; i++) {
    template += `
        <span class="${
          i === currentDay ? "calendar__day--active" : "calendar__day"
        }">${i}</span>`;
  }

  container.innerHTML = template;
}

window.addEventListener("load", () => {
  insertDaysOnCalendar();
  insertMonthYearOnCalendar();
  updateDateOnCalendarInput();
});

function updateCalendar(changeEvent) {
  const date = changeEvent.target.value;

  currentYear = Number(date.slice(0, 4)) || 2000;
  currentMonth = Number(date.slice(5, 7)) || 1;
  currentDay = Number(date.slice(8, 10)) || 1;

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

      // insertMonthYearOnCalendar();
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

// let date2 = new Date();
// let dateFormat = new Intl.DateTimeFormat("fa").format(date2);
// console.log(dateFormat);

// function calcAmountDaysOfMonthShamsi() {
//   const date = new Date();
//   const month = date.getMonth();
//   const year = date.getFullYear();

//   return month < 6 ? 31 : month < 11 ? 30 : year % 4 === 3 ? 30 : 29;
// }

export { showCalendar, hideCalendar };
