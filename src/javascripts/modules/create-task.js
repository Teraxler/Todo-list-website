import { hideOverlay, showOverlay } from "./shared.js";
import {
  convertImgToCanvas,
  formattingDateTime,
  getBase64Image,
  getDateTimeV2,
  getFromLocalStorage,
  idGenerator,
  saveToLocalStorage,
} from "./utils.js";

let todoPriority = null;

function initModal() {
  resetTodoForm();

  document.getElementById("new-todo-date").value = formattingDateTime(
    getDateTimeV2()
  ).dateTimeISO;
}

function resetTodoForm() {
  document.getElementById("new-todo-form").reset();
}

function hideCreateTodoModal() {
  hideOverlay();
  hideTodoCoverPreview();
  showTodoUploadLabel();

  document
    .getElementById("create-todo-modal")
    .classList.add("opacity-0", "invisible");
}

function showCreateTodoModal() {
  initModal();
  showOverlay();

  document
    .getElementById("create-todo-modal")
    .classList.remove("opacity-0", "invisible");
}

function getNewTodoData() {
  return {
    priority: todoPriority,
    cover: document.getElementById("new-todo-cover").files[0],
    title: document.getElementById("new-todo-title").value.trim(),
    createdAt: document.getElementById("new-todo-date").value,
    description: document.getElementById("new-todo-description").value.trim(),
  };
}

function createNewTodo(todo) {
  return {
    ...todo,
    id: idGenerator(),
    status: "Not Started",
    cover: { path: todo.cover, alt: todo.title },
  };
}

function saveNewTodo(newTodo) {
  let todos = getFromLocalStorage("myTodos") || [];
  todos = [newTodo, ...todos];

  saveToLocalStorage("myTodos", todos);
}

function showTodoUploadLabel() {
  document.getElementById("todo-cover-upload-label").classList.remove("hidden");
}
function hideTodoUploadLabel() {
  document.getElementById("todo-cover-upload-label").classList.add("hidden");
}

function showTodoCoverPreviewHandler(changeEvent) {
  const reader = new FileReader();

  const file = changeEvent.target.files[0];
  const todoCoverContainer = changeEvent.target.previousElementSibling;

  if (file) {
    reader.onload = (loadEvent) => {
      todoCoverContainer.children[0].src = loadEvent.target.result;

      const image = new Image();

      image.onload = () => {
        imgAsDataUrl = convertImgToCanvas(image);
      };

      image.src = loadEvent.target.result;
    };

    reader.readAsDataURL(file);
  }

  showTodoCoverPreview();
  hideTodoUploadLabel();
}

function showTodoCoverPreview() {
  const todoCoverContainer = document.getElementById("todo-cover-preview");
  todoCoverContainer.classList.remove("hidden");
}
function hideTodoCoverPreview() {
  document.getElementById("todo-cover-preview").classList.add("hidden");
}

function createTodoHandler(clickEvent) {
  clickEvent.preventDefault();

  const newTodo = {
    id: idGenerator(),
    status: "Not Started",
    priority: todoPriority,
    cover: { path: null, alt: null, img: null },
    file: document.getElementById("new-todo-cover").files[0],
    title: document.getElementById("new-todo-title").value.trim(),
    createdAt: document.getElementById("new-todo-date").value,
    description: document.getElementById("new-todo-description").value.trim(),
  };

  if (isTodoValid(newTodo)) {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const img = new Image();

      img.onload = () => {
        delete newTodo.file;

        newTodo.cover.img = convertImgToCanvas(img);
        newTodo.cover.alt = newTodo.title;

        hideCreateTodoModal();
        saveNewTodo(newTodo);

        document.dispatchEvent(
          new CustomEvent("todoCreated", { detail: newTodo })
        );
      };

      img.src = loadEvent.target.result;
    };

    reader.readAsDataURL(newTodo.file);
  }
}

function isTodoValid({ title, description, file, createdAt, priority }) {
  const validImgTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  const validPriorities = ["high", "medium", "low"];

  title = title.trim();
  description = description.trim();

  const hasAllFieldsValue =
    title && description && createdAt && priority && file;

  const isImgTypeValid = validImgTypes.includes(file?.type);
  const isPriorityValid = validPriorities.includes(priority);
  const isImgSizeValid = file?.size <= 500 * 1000; // 500KB

  if (!hasAllFieldsValue) {
    swal({
      title: "Please fill all fields",
      icon: "warning",
    });

    return false;
  }

  if (!isImgSizeValid) {
    swal({
      title: "Cover must be maximum 500KB",
      icon: "warning",
    });

    return false;
  }

  if (!isImgTypeValid) {
    swal({
      title: "Cover type must be one of (png, jpg, jpeg, webp)",
      icon: "warning",
    });

    return false;
  }

  if (!isPriorityValid) {
    swal({
      title: "Priority must be (High, Medium or low)",
      icon: "warning",
    });

    return false;
  }

  return true;
}

function deSelectPriorityInputs() {
  [...document.getElementsByClassName("priority-task")].forEach(
    (checkboxInput) => (checkboxInput.checked = false)
  );
}

function selectTodoPriorityHandler(clickEvent) {
  const targetElement = clickEvent.target;

  if (targetElement.tagName === "INPUT" && targetElement.checked) {
    deSelectPriorityInputs();
    targetElement.checked = true;
    todoPriority = targetElement.dataset.taskPriority;
  } else {
    todoPriority = null;
  }
}

const priorityTasksContainer = document.getElementById(
  "priority-tasks-container"
);

priorityTasksContainer.addEventListener("click", selectTodoPriorityHandler);

const createTodoBtn = document.getElementById("create-todo-btn");
createTodoBtn.addEventListener("click", createTodoHandler);

const todoCoverInput = document.getElementById("new-todo-cover");
todoCoverInput.addEventListener("change", showTodoCoverPreviewHandler);

export { showCreateTodoModal, hideCreateTodoModal };
