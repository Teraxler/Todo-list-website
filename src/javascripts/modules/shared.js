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

  todoOptions.classList.remove("invisible", "opacity-0");
  todoOptions.classList.add("todo-options--active");
}

function hideTodoOptions() {
  hideTransparentOverlay();

  const todoOptions = document.getElementsByClassName(
    "todo-options--active"
  )[0];

  todoOptions.classList.add("invisible", "opacity-0");
  todoOptions.classList.remove("todo-options--active");
}

export {
  showOverlay,
  hideOverlay,
  showTransparentOverlay,
  hideTransparentOverlay,
  showTodoOptions,
  hideTodoOptions,
};
