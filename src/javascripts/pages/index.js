import {
  calcRelativeDateTimeDifference,
  clacDegreesOfPercent,
  filterCompletedTodos,
  filterNotCompletedTodos,
  findUser,
  normalizeDateTime,
  formattingDateTime,
  getCookie,
  insertTextContent,
  findTodo,
  calcStatistics,
} from "../modules/utils.js";
import {
  showCreateTodoModal,
  showEditTodoModal,
} from "../modules/todo-modal.js";
import {
  deleteUserTodo,
  getDB,
  getPriorityColorClass,
  getStatusColorClass,
  hideLoader,
  hideTodoOptions,
  showLoader,
  showTodoOptions,
  updateDB,
  updateUsers,
  updateUserTodos,
} from "../modules/shared.js";

let DB = {};
let user = {};

window.showTodoOptions = showTodoOptions;

function generateTodo(todo) {
  const { id, title, description, cover, createdAt, priority, status } = todo;

  const priorityColorClass = getPriorityColorClass(priority);
  const statusColorClass = getStatusColorClass(status);

  const dateObj = normalizeDateTime(createdAt);

  return `
        <div class="max-w-100 relative py-3.5 pl-8 xl:pl-10 pr-7 xl:pr-7.5 outline outline-quick-silver rounded-[14px]">
          <!-- Circle Shape-->
          <div class="absolute top-3 xl:top-3.5 left-3 xl:left-3.5 size-2.5 xl:size-3 border-2 border-${statusColorClass} rounded-full"></div>
          <!-- Menu Icon -->
          <div
            class="task-options absolute top-2.5 right-3 xl:right-3.5">
            <div class="task-options__icon flex gap-x-0.5 cursor-pointer py-1" onclick="showTodoOptions(this)">
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
            </div>
            <!-- Drop-Down -->
            <div
              class="task-options__list invisible opacity-0 absolute z-10 right-0 bg-white flex flex-col gap-y-0.75 mt-0.5 px-1.25 pb-1.75 pt-2.25 leading-5 rounded-lg shadow"
              data-is-visible="false"
              >
              <button class="task-options__edit-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="startTodoHandler('${id}')">
                Start
              </button>
              <button class="task-options__edit-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="editTodoHandler('${id}')">
                Edit
              </button>
              <button class="task-options__delete-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="deleteTodoHandler('${id}')">
                Delete
              </button>
              <button class="task-options__finish-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="finishTodoHandler('${id}')">
                Finish
              </button>
            </div>
          </div>
          <div class="flex justify-between gap-x-2 xl:gap-x-2.5">
            <div>
              <p class="text-sm xl:text-base/[19px] font-semibold">
                <a class="line-clamp-1" title="${title}" href="./pages/todo-details.html?id=${id}">
                  ${title}
                </a>
              </p>
              <p class="text-xs xl:text-sm/[17px] line-clamp-2 mt-2 xl:mt-2.5"
                title="${description}">
                ${description}
              </p>
            </div>
            <div class="my-auto size-20 lg:size-22 shrink-0">
              <a href="./pages/todo-details.html?id=${id}">
                <img class="aspect-square h-full rounded-xl lg:rounded-[14px] overflow-hidden"
                  ${
                    cover.img
                      ? `src="${cover.img}"`
                      : `src="./assets/images/todoes/${cover.path}"`
                  }
                  alt="${cover.alt}">
              </a>  
            </div>
          </div>
          <div class="flex justify-between gap-x-0.5 text-[10px] mt-3 xl:mt-3.5">
            <span>
              Priority:
              <span class="capitalize block xl:inline text-${priorityColorClass}">${priority}</span>
            </span>
            <span>
              Status:
              <span class="capitalize block xl:inline text-${statusColorClass}">
                ${status}
              </span>
            </span>
            <span class="text-quick-silver">
              Created on:
              <span class="block xl:inline">${
                formattingDateTime(dateObj).date
              }</span>
            </span>
          </div>
        </div>`;
}

function insertNewestTodoDate(isoDateTime) {
  const firstTodoDateContainer = document.getElementById("todo-date");
  const timeDifferenceContainer = document.getElementById(
    "todo-time-difference"
  );

  const dateObj = normalizeDateTime(isoDateTime);
  const monthName = formattingDateTime(dateObj).monthName;

  firstTodoDateContainer.textContent = `${dateObj.day} ${monthName}`;

  timeDifferenceContainer.textContent = `• ${calcRelativeDateTimeDifference(
    isoDateTime
  )}`;

  setInterval(() => {
    timeDifferenceContainer.textContent = `• ${calcRelativeDateTimeDifference(
      isoDateTime
    )}`;
  }, 60000);
}

function insertTodos(todos) {
  const todosContainer = document.getElementById("todos-container");
  todos = filterNotCompletedTodos(todos);

  let template = "",
    createdAt = null;

  if (todos.length) {
    insertNewestTodoDate(todos[0].createdAt);

    todos.forEach((todo) => {
      if (createdAt && createdAt !== todo.createdAt.slice(0, 10)) {
        // Only date, not time!
        template += `<div class="w-[calc(100%+24px)] lg:w-[calc(100%+56px)] 2xl:w-[calc(100%+68px)] -ml-3 lg:-ml-7 2xl:-ml-8.5 my-3 lg:my-6 border-t border-quick-silver/41"></div>`;
      }

      createdAt = todo.createdAt.slice(0, 10);
      template += generateTodo(todo);
    });
  } else {
    template =
      "<span class='text-center text-davy-grey py-5'>No Todo created yet</span>";
  }

  todosContainer.innerHTML = template;
}

function generateDonutChart(status, percent) {
  const statusColorClass = getStatusColorClass(status);

  return `<div>
            <div
              class="donut-chart shrink-0"
              style="
                background: conic-gradient(
                  var(--color-${statusColorClass}) 0deg 
                  ${clacDegreesOfPercent(
                    percent
                  )}deg, var(--color-light-silver) 
                  ${clacDegreesOfPercent(percent)}deg 360deg
                );"
            >
              <span class="donut-chart__title">${percent}%</span>
            </div>
            <li
              class="capitalize block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon dot-icon--${statusColorClass}"
            >
              ${status}
            </li>
          </div>`;
}

function insertTodosStatistics(statistics) {
  let template = "";

  const todosStatsContainer = document.getElementById("todos-stats-container");

  for (const status in statistics) {
    template += generateDonutChart(status, statistics[status]);
  }

  todosStatsContainer.innerHTML = template;
}

function insertCompletedTodos(todos) {
  let template = "";
  todos = filterCompletedTodos(todos);

  const todosCompletedContainer = document.getElementById(
    "todos-completed-container"
  );

  if (todos.length) {
    todos.forEach((todo) => {
      template += generateTodo(todo);
    });
  }

  if (!template) {
    template =
      "<span class='text-center text-davy-grey py-5'>Nothing Completed yet</span>";
  }

  todosCompletedContainer.innerHTML = template;
}

window.addEventListener("load", async () => {
  showLoader();
  initialize();

  hideLoader();
});

function render() {
  insertTextContent(`Welcome ${user.name} 👋`, "user-name");
  insertTodosStatistics(user.statistics);
  insertCompletedTodos(user.todos);
  insertTodos(user.todos);
}

function initialize() {
  DB = getDB();

  const userId = getCookie("userId");
  user = findUser(userId, DB.users);

  render();
}

window.startTodoHandler = startTodoHandler;

function startTodoHandler(todoId) {
  hideTodoOptions();

  const selectedTodo = findTodo(todoId, user.todos);
  selectedTodo.status = "in progress";

  user = updateUserTodos(selectedTodo, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  initialize();
}

window.editTodoHandler = editTodoHandler;

function editTodoHandler(todoId) {
  hideTodoOptions();

  const selectedTodo = findTodo(todoId, user.todos);
  selectedTodo && showEditTodoModal(selectedTodo);
}

window.deleteTodoHandler = deleteTodoHandler;

async function deleteTodoHandler(todoId) {
  hideTodoOptions();

  const isDeleteConfirm = await swal({
    title: "Delete Todo",
    text: "are you sure want to delete todo?",
    icon: "warning",
    buttons: ["Cancel", "Delete"],
  });

  if (isDeleteConfirm) {
    user = deleteUserTodo(todoId, user);
    DB.users = updateUsers(user, DB.users);
    updateDB(DB);

    initialize();
  }
}

window.finishTodoHandler = finishTodoHandler;

function finishTodoHandler(todoId) {
  hideTodoOptions();

  const selectedTodo = findTodo(todoId, user.todos);
  selectedTodo.status = "completed";

  user = updateUserTodos(selectedTodo, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  initialize();
}

const showCreateTodoModalBtn = document.getElementById(
  "show-create-todo-modal"
);

showCreateTodoModalBtn.addEventListener("click", showCreateTodoModal);

function saveTodoHandler(event) {
  showLoader();

  user.todos.push(event.detail);
  user.statistics = calcStatistics(user.todos);

  DB.users = updateUsers(user, DB.users);
  updateDB(DB);
  initialize();

  hideLoader();
}

function updateTodoHandler(event) {
  showLoader();

  user = updateUserTodos(event.detail, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  initialize();
  hideLoader();
}

document.addEventListener("todoCreated", saveTodoHandler);
document.addEventListener("todoUpdated", updateTodoHandler);
