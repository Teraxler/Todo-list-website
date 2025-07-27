import { hideOverlay, showOverlay } from "./shared.js";
import {
  convertImgToCanvas,
  formattingDateTime,
  getDateTime,
  idGenerator,
} from "./utils.js";

let selectedTodo = null;

function resetTodoForm() {
  document.getElementById("todo-form").reset();
}

function showTodoModal() {
  showOverlay();

  document
    .getElementById("todo-modal")
    .classList.remove("opacity-0", "invisible");
}

function hideTodoModal() {
  hideOverlay();
  hideTodoCoverPreview();
  showTodoUploadLabel();

  document
    .getElementById("todo-modal")
    ?.classList.add("opacity-0", "invisible");
}

// New Todo
function prepareCreateTodoModal() {
  document.getElementById("todo-form__update-todo-btn").classList.add("hidden");

  document
    .getElementById("todo-modal__edit-todo-title")
    .classList.add("hidden");

  document
    .getElementById("todo-modal__new-todo-title")
    .classList.remove("hidden");

  document
    .getElementById("todo-form__create-todo-btn")
    .classList.remove("hidden");
}

function showCreateTodoModal() {
  resetTodoForm();

  document.getElementById("todo-form__date").value = formattingDateTime(
    getDateTime()
  ).iso;

  prepareCreateTodoModal();
  showTodoModal();
}

// Edit Todo
function preFillFromInputs(todo) {
  const { id, title, description, priority, cover, createdAt } = todo;

  document.getElementById("todo-form__title").value = title;
  document.getElementById("todo-form__date").value = createdAt;
  document.getElementById(`priority-${priority}`).checked = true;
  document.getElementById("todo-form__description").value = description;
  document.getElementById("todo-form__update-todo-btn").dataset.taskId = id;

  const todoCoverPreview =
    document.getElementById("todo-form__cover").previousElementSibling
      .children[0];

  todoCoverPreview.src = cover.img
    ? cover.img
    : `/src/assets/images/todoes/${cover.path}`;

  showTodoCoverPreview();
  hideTodoUploadLabel();
}

function prepareEditTodoModal(task) {
  resetTodoForm();
  preFillFromInputs(task);

  document.getElementById("todo-form__create-todo-btn").classList.add("hidden");
  document.getElementById("todo-modal__new-todo-title").classList.add("hidden");

  document
    .getElementById("todo-form__update-todo-btn")
    .classList.remove("hidden");

  document
    .getElementById("todo-modal__edit-todo-title")
    .classList.remove("hidden");
}

function showEditTodoModal(todo) {
  selectedTodo = todo;
  prepareEditTodoModal(todo);
  showTodoModal();
}

function showTodoUploadLabel() {
  document
    .getElementById("todo-form__cover-upload-label")
    ?.classList.remove("hidden");
}

function hideTodoUploadLabel() {
  document
    .getElementById("todo-form__cover-upload-label")
    .classList.add("hidden");
}

function showTodoCoverPreviewHandler(changeEvent) {
  const reader = new FileReader();

  const file = changeEvent.target.files[0];
  const todoCoverContainer = changeEvent.target.previousElementSibling;

  if (file) {
    reader.onload = (loadEvent) => {
      todoCoverContainer.children[0].src = loadEvent.target.result;
    };

    reader.readAsDataURL(file);
  }

  showTodoCoverPreview();
  hideTodoUploadLabel();
}

function showTodoCoverPreview() {
  document
    .getElementById("todo-form__cover-preview")
    ?.classList.remove("hidden");
}

function hideTodoCoverPreview() {
  document.getElementById("todo-form__cover-preview")?.classList.add("hidden");
}

function createTodo(todoId, todoCover) {
  return {
    id: todoId ?? idGenerator(),
    status: "not started",
    createdAt: document.getElementById("todo-form__date").value,
    title: document.getElementById("todo-form__title").value.trim(),
    description: document.getElementById("todo-form__description").value.trim(),
    priority: document.querySelector(".priority-task:checked")?.dataset
      .taskPriority,
    cover: todoCover ?? {
      path: "./default-todo-cover.png",
      alt: "default todo cover",
      type: "png",
      img: null,
    },
  };
}

async function convertImgToBase64(file) {
  return new Promise((resolve, reject) => {
    const imgBase64 = { img: null, type: null, size: null };

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const img = new Image();

      img.onload = () => {
        imgBase64.img = convertImgToCanvas(img);
        imgBase64.type = file.type;
        imgBase64.type = file.size;

        resolve(imgBase64);
      };

      img.src = loadEvent.target.result;
    };

    reader.onerror = (error) =>
      reject(new Error(`Failed to read file ${error}`));
    reader.readAsDataURL(file);
  });
}

async function createTodoHandler(clickEvent) {
  clickEvent.preventDefault();
  const file = document.getElementById("todo-form__cover").files[0];

  const newTodo = createTodo();

  if (isTodoValid(newTodo)) {
    if (file) {
      const imgBase64 = await convertImgToBase64(file);
      newTodo.cover.img = imgBase64.img;
      newTodo.cover.type = imgBase64.type;
      newTodo.cover.alt = newTodo.title;
    }

    document.dispatchEvent(new CustomEvent("todoCreated", { detail: newTodo }));

    hideTodoModal();
  }
}

async function updateTodoHandler(clickEvent) {
  clickEvent.preventDefault();

  const file = document.getElementById("todo-form__cover").files[0];

  const todoId = clickEvent.currentTarget.dataset.taskId;
  const editedTodo = createTodo(todoId, selectedTodo.cover);

  if (isTodoValid(editedTodo)) {
    if (file) {
      const imgBase64 = await convertImgToBase64(file);

      editedTodo.cover.img = imgBase64.img;
      editedTodo.cover.type = imgBase64.type;
    }

    editedTodo.cover.alt = editedTodo.title;
    document.dispatchEvent(
      new CustomEvent("todoUpdated", { detail: editedTodo })
    );

    hideTodoModal();
  }
}

const updateTodoBtn = document.getElementById("todo-form__update-todo-btn");
updateTodoBtn?.addEventListener("click", updateTodoHandler);

function isTodoValid({ title, description, file: img, createdAt, priority }) {
  const validImgTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  const validPriorities = ["high", "medium", "low"];

  title = title.trim();
  description = description.trim();

  const hasAllFieldsValue = title && description && createdAt && priority;

  const isImgTypeValid = validImgTypes.includes(img?.type);
  const isPriorityValid = validPriorities.includes(priority);
  const isImgSizeValid = img?.size <= 300 * 1000; // 300KB

  if (!hasAllFieldsValue) {
    swal({
      title: "Please fill all fields",
      icon: "warning",
    });
    return false;
  }

  if (img && !isImgSizeValid) {
    swal({
      title: "Cover must be maximum 300KB",
      icon: "warning",
    });
    return false;
  }

  if (img && !isImgTypeValid) {
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
  }
}

const priorityTasksContainer = document.getElementById(
  "todo-form__priority-container"
);

priorityTasksContainer?.addEventListener("click", selectTodoPriorityHandler);

const createTodoBtn = document.getElementById("todo-form__create-todo-btn");
createTodoBtn?.addEventListener("click", createTodoHandler);

const todoCoverInput = document.getElementById("todo-form__cover");
todoCoverInput?.addEventListener("change", showTodoCoverPreviewHandler);

const closeCreateTodoModalBtn = document.getElementById(
  "todo-modal__close-btn"
);
closeCreateTodoModalBtn?.addEventListener("click", hideTodoModal);

export { showCreateTodoModal, showEditTodoModal, hideTodoModal };
