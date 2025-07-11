import {
  calcRelativeDateTimeDifference,
  capitalize,
  clacDegreesOfPercent,
  convertMonthToMonthName,
  findTodoIndex,
  findUser,
  getFromLocalStorage,
  normalizeDateTime,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "../modules/utils.js";
import {
  showCreateTodoModal,
  showEditTodoModal,
} from "../modules/todo-modal.js";
import { hideTodoOptions, showTodoOptions } from "../modules/shared.js";

let DB = {};
let user = {};

function generateTodoTemplate(todo) {
  const { id, title, description, cover, createdAt, priority, status } = todo;

  return `
        <div class="max-w-100 relative py-3.5 pl-8 xl:pl-10 pr-7 xl:pr-7.5 outline outline-quick-silver rounded-[14px]">
          <!-- Circle Shape-->
          <div class="absolute top-3 xl:top-3.5 left-3 xl:left-3.5 size-2.5 xl:size-3 border-danger border-2 rounded-full"></div>
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
              <p class="text-sm xl:text-base/[19px] font-semibold line-clamp-2">
                ${title}
              </p>
              <p class="text-xs xl:text-sm/[17px] line-clamp-4 mt-2 xl:mt-2.5">
                ${description}
              </p>
            </div>
            <div class="my-auto size-20 lg:size-22 shrink-0">
              <img class="aspect-square h-full rounded-xl lg:rounded-[14px] overflow-hidden"
                ${
                  cover.path
                    ? `src="./assets/images/todoes/${cover.path}"`
                    : `src="${cover.img}"`
                }
                alt="${cover.alt}">
            </div>
          </div>

          <div class="flex justify-between gap-x-0.5 text-[10px] mt-3 xl:mt-3.5">
            <span>
              Priority:
              <span class="block xl:inline ${
                priority.toLowerCase() === "high"
                  ? "text-danger"
                  : priority.toLowerCase() === "medium"
                  ? "text-amber-400"
                  : "text-picton-blue"
              } ">${priority}</span>
            </span>
            <span>
              Status:
              <span class="block xl:inline ${
                status.toLowerCase() === "not started"
                  ? "text-danger"
                  : status.toLowerCase() === "in progress"
                  ? "text-blue-bonnet"
                  : "text-success"
              } ">${capitalize(status)}</span>
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

  let template = "",
    createdAt = null;

  if (todos.length) {
    insertFirstTodoDate(todos[0].createdAt);

    todos.forEach((todo) => {
      if (createdAt && createdAt !== todo.createdAt.slice(0, 10)) {
        // Only date, not time!
        template += `<div class="w-[calc(100%+24px)] lg:w-[calc(100%+56px)] 2xl:w-[calc(100%+68px)] -ml-3 lg:-ml-7 2xl:-ml-8.5 my-3 lg:my-6 h-px bg-quick-silver/41"></div>`;
      }

      createdAt = todo.createdAt.slice(0, 10);
      template += generateTodoTemplate(todo);
    });
  } else {
    template =
      "<span class='text-center text-davy-grey py-5'>No Todo created yet</span>";
  }

  todosContainer.innerHTML = template;
}

function insertTodosStatistics(statistics) {
  console.log(statistics);

  let template = "",
    title = "",
    donutColorVar = "",
    circleColorClass = "";
  const todosStatsContainer = document.getElementById("todos-stats-container");

  if (statistics) {
    for (const key in statistics) {
      if (key === "completed") {
        title = "Completed";
        donutColorVar = "--color-success";
        circleColorClass = "dot-icon--success";
      } else if (key === "inProgress") {
        title = "In Progress";
        donutColorVar = "--color-blue-bonnet";
        circleColorClass = "dot-icon--blue-bonnet";
      } else {
        title = "Not Started";
        donutColorVar = "--color-danger";
        circleColorClass = "dot-icon--danger";
      }

      template += `
        <div>
          <div class="donut-chart shrink-0" style="background: conic-gradient(
      var(${donutColorVar}) 0deg ${clacDegreesOfPercent(statistics[key])}deg,
      var(--color-light-silver) ${clacDegreesOfPercent(
        statistics[key]
      )}deg 360deg
    );">
            <span class="donut-chart__title">${statistics[key]}%</span>
          </div>
          <li class="block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon ${circleColorClass}">
            ${title}
          </li>
        </div>`;
    }
  } else {
    template = `
        <div>
          <div class="donut-chart shrink-0" style="background: conic-gradient(
        var(--color-success) 0deg 0deg,
        var(--color-light-silver) 0deg 360deg);">
          <span class="donut-chart__title">0%</span>
          </div>
          <li class="block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon dot-icon--success">
            Completed
          </li>
        </div>
        <div>
          <div class="donut-chart shrink-0" style="background: conic-gradient(
        var(--color-blue-bonnet) 0deg 0deg,
        var(--color-light-silver) 0deg 360deg);">
          <span class="donut-chart__title">0%</span>
          </div>
          <li class="block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon dot-icon--blue-bonnet">
            In Progress
          </li>
        </div>
        <div>
          <div class="donut-chart shrink-0" style="background: conic-gradient(
        var(--color-danger) 0deg 0deg,
        var(--color-light-silver) 0deg 360deg);">
          <span class="donut-chart__title">0%</span>
          </div>
          <li class="block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon dot-icon--danger">
            Not Started
          </li>
        </div>`;
  }

  todosStatsContainer.innerHTML = template;
}

function insertCompletedTodos(todos) {
  let template = "";
  const todosCompletedContainer = document.getElementById(
    "todos-completed-container"
  );

  if (todos.length) {
    todos.forEach((todo) => {
      if (todo.status === "Finished") {
        template += generateTodoTemplate(todo);
      }
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
  const currentUser = getFromLocalStorage("currentUser");
  !currentUser.rememberMe && removeFromLocalStorage("currentUser");

  DB = getFromLocalStorage("DB");

  user = findUser(currentUser.userId, DB.users);

  insertTodos(user.todos);
  insertCompletedTodos(user.todos);
  insertTodosStatistics(user.statistics);
  setTodoOptionsEvent();
});

function updateDB(editedUser) {
  const userIndex = DB.users.findIndex(
    (user) => String(user.id) === String(editedUser.id)
  );

  DB.users[userIndex] = editedUser;

  saveToLocalStorage("DB", DB);
  DB = getFromLocalStorage("DB");
}

function updateStatistics(todos) {
  let count = todos.length,
    notStarted,
    inProgress,
    finished;

  notStarted = inProgress = finished = 0;

  todos.forEach((todo) => {
    if (todo.status === "Not Started") {
      notStarted++;
    } else if (todo.status === "In Progress") {
      inProgress++;
    } else if (todo.status === "Finished") {
      finished++;
    }
  });

  user.statistics = {
    completed: ((finished / count) * 100).toFixed(1),
    inProgress: ((inProgress / count) * 100).toFixed(1),
    notStarted: ((notStarted / count) * 100).toFixed(1),
  };

  updateDB(user);
}

window.startTaskHandler = startTaskHandler;

function startTaskHandler(todoId) {
  hideTodoOptions();

  const todoIndex = findTodoIndex(todoId, user.todos);

  if (todoIndex !== -1) {
    user.todos[todoIndex].status = "In Progress";

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
    title: "Are you sure?",
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
    user.todos[taskIndex].status = "Finished";
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
  let temp = [...user.todos];

  user.todos.length = 0;
  user.todos = [event.detail, ...temp];
  updateDB(user);

  insertTodos(user.todos);
  updateStatistics(user.todos);
  insertTodosStatistics(user.statistics);
  setTodoOptionsEvent();
}

function updateTodoHandler(event) {
  const editedTodo = event.detail;
  const editedTodoIndex = findTodoIndex(editedTodo.id, user.todos);

  if (editedTodoIndex !== -1) {
    user.todos[editedTodoIndex] = editedTodo;

    updateDB(user);
  }

  insertTodos(user.todos);
  updateStatistics(user.todos);
  insertTodosStatistics(user.statistics);
  setTodoOptionsEvent();
}

document.addEventListener("todoCreated", saveTodoHandler);
document.addEventListener("todoUpdated", updateTodoHandler);
