import { hideLoader, showOverlay, hideOverlay } from "../modules/shared.js";
import {
  escapeHtml,
  getFromLocalStorage,
  saveToLocalStorage,
} from "../modules/utils.js";

let DB = {};
let categories = [];

const todoCategoriesContainer = document.getElementById("categories-container");

function insertCategories(categories, container) {
  let template = "";

  if (categories.length) {
    categories.forEach((category, index) => {
      template += `
            <div class="flex items-center justify-between">
              <h4 class="font-semibold">
                Todo ${category.name}
                <span class="block h-0.5 w-10 bg-orioles-orange"></span>
              </h4>
              <button
                class="my-auto flex items-center gap-x-2 text-xs text-quick-silver cursor-pointer hover:text-primary transition-all duration-200 hover:*:fill-white hover:*:bg-primary"
                onclick="showModal('${category.name}')"
                >
                <svg
                  class="fill-primary p-px size-[15px] transition-all duration-200 rounded-full"
                >
                  <use href="#plus-icon"></use>
                </svg>
                Add New ${category.name}
              </button>
            </div>            
            <div class="overflow-x-auto w-[calc(100%+8px)] -ml-1 px-1 pb-8">
              ${generateTable(category)}
            </div>
            ${
              categories.length !== index + 1
                ? `<!-- line -->
                  <div
                    class="w-[calc(100%+56px)] xs:w-[calc(100%+48px)] md:w-[calc(100%+56px)] -ml-6 md:-ml-7 border-t mb-7.5 border-quick-silver/63"
                  ></div>`
                : ""
            }`;
    });
  } else {
    template = "<span>No Category available</span>";
  }

  container.innerHTML = template;
}

function generateTable(category) {
  return `
              <table
                class="text-sm md:text-base text-center border-separate border-spacing-0 border border-quick-silver/63 rounded-[14px] w-full mt-3.5 shadow-todo"
              >
                <thead>
                  <tr class="border-quick-silver/63">
                    <th class="px-2.5 py-4 border-b border-quick-silver/63">
                      SN
                    </th>
                    <th
                      class="text-nowrap w-1/2 xl:w-52/100 px-2.5 py-4 border-b border-x border-quick-silver/63"
                    >
                      Todo ${category.name}
                    </th>
                    <th
                      class="px-2.5 w-42/100 xl:w-40/100 py-4 border-b border-quick-silver/63"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  id="todo-status-tbody"
                  class="*:*:*:mb-3.5 *:*:*:px-2.5 *:first:*:*:mt-4.5 *:last:*:*:mb-4.5"
                >
                  ${generateTableRows(category)}
                </tbody>
              </table>
  `;
}

function generateTableRows(category) {
  let template = "";

  if (category.values.length) {
    category.values.forEach((value, index) => {
      template += `<tr>
            <td>
              <span class="block">${index + 1}</span>
            </td>
            <td class="border-x border-quick-silver/63">
              <span class="capitalize line-clamp-1" title="${value}">${value}</span>
            </td>
            <td class="flex justify-center gap-x-3 md:gap-x-4 lg:gap-x-5 xl:gap-x-7.5 px-2.5">
              <button
                class="flex items-center gap-x-1 text-white bg-orioles-orange py-1 md:py-1.5 px-3 md:px-3.5 xl:px-4.5 rounded-lg cursor-pointer"
                  onclick="showModal('${category.name}','${value}')">
                <svg class="size-4 lg:size-4.75">
                  <use href="#edit-icon"></use>
                </svg>
                Edit
              </button>
              <button
                class="flex items-center gap-x-1 text-white bg-orioles-orange py-1 md:py-1.5 px-3 md:px-3.5 xl:px-4.5 rounded-lg cursor-pointer"
                  onclick="deleteCategoryValue('${category.name}','${value}')">
                <svg class="size-4 lg:size-4.75">
                  <use href="#delete-icon"></use>
                </svg>
                Delete
              </button>
            </td>
          </tr>`;
    });
  } else {
    template = `<tr>
                  <td>
                  </td>
                  <td class="w-full">
                    <span class="block text-davy-grey">No category value available</span>
                  </td>
                  <td>
                  </td>
                </tr>`;
  }

  return template;
}

window.deleteCategoryValue = deleteCategoryValue;

async function deleteCategoryValue(categoryName, value) {
  const isDeleteConfirm = await swal({
    title: "Delete category value",
    text: "are you sure to delete category value?",
    icon: "warning",
    buttons: ["Cancel", "Delete"],
  });

  if (!isDeleteConfirm) return;

  const categoryIndex = findCategoryIndex(categoryName);

  categories[categoryIndex].values = categories[categoryIndex].values.filter(
    (categoryValue) => categoryValue !== value
  );

  DB.categories = categories;
  saveToLocalStorage("DB", DB);

  insertCategories(categories, todoCategoriesContainer);
}

function findCategoryIndex(name) {
  return categories.findIndex((category) => category.name === name);
}

window.addEventListener("load", () => {
  DB = getFromLocalStorage("DB");
  categories = DB.categories;

  insertCategories(categories, todoCategoriesContainer);

  hideLoader();
});

function prepareModal(categoryName, value) {
  const modalTitle = document.getElementById("category-modal__title");
  const inputLabel = document.getElementById("category-form__input-label");
  const input = document.getElementById("category-form__input");

  modalTitle.textContent = `Add Todo ${categoryName}`;
  inputLabel.textContent = `Todo ${categoryName} title`;
  input.value = value ?? "";
  input.dataset.category = categoryName;
  input.dataset.currentValue = value ?? "";
}

window.showModal = showModal;

function showModal(categoryName, value) {
  prepareModal(categoryName, value);

  showOverlay();
  document.getElementById("category-modal").classList.remove("hidden");
}
function hideModal() {
  hideOverlay();
  document.getElementById("category-modal").classList.add("hidden");
}

const closeModalBtn = document.getElementById("category-modal__close-btn");

closeModalBtn.addEventListener("click", hideModal);

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", hideModal);

function updateCategoryValueHandler(clickEvent) {
  clickEvent.preventDefault();

  const input = document.getElementById("category-form__input");

  const categoryName = input.dataset.category;
  const currentValue = input.dataset.currentValue;
  const newValue = input.value.trim().toLowerCase();

  const categoryIndex = findCategoryIndex(categoryName);
  const valueIndex = categories[categoryIndex].values.findIndex(
    (value) => value === currentValue
  );

  if (!newValue) {
    swal({
      title: "Please enter valid value",
      icon: "warning",
    });
  } else {
    if (valueIndex !== -1) {
      categories[categoryIndex].values[valueIndex] = escapeHtml(newValue);
    } else {
      categories[categoryIndex].values.push(escapeHtml(newValue));
    }

    DB.categories = categories;
    saveToLocalStorage("DB", DB);
    insertCategories(categories, todoCategoriesContainer);
  }

  hideModal();
}

const saveCategoryValueBtn = document.getElementById(
  "category-modal__save-btn"
);
saveCategoryValueBtn.addEventListener("click", updateCategoryValueHandler);
