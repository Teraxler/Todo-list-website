import {
  calcRelativeDateTimeDifference,
  clacDegreesOfPercent,
  convertMonthToMonthName,
  filterCompletedTodos,
  filterNotCompletedTodos,
  findTodoIndex,
  findUser,
  getCookie,
  getFromLocalStorage,
  insertTextContent,
  normalizeDateTime,
  saveToLocalStorage,
} from "../modules/utils.js";
import {
  showCreateTodoModal,
  showEditTodoModal,
} from "../modules/todo-modal.js";
import {
  getPriorityColorClass,
  getStatusColorClass,
  hideLoader,
  hideTodoOptions,
  showLoader,
  showTodoOptions,
} from "../modules/shared.js";

let DB = {};
let user = {};

function generateTodoTemplate(todo) {
  const { id, title, description, cover, createdAt, priority, status } = todo;

  const priorityColorClass = getPriorityColorClass(priority);
  const statusColorClass = getStatusColorClass(status);

  return `
        <div class="max-w-100 relative py-3.5 pl-8 xl:pl-10 pr-7 xl:pr-7.5 outline outline-quick-silver rounded-[14px]">
          <!-- Circle Shape-->
          <div class="absolute top-3 xl:top-3.5 left-3 xl:left-3.5 size-2.5 xl:size-3 border-2 border-${statusColorClass} rounded-full"></div>
          <!-- Menu Icon -->
          <div
            class="task-options absolute top-2.5 right-3 xl:right-3.5">
            <div class="task-options__icon flex gap-x-0.5 cursor-pointer py-1">
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
            </div>
            <!-- Drop-Down -->
            <div
              class="task-options__list  invisible opacity-0 absolute z-10 right-0 bg-white flex flex-col gap-y-1.25 mt-0.5 px-1.25 pb-1.75 pt-2.25 leading-5 rounded-lg shadow"
              data-is-visible="false"
              >
              <button class="task-options__edit-task text-xs text-start cursor-pointer" onclick="startTaskHandler('${id}')">
                Start
              </button>
              <button class="task-options__edit-task text-xs text-start cursor-pointer" onclick="editTaskHandler('${id}')">
                Edit
              </button>
              <button class="task-options__delete-task text-xs text-start cursor-pointer" onclick="deleteTaskHandler('${id}')">
                Delete
              </button>
              <button class="task-options__finish-task text-xs text-start cursor-pointer" onclick="finishTaskHandler('${id}')">
                Finish
              </button>
            </div>
          </div>
          <div class="flex justify-between gap-x-2 xl:gap-x-2.5">
            <div>
              <p class="text-sm xl:text-base/[19px] font-semibold">
                <a class="line-clamp-2" href="./pages/todo-details.html?id=${id}">
                  ${title}
                </a>
              </p>
              <p class="text-xs xl:text-sm/[17px] line-clamp-4 mt-2 xl:mt-2.5">
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
                normalizeDateTime(createdAt).date
              }</span>
            </span>
          </div>
        </div>`;
}

function insertFirstTodoDate(dateTime) {
  const firstTodoDateContainer = document.getElementById("todo-date");
  const timeDifferenceContainer = document.getElementById(
    "todo-time-difference"
  );

  const dateTimeObj = normalizeDateTime(dateTime);
  const monthName = convertMonthToMonthName(dateTimeObj.months);

  firstTodoDateContainer.innerHTML = `${dateTimeObj.days}  ${monthName}`;
  timeDifferenceContainer.innerHTML = `• ${calcRelativeDateTimeDifference(
    dateTime
  )}`;
}

function insertTodos(todos) {
  const todosContainer = document.getElementById("todos-container");
  todos = filterNotCompletedTodos(todos);

  let template = "",
    createdAt = null;

  if (todos.length) {
    insertFirstTodoDate(todos[0].createdAt);

    todos.forEach((todo) => {
      if (todo.status.toLowerCase() !== "completed") {
        if (createdAt && createdAt !== todo.createdAt.slice(0, 10)) {
          // Only date, not time!
          template += `<div class="w-[calc(100%+24px)] lg:w-[calc(100%+56px)] 2xl:w-[calc(100%+68px)] -ml-3 lg:-ml-7 2xl:-ml-8.5 my-3 lg:my-6 border-t border-quick-silver/41"></div>`;
        }

        createdAt = todo.createdAt.slice(0, 10);
        template += generateTodoTemplate(todo);
      }
    });
  } else {
    template =
      "<span class='text-center text-davy-grey py-5'>No Todo created yet</span>";
  }

  todosContainer.innerHTML = template;
}

function insertTodosStatistics(statistics) {
  let template = "";

  const todosStatsContainer = document.getElementById("todos-stats-container");

  for (const status in statistics) {
    const statusColorClass = getStatusColorClass(status);

    template += `
  <div>
    <div
      class="donut-chart shrink-0"
      style="
        background: conic-gradient(
          var(--color-${statusColorClass}) 0deg 
          ${clacDegreesOfPercent(
            statistics[status]
          )}deg, var(--color-light-silver) 
          ${clacDegreesOfPercent(statistics[status])}deg 360deg
        );
      "
    >
      <span class="donut-chart__title">${statistics[status]}%</span>
    </div>
    <li
      class="capitalize block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon dot-icon--${statusColorClass}"
    >
      ${status}
    </li>
  </div>`;
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
      template += generateTodoTemplate(todo);
    });
  }

  if (!template) {
    template =
      "<span class='text-center text-davy-grey py-5'>Nothing Completed yet</span>";
  }

  todosCompletedContainer.innerHTML = template;
}

function setTodoOptionsEvent() {
  [...document.getElementsByClassName("task-options__icon")].forEach(
    (todoOptionIcon) =>
      todoOptionIcon.addEventListener("click", showTodoOptions)
  );
}

window.addEventListener("load", async () => {
  showLoader();
  const userId = getCookie("userId");
  DB = getFromLocalStorage("DB");

  user = findUser(userId, DB.users);

  insertTextContent(`Welcome ${user.name} 👋`, "user-name");
  insertTodosStatistics(user.statistics);
  insertCompletedTodos(user.todos);
  insertTodos(user.todos);
  setTodoOptionsEvent();
  hideLoader();
});

function updateDB(editedUser) {
  const userIndex = DB.users.findIndex(
    (user) => String(user.id) === String(editedUser.id)
  );

  DB.users[userIndex] = editedUser;

  saveToLocalStorage("DB", DB);
  DB = getFromLocalStorage("DB");
  user = DB.users[userIndex];
}

function updateStatistics(todos) {
  let notStarted, inProgress, completed;
  const count = todos.length;

  notStarted = inProgress = completed = 0;

  if (count) {
    todos.forEach((todo) => {
      switch (todo.status) {
        case "not started":
          notStarted++;
          break;
        case "in progress":
          inProgress++;
          break;
        case "completed":
          completed++;
          break;
        default:
          break;
      }
    });

    user.statistics = {
      completed: Math.round((completed / count) * 100),
      "in progress": Math.round((inProgress / count) * 100),
      "not started": Math.round((notStarted / count) * 100),
    };
  } else {
    user.statistics = {
      completed: 0,
      "in progress": 0,
      "not started": 0,
    };
  }

  updateDB(user);
}

window.startTaskHandler = startTaskHandler;

function startTaskHandler(todoId) {
  hideTodoOptions();

  const todoIndex = findTodoIndex(todoId, user.todos);

  if (todoIndex !== -1) {
    user.todos[todoIndex].status = "in progress";

    updateDB(user);

    insertTodos(user.todos);
    insertCompletedTodos(user.todos);
    updateStatistics(user.todos);
    insertTodosStatistics(user.statistics);
    setTodoOptionsEvent();
  }
}

window.editTaskHandler = editTaskHandler;

function editTaskHandler(taskId) {
  hideTodoOptions();

  const taskIndex = findTodoIndex(taskId, user.todos);
  taskIndex !== -1 ? showEditTodoModal(user.todos[taskIndex]) : null;
}

window.deleteTaskHandler = deleteTaskHandler;

async function deleteTaskHandler(taskId) {
  hideTodoOptions();

  const isDeleteConfirm = await swal({
    title: "Delete Todo",
    text: "are you sure want to delete todo?",
    icon:"warning",
    buttons: ["Cancel", "Delete"],
  });

  if (isDeleteConfirm) {
    const remainingTodos = user.todos.filter(
      (task) => String(task.id) !== String(taskId)
    );

    user.todos = [...remainingTodos];
    updateDB(user);

    insertTodos(user.todos);
    insertCompletedTodos(user.todos);
    updateStatistics(user.todos);
    insertTodosStatistics(user.statistics);
    setTodoOptionsEvent();
  }
}

window.finishTaskHandler = finishTaskHandler;

function finishTaskHandler(taskId) {
  hideTodoOptions();

  const taskIndex = findTodoIndex(taskId, user.todos);

  if (taskIndex !== -1) {
    user.todos[taskIndex].status = "completed";
    updateDB(user);

    insertTodos(user.todos);
    insertCompletedTodos(user.todos);
    updateStatistics(user.todos);
    insertTodosStatistics(user.statistics);
    setTodoOptionsEvent();
  }
}

const showCreateTodoModalBtn = document.getElementById(
  "show-create-todo-modal"
);
showCreateTodoModalBtn.addEventListener("click", showCreateTodoModal);

function saveTodoHandler(event) {
  showLoader();

  let temp = [...user.todos];

  user.todos.length = 0;
  user.todos = [event.detail, ...temp];
  updateDB(user);

  insertTodos(user.todos);
  updateStatistics(user.todos);
  insertTodosStatistics(user.statistics);
  setTodoOptionsEvent();

  hideLoader();
}

function updateTodoHandler(event) {
  showLoader();

  const editedTodo = event.detail;
  const editedTodoIndex = findTodoIndex(editedTodo.id, user.todos);

  if (editedTodoIndex !== -1) {
    user.todos[editedTodoIndex] = editedTodo;

    updateDB(user);
    insertTodos(user.todos);
    insertCompletedTodos(user.todos);
    updateStatistics(user.todos);
    insertTodosStatistics(user.statistics);
    setTodoOptionsEvent();
  }

  hideLoader();
}

document.addEventListener("todoCreated", saveTodoHandler);
document.addEventListener("todoUpdated", updateTodoHandler);
