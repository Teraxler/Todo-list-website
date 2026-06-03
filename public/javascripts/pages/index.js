import{calcRelativeDateTimeDifference,clacDegreesOfPercent,filterCompletedTodos,filterNotCompletedTodos,findUser,normalizeDateTime,formattingDateTime,getCookie,insertTextContent,findTodo,calcStatistics}from"../modules/utils.js";import{showCreateTodoModal,showEditTodoModal}from"../modules/todo-modal.js";import{deleteUserTodo,getDB,getPriorityColorClass,getStatusColorClass,hideLoader,hideTodoOptions,showLoader,showTodoOptions,updateDB,updateUsers,updateUserTodos}from"../modules/shared.js";let DB={};let user={};window.showTodoOptions=showTodoOptions;function generateTodo(e){const{id:t,title:o,description:s,cover:i,createdAt:d,priority:n,status:a}=e;const r=getPriorityColorClass(n);const l=getStatusColorClass(a);const c=normalizeDateTime(d);return`
        <div class="max-w-100 relative py-3.5 pl-8 xl:pl-10 pr-7 xl:pr-7.5 outline outline-quick-silver rounded-[14px]">
          <!-- Circle Shape-->
          <div class="absolute top-3 xl:top-3.5 left-3 xl:left-3.5 size-2.5 xl:size-3 border-2 border-${l} rounded-full"></div>
          <!-- Menu Icon -->
          <div
            class="task-options absolute top-2.5 right-3 xl:right-3.5">
            <div class="task-options__icon flex gap-x-0.5 cursor-pointer py-1" onclick="showTodoOptions(this)">
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
            </div>
            <!-- Drop-Down -->
            <div
              class="task-options__list invisible opacity-0 absolute z-10 right-0 bg-white flex flex-col gap-y-0.75 mt-0.5 px-1.25 pb-1.75 pt-2.25 leading-5 rounded-lg shadow"
              data-is-visible="false"
              >
              <button class="task-options__edit-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="startTodoHandler('${t}')">
                Start
              </button>
              <button class="task-options__edit-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="editTodoHandler('${t}')">
                Edit
              </button>
              <button class="task-options__delete-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="deleteTodoHandler('${t}')">
                Delete
              </button>
              <button class="task-options__finish-task text-xs text-start cursor-pointer transition-colors hover:bg-ghost-white rounded-sm p-0.5" onclick="finishTodoHandler('${t}')">
                Finish
              </button>
            </div>
          </div>
          <div class="flex justify-between gap-x-2 xl:gap-x-2.5">
            <div>
              <p class="text-sm xl:text-base/[19px] font-semibold">
                <a class="line-clamp-1" title="${o}" href="./pages/todo-details.html?id=${t}">
                  ${o}
                </a>
              </p>
              <p class="text-xs xl:text-sm/[17px] line-clamp-2 mt-2 xl:mt-2.5"
                title="${s}">
                ${s}
              </p>
            </div>
            <div class="my-auto size-20 lg:size-22 shrink-0">
              <a href="./pages/todo-details.html?id=${t}">
                <img class="aspect-square h-full rounded-xl lg:rounded-[14px] overflow-hidden"
                  ${i.img?`src="${i.img}"`:`src="./assets/images/todoes/${i.path}"`}
                  alt="${i.alt}">
              </a>  
            </div>
          </div>
          <div class="flex justify-between gap-x-0.5 text-[10px] mt-3 xl:mt-3.5">
            <span>
              Priority:
              <span class="capitalize block xl:inline text-${r}">${n}</span>
            </span>
            <span>
              Status:
              <span class="capitalize block xl:inline text-${l}">
                ${a}
              </span>
            </span>
            <span class="text-quick-silver">
              Created on:
              <span class="block xl:inline">${formattingDateTime(c).date}</span>
            </span>
          </div>
        </div>`}function insertNewestTodoDate(e){const t=document.getElementById("todo-date");const o=document.getElementById("todo-time-difference");const s=normalizeDateTime(e);const i=formattingDateTime(s).monthName;t.textContent=`${s.day} ${i}`;o.textContent=`• ${calcRelativeDateTimeDifference(e)}`;setInterval(()=>{o.textContent=`• ${calcRelativeDateTimeDifference(e)}`},6e4)}function insertTodos(e){const t=document.getElementById("todos-container");e=filterNotCompletedTodos(e);let o="",s=null;if(e.length){insertNewestTodoDate(e[0].createdAt);e.forEach(e=>{if(s&&s!==e.createdAt.slice(0,10)){o+=`<div class="w-[calc(100%+24px)] lg:w-[calc(100%+56px)] 2xl:w-[calc(100%+68px)] -ml-3 lg:-ml-7 2xl:-ml-8.5 my-3 lg:my-6 border-t border-quick-silver/41"></div>`}s=e.createdAt.slice(0,10);o+=generateTodo(e)})}else{o="<span class='text-center text-davy-grey py-5'>No Todo created yet</span>"}t.innerHTML=o}function generateDonutChart(e,t){const o=getStatusColorClass(e);return`<div>
            <div
              class="donut-chart shrink-0"
              style="
                background: conic-gradient(
                  var(--color-${o}) 0deg 
                  ${clacDegreesOfPercent(t)}deg, var(--color-light-silver) 
                  ${clacDegreesOfPercent(t)}deg 360deg
                );">
              <span class="donut-chart__title">${t}%</span>
            </div>
            <li
              class="capitalize block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon dot-icon--${o}"
            >
              ${e}
            </li>
          </div>`}function insertTodosStatistics(e){let t="";const o=document.getElementById("todos-stats-container");for(const s in e){t+=generateDonutChart(s,e[s])}o.innerHTML=t}function insertCompletedTodos(e){let t="";e=filterCompletedTodos(e);const o=document.getElementById("todos-completed-container");if(e.length){e.forEach(e=>{t+=generateTodo(e)})}if(!t){t="<span class='text-center text-davy-grey py-5'>Nothing Completed yet</span>"}o.innerHTML=t}window.addEventListener("load",async()=>{showLoader();initialize();hideLoader()});function render(){insertTextContent(`Welcome ${user.name} 👋`,"user-name");insertTodosStatistics(user.statistics);insertCompletedTodos(user.todos);insertTodos(user.todos)}function initialize(){DB=getDB();const e=getCookie("userId");user=findUser(e,DB.users);render()}window.startTodoHandler=startTodoHandler;function startTodoHandler(e){hideTodoOptions();const t=findTodo(e,user.todos);t.status="in progress";user=updateUserTodos(t,user);DB.users=updateUsers(user,DB.users);updateDB(DB);initialize()}window.editTodoHandler=editTodoHandler;function editTodoHandler(e){hideTodoOptions();const t=findTodo(e,user.todos);t&&showEditTodoModal(t)}window.deleteTodoHandler=deleteTodoHandler;async function deleteTodoHandler(e){hideTodoOptions();const t=await swal({title:"Delete Todo",text:"are you sure want to delete todo?",icon:"warning",buttons:["Cancel","Delete"]});if(t){user=deleteUserTodo(e,user);DB.users=updateUsers(user,DB.users);updateDB(DB);initialize()}}window.finishTodoHandler=finishTodoHandler;function finishTodoHandler(e){hideTodoOptions();const t=findTodo(e,user.todos);t.status="completed";user=updateUserTodos(t,user);DB.users=updateUsers(user,DB.users);updateDB(DB);initialize()}const showCreateTodoModalBtn=document.getElementById("show-create-todo-modal");showCreateTodoModalBtn.addEventListener("click",showCreateTodoModal);function saveTodoHandler(e){showLoader();user.todos.unshift(e.detail);user.statistics=calcStatistics(user.todos);DB.users=updateUsers(user,DB.users);updateDB(DB);initialize();hideLoader()}function updateTodoHandler(e){showLoader();user=updateUserTodos(e.detail,user);DB.users=updateUsers(user,DB.users);updateDB(DB);initialize();hideLoader()}document.addEventListener("todoCreated",saveTodoHandler);document.addEventListener("todoUpdated",updateTodoHandler);