import {
  findUser,
  getDateTime,
  getFromLocalStorage,
  searchTodo,
} from "./modules/utils.js";
import { hideCalendar, showCalendar } from "./modules/calendar.js";
import {
  hideNotifications,
  showNotifications,
} from "./modules/notification.js";
import {
  hideOverlay,
  hideTodoOptions,
  hideTransparentOverlay,
  showOverlay,
  showTransparentOverlay,
} from "./modules/shared.js";
import { hideTodoModal } from "./modules/todo-modal.js";

let DB = {};
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
  showOverlay();

  const searchBarContainer = document.getElementById("mobile-search-bar");
  searchBarContainer.classList.remove("hidden");
}

function hideSerachBar() {
  hideOverlay();

  const searchBarContainer = document.getElementById("mobile-search-bar");
  searchBarContainer.classList.add("hidden");
}

function hideVisibleContent() {
  hideSidebar();
  hideSerachBar();
  hideNotifications();
  hideCalendar();

  hideTodoModal();
  hideTodoOptions();
}

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", hideVisibleContent);

const serachBarIcon = document.getElementById("search-bar-icon");
serachBarIcon.addEventListener("click", showSerachBar);

const searchResultContainer = document.getElementById(
  "search-result-container"
);
const mobileSearchResultContainer = document.getElementById(
  "mobile-search-result"
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
              priority.toLowerCase() === "high"
                ? "text-danger"
                : priority.toLowerCase() === "medium"
                ? "text-amber-400"
                : "text-picton-blue"
            }">${priority}</span>
          </div>
          <div
            class="size-10 lg:size-13 shrink-0 rounded-sm overflow-hidden">
          ${
            cover.path
              ? `<img class="aspect-square" src="./assets/images/todoes/${cover.path}" alt="${cover.alt}" />`
              : `<img class="aspect-square" src="${cover.img}" alt="${cover.alt}" />`
          }
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
    const searchResult = searchTodo(searchValue, user.todos);

    insertSearchResult(searchResult, searchResultContainer);
    insertSearchResult(searchResult, mobileSearchResultContainer);
  } else {
    searchResultContainer.innerHTML = `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <span class="text-quick-silver">You must type at least 3 characters</span>
      </li>`;

    mobileSearchResultContainer.innerHTML = `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <span class="text-quick-silver">You must type at least 3 characters</span>
      </li>`;
  }
}

const headerSearchInput = document.getElementById("header-search-input");
headerSearchInput.addEventListener("keyup", insertSearchResultHandler);

const mobileSearchInput = document.getElementById("mobile-search-input");
mobileSearchInput.addEventListener("keyup", insertSearchResultHandler);

function insertDate() {
  const todayDateContainer = document.getElementById("today-date");

  const dateTime = getDateTime();

  todayDateContainer.innerHTML = `<span>${dateTime.weekdayName}</span>
          <span class="text-picton-blue">${dateTime.date}</span>`;
}

function routeProtection() {
  const currentUser = getFromLocalStorage("currentUser");

  if (!currentUser) {
    location.href = "./pages/login.html";
  }
}

window.addEventListener("load", async () => {
  routeProtection();
  insertDate();

  const currentUser = getFromLocalStorage("currentUser");
  const userId = currentUser.userId;

  DB = getFromLocalStorage("DB");

  user = findUser(userId, DB.users);
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
