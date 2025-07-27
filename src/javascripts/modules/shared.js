import {
  calcStatistics,
  deepCopy,
  filterList,
  findTodoIndex,
  findUserIndex,
  getFromLocalStorage,
  saveToLocalStorage,
} from "./utils.js";

function showOverlay() {
  document.getElementById("overlay").classList.add("h-full");
}

function hideOverlay() {
  document.getElementById("overlay").classList.remove("h-full");
}

function showTransparentOverlay() {
  document.getElementById("transparent-overlay").classList.add("h-full");
}

function hideTransparentOverlay() {
  document.getElementById("transparent-overlay").classList.remove("h-full");
}

function showTodoOptions(element) {
  showTransparentOverlay();

  const todoOptionsContainer = element.nextElementSibling;

  todoOptionsContainer?.classList.remove("invisible", "opacity-0");
  todoOptionsContainer?.classList.add("todo-options--active");
}

function hideTodoOptions() {
  hideTransparentOverlay();

  const todoOptionsContainer = document.getElementsByClassName(
    "todo-options--active"
  )[0];

  todoOptionsContainer?.classList.add("invisible", "opacity-0");
  todoOptionsContainer?.classList.remove("todo-options--active");
}

function showLoader() {
  document
    .getElementsByClassName("loader")[0]
    ?.classList.remove("invisible", "opacity-0");

  document
    .getElementsByClassName("loader-overlay")[0]
    ?.classList.remove("invisible", "opacity-0");
}

function hideLoader() {
  document
    .getElementsByClassName("loader")[0]
    ?.classList.add("invisible", "opacity-0");

  document
    .getElementsByClassName("loader-overlay")[0]
    ?.classList.add("invisible", "opacity-0");
}

function getPriorityColorClass(priority) {
  priority = priority.toLowerCase();

  const priorityColorMap = {
    high: "danger",
    low: "picton-blue",
    medium: "amber-400",
  };

  return priorityColorMap[priority];
}

function getStatusColorClass(status) {
  status = status.toLowerCase();

  const statusColorMap = {
    completed: "success",
    "not started": "danger",
    "in progress": "blue-bonnet",
  };

  return statusColorMap[status];
}

function deleteUserTodo(todoId, user) {
  user = deepCopy(user);

  user.todos = filterList(user.todos, "id", todoId, false);
  user.statistics = calcStatistics(user.todos);

  return user;
}

function updateUserTodos(editedTodo, user) {
  user = deepCopy(user);
  const todoIndex = findTodoIndex(editedTodo.id, user.todos);

  if (todoIndex !== -1) {
    user.todos[todoIndex] = editedTodo;
    user.statistics = calcStatistics(user.todos);
  }
  return user;
}

function updateUsers(editedUser, users) {
  users = deepCopy(users);
  const userIndex = findUserIndex(users, editedUser.id);

  if (userIndex !== -1) {
    users[userIndex] = editedUser;
  }
  return users;
}

function getDB() {
  return getFromLocalStorage("DB");
}

function updateDB(DB) {
  saveToLocalStorage("DB", DB);
}

export {
  showOverlay,
  hideOverlay,
  showTransparentOverlay,
  hideTransparentOverlay,
  showTodoOptions,
  hideTodoOptions,
  showLoader,
  hideLoader,
  getPriorityColorClass,
  getStatusColorClass,
  deleteUserTodo,
  updateUserTodos,
  updateUsers,
  updateDB,
  getDB,
};
