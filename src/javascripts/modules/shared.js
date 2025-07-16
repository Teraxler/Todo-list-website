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

function showTodoOptions(clickEvent) {
  showTransparentOverlay();

  const todoOptions = clickEvent.currentTarget.nextElementSibling;

  todoOptions?.classList.remove("invisible", "opacity-0");
  todoOptions?.classList.add("todo-options--active");
}

function hideTodoOptions() {
  hideTransparentOverlay();

  const todoOptions = document.getElementsByClassName(
    "todo-options--active"
  )[0];

  todoOptions?.classList.add("invisible", "opacity-0");
  todoOptions?.classList.remove("todo-options--active");
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
    medium: "amber-400",
    low: "picton-blue",
  };

  return priorityColorMap[priority];
}

function getStatusColorClass(status) {
  status = status.toLowerCase();

  const statusColorMap = {
    "not started": "danger",
    "in progress": "blue-bonnet",
    completed: "success",
  };

  return statusColorMap[status];
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
};
