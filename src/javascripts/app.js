"use strict";

import { getUser } from "./apis/users.api.js";
import { hideCalendar, showCalendar } from "./modules/calendar.js";
// import { hideCreateTodoModal } from "./modules/create-task.js";
import {
  hideNotifications,
  showNotifications,
} from "./modules/notification.js";
import {
  hideTransparentOverlay,
  showTransparentOverlay,
} from "./modules/shared.js";
import { getDateTime, searchTodo } from "./modules/utils.js";

const todos = [];
let user = {};

let isSidebarVisible = window.innerWidth >= 600;

function showSidebar() {
  hideVisibleContent();

  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("-left-47");
  sidebar.classList.add("left-0");

  showTransparentOverlay();
}

function hideSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.add("-left-47");
  sidebar.classList.remove("left-0");

  hideTransparentOverlay();
}

function toggleMenu() {
  if (isSidebarVisible) {
    hideSidebar();
  } else {
    showSidebar();
  }

  isSidebarVisible = !isSidebarVisible;
}

const toggleSidebarBtn = document.getElementById("toggle-menu");
toggleSidebarBtn.addEventListener("click", toggleMenu);

function showSerachBar() {
  hideVisibleContent();
  // showOverlay();
  showTransparentOverlay();

  const searchBarContainer = document.getElementById("search-bar-container");
  searchBarContainer.classList.remove("hidden");
  searchBarContainer.classList.add(
    "absolute",
    "left-0",
    "right-0",
    "w-fit",
    "z-10",
    "m-auto"
  );
}

function hideSerachBar() {
  // hideOverlay();
  hideTransparentOverlay();

  const searchBarContainer = document.getElementById("search-bar-container");
  searchBarContainer.classList.add("hidden");
  searchBarContainer.classList.remove(
    "absolute",
    "left-0",
    "right-0",
    "w-fit",
    "z-10",
    "m-auto"
  );
}

function hideVisibleContent() {
  hideSidebar();
  hideSerachBar();
  hideNotifications();
  hideCalendar();

  // hideCreateTodoModal();
}

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", hideVisibleContent);

const serachBarIcon = document.getElementById("search-bar-icon");
serachBarIcon.addEventListener("click", showSerachBar);

const headerSearchResultContainer = document.getElementById(
  "search-result-container"
);

function insertSearchResult(todos, container) {
  if (!container) return;
  let template = "";

  if (todos.length) {
    todos.forEach((todo) => {
      const { id, priority, cover, title } = todo;

      template += `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <a
          class="flex items-center justify-between gap-x-4"
          href="./pages/id=${id}"
        >
          <div>
            <p class="text-sm lg:text-base/relaxed line-clamp-2">${title}</p>
            <span class="font-medium text-xs">Priority: </span
            ><span class="font-medium text-xs ${
              priority === "High"
                ? "text-danger"
                : priority === "Medium"
                ? "text-picton-blue"
                : "text-success"
            }">${priority}</span>
          </div>
          <div
            class="size-10 lg:size-13 shrink-0 rounded-sm overflow-hidden"
          >
            <img src="./assets/images/todoes/${cover.path}" 
              alt="${cover.alt}" />
          </div>
        </a>
      </li>
      `;
    });
  } else {
    template = `<li class="px-3.75 py-1.5 lg:py-2.5"> <span class="text-quick-silver">Try something different</span></li>`;
  }

  container.innerHTML = template;
}

function insertSearchResultHandler(keyupEvent) {
  const searchValue = keyupEvent.target.value.trim();

  if (searchValue.length > 2) {
    const searchResult = searchTodo(searchValue, todos);

    insertSearchResult(searchResult, headerSearchResultContainer);
  } else {
    headerSearchResultContainer.innerHTML = `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <span class="text-quick-silver">You must type at least 3 characters</span>
      </li>`;
  }
}

const headerSearchInput = document.getElementById("header-search-input");
headerSearchInput.addEventListener("keyup", insertSearchResultHandler);

function insertDate() {
  const todayDateContainer = document.getElementById("today-date");

  const dateTime = getDateTime();

  todayDateContainer.innerHTML = `<span>${dateTime.weekdayName}</span>
          <span class="text-picton-blue">${dateTime.date}</span>`;
}

window.addEventListener("load", async () => {
  insertDate();

  user = await getUser(1); // Static userId

  todos.length = 0;
  todos.push(...user.tasks);
});

document
  .getElementById("notification-show-btn")
  .addEventListener("click", () => {
    hideVisibleContent();
    showNotifications();
  });

document
  .getElementById("notification__hide-btn")
  .addEventListener("click", hideNotifications);

document.getElementById("calendar-show-btn").addEventListener("click", () => {
  hideVisibleContent();
  showCalendar();
});

document
  .getElementById("transparent-overlay")
  .addEventListener("click", hideVisibleContent);
