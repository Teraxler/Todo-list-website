import{hideLoader,showOverlay,hideOverlay,updateDB}from"../modules/shared.js";import{escapeHtml,getFromLocalStorage,saveToLocalStorage}from"../modules/utils.js";let DB={};let categories=[];const todoCategoriesContainer=document.getElementById("categories-container");function generateCategoryHeader(e){return`<div class="flex items-center justify-between">
              <h4 class="font-semibold">
                Todo ${e}
                <span class="block h-0.5 w-10 bg-orioles-orange"></span>
              </h4>
              <button
                class="my-auto flex items-center gap-x-2 text-xs text-quick-silver cursor-pointer hover:text-primary transition-all duration-200 hover:*:fill-white hover:*:bg-primary"
                onclick="showModal('${e}')"
                >
                <svg
                  class="fill-primary p-px size-[15px] transition-all duration-200 rounded-full"
                >
                  <use href="#plus-icon"></use>
                </svg>
                Add New ${e}
              </button>
            </div>`}function insertCategories(a,e){let o="";if(a.length){a.forEach((e,t)=>{o+=`
            ${generateCategoryHeader(e.name)}
            <div class="overflow-x-auto w-[calc(100%+8px)] -ml-1 px-1 pb-8">
              ${generateTable(e)}
            </div>
            ${a.length!==t+1?`<!-- line -->
                  <div
                    class="w-[calc(100%+56px)] xs:w-[calc(100%+48px)] md:w-[calc(100%+56px)] -ml-6 md:-ml-7 border-t mb-7.5 border-quick-silver/63"
                  ></div>`:""}`})}else{o="<span>No Category available</span>"}e.innerHTML=o}function generateTable(e){return`
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
                      Todo ${e.name}
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
                  ${generateTableRows(e)}
                </tbody>
              </table>
  `}function generateTableRows(a){let o="";if(a.values.length){a.values.forEach((e,t)=>{o+=`<tr>
            <td>
              <span class="block">${t+1}</span>
            </td>
            <td class="border-x border-quick-silver/63">
              <span class="capitalize line-clamp-1" title="${e}">${e}</span>
            </td>
            <td class="flex justify-center gap-x-3 md:gap-x-4 lg:gap-x-5 xl:gap-x-7.5 px-2.5">
              <button
                class="flex items-center gap-x-1 text-white bg-orioles-orange py-1 md:py-1.5 px-3 md:px-3.5 xl:px-4.5 rounded-lg cursor-pointer"
                  onclick="showModal('${a.name}','${e}')">
                <svg class="size-4 lg:size-4.75">
                  <use href="#edit-icon"></use>
                </svg>
                Edit
              </button>
              <button
                class="flex items-center gap-x-1 text-white bg-orioles-orange py-1 md:py-1.5 px-3 md:px-3.5 xl:px-4.5 rounded-lg cursor-pointer"
                  onclick="deleteCategoryValue('${a.name}','${e}')">
                <svg class="size-4 lg:size-4.75">
                  <use href="#delete-icon"></use>
                </svg>
                Delete
              </button>
            </td>
          </tr>`})}else{o=`<tr>
                  <td>
                  </td>
                  <td class="w-full">
                    <span class="block text-davy-grey">No category value available</span>
                  </td>
                  <td>
                  </td>
                </tr>`}return o}window.deleteCategoryValue=deleteCategoryValue;async function deleteCategoryValue(e,t){const a=await swal({title:"Delete category value",text:"are you sure to delete category value?",icon:"warning",buttons:["Cancel","Delete"]});if(!a)return;const o=findCategoryIndex(e);categories[o].values=categories[o].values.filter(e=>e!==t);DB.categories=categories;updateDB(DB);insertCategories(categories,todoCategoriesContainer)}function findCategoryIndex(t){return categories.findIndex(e=>e.name===t)}window.addEventListener("load",()=>{initialize();insertCategories(categories,todoCategoriesContainer);hideLoader()});function initialize(){DB=getFromLocalStorage("DB");categories=DB.categories}function prepareModal(e,t){const a=document.getElementById("category-modal__title");const o=document.getElementById("category-form__input-label");const r=document.getElementById("category-form__input");a.textContent=`Add Todo ${e}`;o.textContent=`Todo ${e} title`;r.value=t??"";r.dataset.category=e;r.dataset.currentValue=t??""}window.showModal=showModal;function showModal(e,t){prepareModal(e,t);showOverlay();document.getElementById("category-modal").classList.remove("hidden")}function hideModal(){hideOverlay();document.getElementById("category-modal").classList.add("hidden")}const closeModalBtn=document.getElementById("category-modal__close-btn");closeModalBtn.addEventListener("click",hideModal);const overlay=document.getElementById("overlay");overlay.addEventListener("click",hideModal);function updateCategoryValueHandler(e){e.preventDefault();const t=document.getElementById("category-form__input");const a=t.dataset.category;const o=t.dataset.currentValue;const r=t.value.trim().toLowerCase();const s=findCategoryIndex(a);const l=categories[s].values.findIndex(e=>e===o);if(!r){swal({title:"Please enter valid value",icon:"warning"})}else{if(l!==-1){categories[s].values[l]=escapeHtml(r)}else{categories[s].values.push(escapeHtml(r))}DB.categories=categories;saveToLocalStorage("DB",DB);insertCategories(categories,todoCategoriesContainer)}hideModal()}const saveCategoryValueBtn=document.getElementById("category-modal__save-btn");saveCategoryValueBtn.addEventListener("click",updateCategoryValueHandler);