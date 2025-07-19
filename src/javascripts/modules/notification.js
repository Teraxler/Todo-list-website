"use strict";

import {
  calcRelativeDateTimeDifference,
  findUser,
  getCookie,
  getFromLocalStorage,
} from "./utils.js";
import { hideTransparentOverlay, showTransparentOverlay } from "./shared.js";

let user = {};

function showNotifications() {
  showTransparentOverlay();

  document
    .getElementById("notification")
    .classList.remove("opacity-0", "invisible");
}

function hideNotifications() {
  hideTransparentOverlay();

  document
    .getElementById("notification")
    .classList.add("opacity-0", "invisible");
}

function insertNotifications(notifications) {
  let template = "";
  const notificationsContainer = document.getElementById(
    "notifications-container"
  );

  if (notifications.length) {
    notifications.forEach((notification) => {
      const { id, priority, cover, title } = notification;
      const relativeDateTime = calcRelativeDateTimeDifference(
        notification.createdAt
      );

      template += `
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <a
          class="flex items-center justify-between gap-x-4"
          href="javascripts:void(0)"
        >
          <div>
            <p class="text-sm lg:text-base/relaxed line-clamp-2">${title}
              <span class="text-quick-silver font-medium text-xs">${relativeDateTime}</span>
            </p>
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
            class="size-10 lg:size-13 shrink-0 rounded-sm overflow-hidden"
          >
            ${
              cover.path
                ? `<img class="aspect-square" src="../../src/assets/images/todoes/${cover.path}" alt="${cover.alt}" />`
                : `<img class="aspect-square" src="${cover.img}" alt="${cover.alt}" />`
            }
          </div>
        </a>
      </li>
      `;
    });
  } else {
    template = `<li class="px-3.75 py-1.5 lg:py-2.5"> <span class="text-quick-silver">Nothing</span></li>`;
  }

  notificationsContainer.innerHTML = template;
}

window.addEventListener("load", async () => {
  const DB = getFromLocalStorage("DB");
  const userId = getCookie("userId");

  user = findUser(userId, DB.users);

  insertNotifications(user.notifications);
});

export { showNotifications, hideNotifications };
