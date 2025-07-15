import { hideOverlay, showOverlay } from "./shared.js";
import {
  convertImgToCanvas,
  formattingDateTime,
  getDateTimeV2,
  idGenerator,
} from "./utils.js";

let todoPriority = null;
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

  document.getElementById("todo-modal")?.classList.add("opacity-0", "invisible");
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
    getDateTimeV2()
  ).dateTimeISO;

  prepareCreateTodoModal();
  showTodoModal();
}

// Edit Todo
function preFillFromInputs(task) {
  const { id, title, description, priority, cover, createdAt } = task;

  document.getElementById("todo-form__title").value = title;
  document.getElementById("todo-form__date").value = createdAt;
  document.getElementById("todo-form__description").value = description;
  document.getElementById(`priority-${priority.toLowerCase()}`).checked = true;
  document.getElementById("todo-form__update-todo-btn").dataset.taskId = id;

  const todoCoverPreview =
    document.getElementById("todo-form__cover").previousElementSibling
      .children[0];

  todoCoverPreview.src = cover.img
    ? cover.img
    : `../../src/assets/images/todoes/${cover.path}`;

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

      const image = new Image();

      image.onload = () => {
        convertImgToCanvas(image);
      };

      image.src = loadEvent.target.result;
    };

    reader.readAsDataURL(file);
  }

  showTodoCoverPreview();
  hideTodoUploadLabel();
}

function showTodoCoverPreview() {
  const todoCoverContainer = document.getElementById(
    "todo-form__cover-preview"
  );
  todoCoverContainer.classList.remove("hidden");
}
function hideTodoCoverPreview() {
  document.getElementById("todo-form__cover-preview")?.classList.add("hidden");
}

function generateNewTodo(todoId, todoCover) {
  return {
    id: todoId ?? idGenerator(),
    status: "Not Started",
    priority: document.querySelector(".priority-task:checked")?.dataset
      .taskPriority,
    cover: todoCover ?? {
      path: "./default-todo-cover.png",
      alt: "default todo cover",
      type: "png",
      img: null,
    },
    title: document.getElementById("todo-form__title").value.trim(),
    createdAt: document.getElementById("todo-form__date").value,
    description: document.getElementById("todo-form__description").value.trim(),
  };
}

function createTodoHandler(clickEvent) {
  clickEvent.preventDefault();
  const files = document.getElementById("todo-form__cover").files;

  const newTodo = generateNewTodo();

  if (isTodoValid(newTodo)) {
    if (files.length) {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        const img = new Image();

        img.onload = () => {
          newTodo.cover.img = convertImgToCanvas(img);
          newTodo.cover.alt = newTodo.title;

          document.dispatchEvent(
            new CustomEvent("todoCreated", { detail: newTodo })
          );
        };

        img.src = loadEvent.target.result;
      };

      reader.readAsDataURL(files[0]);
    } else {
      document.dispatchEvent(
        new CustomEvent("todoCreated", { detail: newTodo })
      );
    }

    hideTodoModal();
  }
}

function updateEditedTodo(todoId) {
  const files = document.getElementById("todo-form__cover").files;

  const editedTodo = generateNewTodo(todoId, selectedTodo.cover);

  if (isTodoValid(editedTodo)) {
    if (files.length) {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        const img = new Image();

        img.onload = () => {
          editedTodo.cover.img = convertImgToCanvas(img);
          editedTodo.cover.alt = editedTodo.title;
          editedTodo.cover.type = files[0].type;

          document.dispatchEvent(
            new CustomEvent("todoUpdated", { detail: editedTodo })
          );
        };

        img.src = loadEvent.target.result;
      };

      reader.readAsDataURL(files[0]);
    } else {
      document.dispatchEvent(
        new CustomEvent("todoUpdated", { detail: editedTodo })
      );
    }

    hideTodoModal();
  }
}

function updateTodoHandler(clickEvent) {
  clickEvent.preventDefault();

  const todoId = clickEvent.currentTarget.dataset.taskId;

  updateEditedTodo(todoId);
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
  const isImgSizeValid = img?.size <= 500 * 1000; // 500KB

  if (!hasAllFieldsValue) {
    swal({
      title: "Please fill all fields",
      icon: "warning",
    });
    return false;
  }

  if (img && !isImgSizeValid) {
    swal({
      title: "Cover must be maximum 500KB",
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
    todoPriority = targetElement.dataset.taskPriority;
  } else {
    todoPriority = null;
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
