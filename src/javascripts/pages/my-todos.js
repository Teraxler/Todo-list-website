import {
  showLoader,
  hideLoader,
  getPriorityColorClass,
  getStatusColorClass,
} from "../modules/shared.js";
import {
  findTodo,
  findTodoIndex,
  findUser,
  getCookie,
  getFromLocalStorage,
  insertTextContent,
  normalizeDateTime,
  saveToLocalStorage,
} from "../modules/utils.js";

import { showEditTodoModal } from "../modules/todo-modal.js";

let user = {};
let selectedTodoId = null;

function generateTodo(todo) {
  const { id, title, status, priority, createdAt, description, cover } = todo;

  const priorityColorClass = getPriorityColorClass(priority);
  const statusColorClass = getStatusColorClass(status);

  return `<!-- Task -->
              <div
                class="min-h-33.5 relative py-2 pl-5 sm:pl-3 md:pl-8 xl:pl-10 pr-3 md:pr-4.5 border border-quick-silver rounded-[14px] cursor-pointer
                  ${id === selectedTodoId ? "bg-quick-silver/17" : ""}"
                  onclick="showTodoDetailsHandler('${id}')">
                <!-- Circle Shape-->
                <span
                  class="sm:hidden md:inline-block absolute top-2.5 xl:top-3.5 left-2 xl:left-3.5 size-2 md:size-2.5 xl:size-3 border-${statusColorClass} border-2 rounded-full"
                ></span>
                <div class="flex justify-between gap-x-2 xl:gap-x-2.5">
                  <div>
                    <p class="text-sm xl:text-base font-semibold line-clamp-1">
                      ${title}
                    </p>
                    <p class="text-xs xl:text-sm/[17px] line-clamp-2 mt-5">
                      ${description}
                    </p>
                  </div>
                  <div class="my-auto size-18 lg:size-22 shrink-0 mt-3.25">
                    <img
                      class="h-full aspect-square rounded-xl lg:rounded-[14px] overflow-hidden"
                      ${
                        cover.img
                          ? `src=${cover.img}`
                          : `src="../assets/images/todoes/${cover.path}"`
                      }

                      alt=""
                    />
                  </div>
                </div>

                <div class="flex justify-between gap-x-0.5 text-[10px] mt-1.5">
                  <span>
                    Priority:
                    <span class="capitalize block text-nowrap xl:inline text-${priorityColorClass}"
                      >${priority}</span
                    >
                  </span>
                  <span>
                    Status:
                    <span class="capitalize block text-nowrap xl:inline text-${statusColorClass}"
                      >${status}</span
                    >
                  </span>
                  <span class="text-quick-silver">
                    Created on:
                    <span class="block text-nowrap xl:inline">${
                      normalizeDateTime(createdAt).date
                    }</span>
                  </span>
                </div>
              </div>`;
}

function insertTodos(todos) {
  let template = "",
    createdAt = null;
  const todosContainer = document.getElementById("todos-container");

  if (todos.length) {
    todos.forEach((todo) => {
      if (createdAt && createdAt !== todo.createdAt.slice(0, 10)) {
        template += `<!-- Line -->
                <div
                class="w-[calc(100%+24px)] lg:w-[calc(100%+36px)] 2xl:w-[calc(100%+60px)] -ml-3 lg:-ml-4.5 2xl:-ml-7.5 my-3 lg:my-6 border-t border-quick-silver/41"
                ></div>`;
      }

      createdAt = todo.createdAt.slice(0, 10);
      template += generateTodo(todo);
    });
  } else {
    template = `<span class='block text-center text-davy-grey py-20 sm:py-5'>No Todo created yet</span>`;
  }

  todosContainer.innerHTML = template;
}

function insertSelectedTodoPriority(priority) {
  const priorityWrapper = document.getElementById("todo-priority");
  const priorityColorClass = {
    high: "text-danger",
    medium: "text-amber-400",
    low: "text-picton-blue",
  };

  priorityWrapper.classList.remove(
    "text-danger",
    "text-amber-400",
    "text-picton-blue"
  );

  priorityWrapper.textContent = priority;
  priorityWrapper.classList.add(priorityColorClass[priority.toLowerCase()]);
}

function insertSelectedTodoStatus(status) {
  const statusWrapper = document.getElementById("todo-status");
  const statusColorClass = {
    "not started": "text-danger",
    "in progress": "text-blue-bonnet",
    completed: "text-success",
  };

  statusWrapper.classList.remove(
    "text-danger",
    "text-blue-bonnet",
    "text-success"
  );

  statusWrapper.textContent = status;
  statusWrapper.classList.add(statusColorClass[status.toLowerCase()]);
}

function insertTodoDetails(todo) {
  if (!todo) {
    document.getElementById("todo-details-container").innerHTML = `
      <span class="block text-center text-davy-grey py-20">Please select a todo</span>
    `;

    return;
  }

  const coverContainer = document.getElementById("todo-cover");
  coverContainer.src = todo.cover.img
    ? todo.cover.img
    : `../assets/images/todoes/${todo.cover.path}`;

  insertSelectedTodoStatus(todo.status);

  insertSelectedTodoPriority(todo.priority);

  insertTextContent(todo.title, "todo-title");
  insertTextContent(todo.description, "todo-description");
  insertTextContent(todo.title, "todo-title");

  const createdDate = normalizeDateTime(todo.createdAt).date;
  insertTextContent(createdDate, "todo-created-at");
}

window.addEventListener("load", () => {
  showLoader();

  const DB = getFromLocalStorage("DB");
  const userId = getCookie("userId");

  user = findUser(userId, DB.users);

  selectedTodoId = user.todos[0]?.id;

  insertTodos(user.todos);

  insertTodoDetails(user.todos[0]);
  hideLoader();
});

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
}

async function deleteTodoHandler() {
  const isDeleteConfirm = await swal({
    title: "Delete Todo",
    text: "Are you sure to delete todo?",
    icon: "warning",
    buttons: {
      no: {
        text: "Cancel",
        value: false,
        className: "swal-btn--natural",
      },
      yes: {
        text: "Delete",
        value: true,
        className: "swal-btn--danger",
      },
    },
  });

  if (isDeleteConfirm) {
    user.todos = user.todos.filter((todo) => todo.id !== selectedTodoId);
    updateDB(user);

    user.todos.length === 0 ? (location.href = "../index.html") : null;

    selectedTodoId = user.todos[0].id;

    insertTodos(user.todos);
    insertTodoDetails(user.todos[0]);
  }
}

function editTodoHandler() {
  const todo = findTodo(selectedTodoId, user.todos);

  showEditTodoModal(todo);
}

function startTodoHandler() {
  const todoIndex = findTodoIndex(selectedTodoId, user.todos);

  if (todoIndex !== -1) {
    user.todos[todoIndex].status = "in progress";

    insertTodos(user.todos);
    insertSelectedTodoStatus("in progress");

    updateStatistics(user.todos);
    updateDB(user);
  }
}

function completeTodoHandler() {
  const todoIndex = findTodoIndex(selectedTodoId, user.todos);
  if (todoIndex !== -1) {
    user.todos[todoIndex].status = "completed";

    insertTodos(user.todos);
    insertSelectedTodoStatus("completed");

    updateStatistics(user.todos);
    updateDB(user);
  }
}

const deleteTodoBtn = document.getElementById("delete-todo-btn");
const editTodoBtn = document.getElementById("edit-todo-btn");
const startTodoBtn = document.getElementById("start-todo-btn");
const completeTodoBtn = document.getElementById("complete-todo-btn");

deleteTodoBtn.addEventListener("click", deleteTodoHandler);
editTodoBtn.addEventListener("click", editTodoHandler);
startTodoBtn.addEventListener("click", startTodoHandler);
completeTodoBtn.addEventListener("click", completeTodoHandler);

function updateTodos(todos, editedTodo) {
  todos = [...todos];

  const todoIndex = todos.findIndex(
    (todo) => String(todo.id) === String(editedTodo.id)
  );

  todos[todoIndex] = editedTodo;

  return todos;
}

function updateDB(editedUser) {
  const DB = getFromLocalStorage("DB");

  const userIndex = DB.users.findIndex((user) => user.id === editedUser.id);

  if (userIndex !== -1) {
    DB.users[userIndex] = editedUser;

    saveToLocalStorage("DB", DB);
  }
}

function updateTodoHandler(customeEvent) {
  showLoader();
  const updatedTodo = customeEvent.detail;

  user.todos = updateTodos(user.todos, updatedTodo);
  updateStatistics(user.todos);
  updateDB(user);

  insertTodos(user.todos);
  insertTodoDetails(updatedTodo);
  hideLoader();
}

document.addEventListener("todoUpdated", updateTodoHandler);

window.showTodoDetailsHandler = showTodoDetailsHandler;
function showTodoDetailsHandler(todoId) {
  selectedTodoId = todoId;

  const DB = getFromLocalStorage("DB");
  const userId = getCookie("userId");

  user = findUser(userId, DB.users);
  insertTodos(user.todos);

  const todo = findTodo(todoId, user.todos);
  insertTodoDetails(todo);
}
