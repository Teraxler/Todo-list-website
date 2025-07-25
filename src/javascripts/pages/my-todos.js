import {
  showLoader,
  hideLoader,
  getPriorityColorClass,
  getStatusColorClass,
  updateUserTodos,
  updateUsers,
  deleteUserTodo,
  getDB,
  updateDB,
} from "../modules/shared.js";
import {
  findTodo,
  findUser,
  formattingDateTime,
  getCookie,
  getFromLocalStorage,
  insertTextContent,
  normalizeDateTime,
} from "../modules/utils.js";
import { showEditTodoModal } from "../modules/todo-modal.js";

let user = {};
let DB = {};
let selectedTodoId = null;

function generateTodo(todo) {
  const { id, title, status, priority, createdAt, description, cover } = todo;

  const priorityColorClass = getPriorityColorClass(priority);
  const statusColorClass = getStatusColorClass(status);

  const dateObj = normalizeDateTime(createdAt);

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
                      alt="${cover.alt}"
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
                      formattingDateTime(dateObj).date
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
  const priorityColorClass = "text-" + getPriorityColorClass(priority);

  priorityWrapper.classList.remove(
    "text-danger",
    "text-amber-400",
    "text-picton-blue"
  );

  priorityWrapper.textContent = priority;
  priorityWrapper.classList.add(priorityColorClass);
}

function insertSelectedTodoStatus(status) {
  const statusWrapper = document.getElementById("todo-status");
  const statusColorClass = "text-" + getStatusColorClass(status);

  statusWrapper.classList.remove(
    "text-danger",
    "text-blue-bonnet",
    "text-success"
  );

  statusWrapper.textContent = status;
  statusWrapper.classList.add(statusColorClass);
}

function insertTodoCover(cover) {
  const coverContainer = document.getElementById("todo-cover");
  coverContainer.alt = cover.alt;
  coverContainer.src = cover.img
    ? cover.img
    : `../assets/images/todoes/${cover.path}`;
}

function insertTodoDetails(todo) {
  if (todo) {
    insertTodoCover(todo.cover);
    insertSelectedTodoStatus(todo.status);
    insertSelectedTodoPriority(todo.priority);

    const dateObj = normalizeDateTime(todo.createdAt);
    const createdDate = formattingDateTime(dateObj).date;

    insertTextContent(todo.title, "todo-title");
    insertTextContent(createdDate, "todo-created-at");
    insertTextContent(todo.description, "todo-description");
  } else {
    document.getElementById("todo-details-container").innerHTML = `
    <span class="block text-center text-davy-grey py-20">Please select a todo</span>
    `;
  }
}

window.addEventListener("load", () => {
  showLoader();
  initialize();
  hideLoader();
});

function initialize() {
  DB = getFromLocalStorage("DB");
  const userId = getCookie("userId");

  user = findUser(userId, DB.users);
  selectedTodoId = user.todos[0]?.id;

  render();
}

function render() {
  insertTodos(user.todos);
  insertTodoDetails(user.todos[0]);
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
    user = deleteUserTodo(selectedTodoId, user);
    DB.users = updateUsers(user, DB.users);
    updateDB(DB);

    user.todos.length === 0 ? (location.href = "../index.html") : null;

    initialize();
  }
}

function editTodoHandler() {
  const todo = findTodo(selectedTodoId, user.todos);

  showEditTodoModal(todo);
}

function startTodoHandler() {
  const selectedTodo = findTodo(selectedTodoId, user.todos);

  selectedTodo.status = "in progress";

  user = updateUserTodos(selectedTodo, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  insertTodos(user.todos);
  insertSelectedTodoStatus("in progress");
}

function completeTodoHandler() {
  const selectedTodo = findTodo(selectedTodoId, user.todos);
  selectedTodo.status = "completed";

  user = updateUserTodos(selectedTodo, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  insertTodos(user.todos);
  insertSelectedTodoStatus("completed");
}

const deleteTodoBtn = document.getElementById("delete-todo-btn");
const editTodoBtn = document.getElementById("edit-todo-btn");
const startTodoBtn = document.getElementById("start-todo-btn");
const completeTodoBtn = document.getElementById("complete-todo-btn");

deleteTodoBtn.addEventListener("click", deleteTodoHandler);
editTodoBtn.addEventListener("click", editTodoHandler);
startTodoBtn.addEventListener("click", startTodoHandler);
completeTodoBtn.addEventListener("click", completeTodoHandler);

function updateTodoHandler(customeEvent) {
  showLoader();

  user = updateUserTodos(customeEvent.detail, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  insertTodos(user.todos);
  insertTodoDetails(customeEvent.detail);
  hideLoader();
}

document.addEventListener("todoUpdated", updateTodoHandler);

window.showTodoDetailsHandler = showTodoDetailsHandler;

function showTodoDetailsHandler(todoId) {
  selectedTodoId = todoId;

  const DB = getDB("DB");
  const userId = getCookie("userId");

  user = findUser(userId, DB.users);
  insertTodos(user.todos);

  const todo = findTodo(todoId, user.todos);
  insertTodoDetails(todo);
}

