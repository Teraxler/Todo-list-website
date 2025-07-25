import {
  deleteCookie,
  findUser,
  formattingDateTime,
  getCookie,
  getDateTime,
  getFromLocalStorage,
  insertTextContent,
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

let user = {};
let isSidebarVisible = false;

function showSidebar() {
  hideVisibleContent();

  const sidebar = document.getElementById("sidebar");
  sidebar.classList.replace("-left-50", "left-0");

  showTransparentOverlay();
  isSidebarVisible = true;
}

function hideSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.replace("left-0", "-left-50");

  hideTransparentOverlay();
  isSidebarVisible = false;
}

function toggleSidebar() {
  isSidebarVisible ? hideSidebar() : showSidebar();
}

const toggleSidebarBtn = document.getElementById("toggle-menu");
toggleSidebarBtn.addEventListener("click", toggleSidebar);

function showSearchBarMobile() {
  hideVisibleContent();
  showOverlay();

  document.getElementById("mobile-search-bar").classList.remove("hidden");
}

function hideSearchBarMobile() {
  hideOverlay();

  document.getElementById("mobile-search-bar").classList.add("hidden");
}

function hideVisibleContent() {
  hideSidebar();
  hideSearchBarMobile();
  hideNotifications();
  hideCalendar();

  hideTodoModal();
  hideTodoOptions();
}

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", hideVisibleContent);

const searchBarIcon = document.getElementById("search-bar-icon");
searchBarIcon.addEventListener("click", showSearchBarMobile);

const searchResultContainer = document.getElementById(
  "search-result-container"
);

const mobileSearchResultContainer = document.getElementById(
  "mobile-search-result"
);

function insertSearchResult(todos, container) {
  if (container == null) return;
  let template = "";

  if (todos.length) {
    todos.forEach((todo) => {
      const { id, priority, cover, title } = todo;

      template += `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <a
          class="flex items-center justify-between gap-x-4 cursor-pointer"
          href="/src/pages/todo-details.html?id=${id}"
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
            cover.img
              ? `<img class="aspect-square" src="${cover.img}" alt="${cover.alt}" />`
              : `<img class="aspect-square" src="/src/assets/images/todoes/${cover.path}" alt="${cover.alt}" />`
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

function getUser() {
  const users = getFromLocalStorage("DB").users;
  const userId = getCookie("userId");
  return findUser(userId, users);
}

function insertSearchResultHandler(keyupEvent) {
  const typedValue = keyupEvent.target.value.trim();

  if (typedValue.length > 2) {
    user = getUser();

    const searchResult = searchTodo(typedValue, user.todos);

    insertSearchResult(searchResult, searchResultContainer);
    insertSearchResult(searchResult, mobileSearchResultContainer);
  } else {
    const template = `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <span class="text-quick-silver">You must type at least 3 characters</span>
      </li>`;

    searchResultContainer.innerHTML = template;
    mobileSearchResultContainer.innerHTML = template;
  }
}

const headerSearchInput = document.getElementById("header-search-input");
headerSearchInput.addEventListener("keyup", insertSearchResultHandler);

const mobileSearchInput = document.getElementById("mobile-search-input");
mobileSearchInput.addEventListener("keyup", insertSearchResultHandler);

function insertDate() {
  const todayDateContainer = document.getElementById("today-date");

  let dateTime = getDateTime();
  dateTime = formattingDateTime(dateTime);

  todayDateContainer.innerHTML = `<span>${dateTime.weekdayName}</span>
          <span class="text-picton-blue">${dateTime.date}</span>`;
}

function routeProtection() {
  const userId = getCookie("userId");

  if (userId == null) {
    location.href = "/src/pages/login.html";
  }
}

window.addEventListener("load", async () => {
  routeProtection();
  initilize();
});

function initilize() {
  insertDate();

  user = getUser();

  insertTextContent(`${user.name} ${user.family}`, "user-full-name");
  insertTextContent(user.email, "user-email");
}

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

const logoutBtn = document.getElementsByClassName("logout-btn")[0];

logoutBtn.addEventListener("click", async (clickEvent) => {
  clickEvent.preventDefault();

  const isLogoutConfirm = await swal({
    title: "Are you sure want to logout?",
    icon: "warning",
    buttons: {
      no: {
        text: "Cancel",
        value: false,
        className: "swal-btn--natural",
      },
      yes: {
        text: "Yes, logout!",
        value: true,
        className: "swal-btn--danger",
      },
    },
  });

  if (isLogoutConfirm) {
    deleteCookie("userId", "/src");
    routeProtection();
  }
});
