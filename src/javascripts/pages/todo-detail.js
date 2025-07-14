import {
  findTodo,
  findTodoIndex,
  findUser,
  formattingDateTime,
  getFromLocalStorage,
  getQueryParam,
  normalizeDateTime,
  saveToLocalStorage,
} from "../modules/utils.js";
import { showEditTodoModal } from "../modules/todo-modal.js";

let user = {};

window.addEventListener("load", async () => {
  const userId = getFromLocalStorage("currentUser").userId;
  const DB = getFromLocalStorage("DB");

  user = findUser(userId, DB.users);

  const todoId = getQueryParam("id");
  !todoId ? (location.href = "../index.html") : null;

  const todo = findTodo(todoId, user.todos);
  !todo ? (location.href = "../index.html") : null;

  insertTodoContent(todo);
});

function insertTodoPriority(priority) {
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

function insertTodoStatus(status) {
  const statusWrapper = document.getElementById("todo-status");
  const statusColorClass = {
    "not started": "text-danger",
    "in progress": "text-blue-bonnet",
    finished: "text-success",
  };

  statusWrapper.classList.remove(
    "text-danger",
    "text-blue-bonnet",
    "text-success"
  );

  statusWrapper.textContent = status;
  statusWrapper.classList.add(statusColorClass[status.toLowerCase()]);
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

  createdAtWrapper.textContent = normalizeDateTime(todo.createdAt).date;
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

    user.todos = user.todos.filter((todo) => todo.id !== todoId);
    updateDB(user);

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

  const todoIndex = findTodoIndex(todoId, user.todos);

  if (todoIndex !== -1) {
    user.todos[todoIndex].status = "In Progress";

    updateDB(user);

    insertTodoStatus("In Progress");
  }
}

function completeTodoHandler() {
  const todoId = getQueryParam("id");
  const todoIndex = findTodoIndex(todoId, user.todos);

  if (todoIndex !== -1) {
    user.todos[todoIndex].status = "Finished";
    updateDB(user);

    insertTodoStatus("Finished");
  }
}

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
  const updatedTodo = customeEvent.detail;

  user.todos = updateTodos(user.todos, updatedTodo);
  updateDB(user);

  insertTodoContent(updatedTodo);
}

document.addEventListener("todoUpdated", updateTodoHandler);
