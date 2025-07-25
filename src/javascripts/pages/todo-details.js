import {
  calcStatistics,
  filterList,
  findTodo,
  findUser,
  formattingDateTime,
  getCookie,
  getQueryParam,
  normalizeDateTime,
} from "../modules/utils.js";
import { showEditTodoModal } from "../modules/todo-modal.js";
import {
  deleteUserTodo,
  getDB,
  getPriorityColorClass,
  getStatusColorClass,
  hideLoader,
  showLoader,
  updateDB,
  updateUsers,
  updateUserTodos,
} from "../modules/shared.js";

let user = {};
let DB = {};

window.addEventListener("load", async () => {
  showLoader();
  initialize();
  hideLoader();
});

function initialize() {
  DB = getDB();
  const userId = getCookie("userId");
  user = findUser(userId, DB.users);

  const todoId = getQueryParam("id");
  !todoId ? (location.href = "../index.html") : null;

  const todo = findTodo(todoId, user.todos);
  !todo ? (location.href = "../index.html") : null;

  insertTodoContent(todo);
}

function insertTodoPriority(priority) {
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

function insertTodoStatus(status) {
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

function insertTodoContent(todo) {
  const descriptionWrapper = document.getElementById("todo-description");
  const titleWrapper = document.getElementById("todo-title");
  const coverWrapper = document.getElementById("todo-cover");
  const createdAtWrapper = document.getElementById("todo-created-at");

  descriptionWrapper.textContent = todo.description;
  titleWrapper.textContent = todo.title;
  coverWrapper.src = todo.cover.img
    ? todo.cover.img
    : `../assets/images/todoes/${todo.cover.path}`;

  insertTodoPriority(todo.priority);
  insertTodoStatus(todo.status);

  const dateObj = normalizeDateTime(todo.createdAt);
  createdAtWrapper.textContent = formattingDateTime(dateObj).date;
}

const deleteTodoBtn = document.getElementById("delete-todo-btn");
const editTodoBtn = document.getElementById("edit-todo-btn");
const startTodoBtn = document.getElementById("start-todo-btn");
const completeTodoBtn = document.getElementById("complete-todo-btn");

deleteTodoBtn.addEventListener("click", deleteTodoHandler);
editTodoBtn.addEventListener("click", editTodoHandler);
startTodoBtn.addEventListener("click", startTodoHandler);
completeTodoBtn.addEventListener("click", completeTodoHandler);

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
    const todoId = getQueryParam("id");

    user = deleteUserTodo(todoId, user);
    DB.users = updateUsers(user, DB.users);
    updateDB(DB);

    location.href = "../index.html";
  }
}

function editTodoHandler() {
  const todoId = getQueryParam("id");
  const todo = findTodo(todoId, user.todos);

  showEditTodoModal(todo);
}

function startTodoHandler() {
  const todoId = getQueryParam("id");

  const selectedTodo = findTodo(todoId, user.todos);
  selectedTodo.status = "in progress";

  user = updateUserTodos(selectedTodo, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  insertTodoStatus("in progress");
}

function completeTodoHandler() {
  const todoId = getQueryParam("id");
  const selectedTodo = findTodo(todoId, user.todos);
  selectedTodo.status = "completed";

  user = updateUserTodos(selectedTodo, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  insertTodoStatus("completed");
}

function updateTodoHandler(customeEvent) {
  showLoader();

  user = updateUserTodos(customeEvent.detail, user);
  DB.users = updateUsers(user, DB.users);
  updateDB(DB);

  insertTodoContent(customeEvent.detail);
  hideLoader();
}

document.addEventListener("todoUpdated", updateTodoHandler);
