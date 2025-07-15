import{calcRelativeDateTimeDifference as t,capitalize as e,clacDegreesOfPercent as s,convertMonthToMonthName as o,findTodoIndex as r,findUser as i,getFromLocalStorage as d,insertTextContent as a,normalizeDateTime as n,removeFromLocalStorage as l,saveToLocalStorage as c}from"../modules/utils.js";import{showCreateTodoModal as u,showEditTodoModal as p}from"../modules/todo-modal.js";import{hideLoader as x,hideTodoOptions as m,showLoader as T,showTodoOptions as g}from"../modules/shared.js";let DB={},user={};function generateTodoTemplate(t){let{id:s,title:o,description:r,cover:i,createdAt:d,priority:a,status:l}=t;return`
        <div class="max-w-100 relative py-3.5 pl-8 xl:pl-10 pr-7 xl:pr-7.5 outline outline-quick-silver rounded-[14px]">
          <!-- Circle Shape-->
          <div class="absolute top-3 xl:top-3.5 left-3 xl:left-3.5 size-2.5 xl:size-3 border-danger border-2 rounded-full"></div>
          <!-- Menu Icon -->
          <div
            class="task-options absolute top-2.5 right-3 xl:right-3.5">
            <div class="task-options__icon flex gap-x-0.5 cursor-pointer py-1">
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
              <span class="size-1 border border-quick-silver rounded-full"></span>
            </div>
            <!-- Drop-Down -->
            <div
              class="task-options__list  invisible opacity-0 absolute z-10 right-0 bg-white flex flex-col gap-y-1.25 mt-0.5 px-1.25 pb-1.75 pt-2.25 leading-5 rounded-lg shadow"
              data-is-visible="false"
              >
              <button class="task-options__edit-task text-xs text-start cursor-pointer" onclick="startTaskHandler('${s}')">
                Start
              </button>
              <button class="task-options__edit-task text-xs text-start cursor-pointer" onclick="editTaskHandler('${s}')">
                Edit
              </button>
              <button class="task-options__delete-task text-xs text-start cursor-pointer" onclick="deleteTaskHandler('${s}')">
                Delete
              </button>
              <button class="task-options__finish-task text-xs text-start cursor-pointer" onclick="finishTaskHandler('${s}')">
                Finish
              </button>
            </div>
          </div>
          <div class="flex justify-between gap-x-2 xl:gap-x-2.5">
            <div>
              <p class="text-sm xl:text-base/[19px] font-semibold">
                <a class="line-clamp-2" href="./pages/todo-details.html?id=${s}">
                  ${o}
                </a>
              </p>
              <p class="text-xs xl:text-sm/[17px] line-clamp-4 mt-2 xl:mt-2.5">
                ${r}
              </p>
            </div>
            <div class="my-auto size-20 lg:size-22 shrink-0">
              <a href="./pages/todo-details.html?id=${s}">
                <img class="aspect-square h-full rounded-xl lg:rounded-[14px] overflow-hidden"
                ${i.img?`src="${i.img}"`:`src="./assets/images/todoes/${i.path}"`}
                  alt="${i.alt}">
              </a>  
            </div>
          </div>

          <div class="flex justify-between gap-x-0.5 text-[10px] mt-3 xl:mt-3.5">
            <span>
              Priority:
              <span class="block xl:inline ${"high"===a.toLowerCase()?"text-danger":"medium"===a.toLowerCase()?"text-amber-400":"text-picton-blue"} ">${a}</span>
            </span>
            <span>
              Status:
              <span class="block xl:inline ${"not started"===l.toLowerCase()?"text-danger":"in progress"===l.toLowerCase()?"text-blue-bonnet":"text-success"} ">${e(l)}</span>
            </span>
            <span class="text-quick-silver">
              Created on:
              <span class="block xl:inline">${n(d).date}</span>
            </span>
          </div>
        </div>`}function insertFirstTodoDate(e){let s=document.getElementById("todo-date"),r=document.getElementById("todo-time-difference"),i=n(e),d=o(i.months);s.innerHTML=`${i.days}  ${d}`,r.innerHTML=`• ${t(e)}`}function insertTodos(t){let e=document.getElementById("todos-container"),s="",o=null;t.length?(insertFirstTodoDate(t[0].createdAt),t.forEach(t=>{o&&o!==t.createdAt.slice(0,10)&&(s+='<div class="w-[calc(100%+24px)] lg:w-[calc(100%+56px)] 2xl:w-[calc(100%+68px)] -ml-3 lg:-ml-7 2xl:-ml-8.5 my-3 lg:my-6 h-px bg-quick-silver/41"></div>'),o=t.createdAt.slice(0,10),s+=generateTodoTemplate(t)})):s="<span class='text-center text-davy-grey py-5'>No Todo created yet</span>",e.innerHTML=s}function insertTodosStatistics(t){let e="",o,r=document.getElementById("todos-stats-container"),i={notStarted:{title:"Not Started",donutColorVar:"--color-danger",circleColorClass:"dot-icon--danger"},inProgress:{title:"In Progress",donutColorVar:"--color-blue-bonnet",circleColorClass:"dot-icon--blue-bonnet"},completed:{title:"Completed",donutColorVar:"--color-success",circleColorClass:"dot-icon--success"}};for(let d in t)o=i[d],e+=`
  <div>
    <div
      class="donut-chart shrink-0"
      style="
        background: conic-gradient(
          var(${o.donutColorVar}) 0deg 
          ${s(t[d])}deg,
          var(--color-light-silver) ${s(t[d])}deg
            360deg
        );
      "
    >
      <span class="donut-chart__title">${t[d]}%</span>
    </div>
    <li
      class="block mt-5 text-xs lg:text-sm xl:text-base text-center dot-icon ${o.circleColorClass}"
    >
      ${o.title}
    </li>
  </div>`;r.innerHTML=e}function insertCompletedTodos(t){let e="",s=document.getElementById("todos-completed-container");t.length&&t.forEach(t=>{"Finished"===t.status&&(e+=generateTodoTemplate(t))}),e||(e="<span class='text-center text-davy-grey py-5'>Nothing Completed yet</span>"),s.innerHTML=e}function setTodoOptionsEvent(){[...document.getElementsByClassName("task-options__icon")].forEach(t=>t.addEventListener("click",g))}function updateDB(t){let e=DB.users.findIndex(e=>String(e.id)===String(t.id));DB.users[e]=t,c("DB",DB),user=(DB=d("DB")).users[e]}function updateStatistics(t){let e,s,o,r=t.length;e=s=o=0,r?(t.forEach(t=>{"Not Started"===t.status?e++:"In Progress"===t.status?s++:"Finished"===t.status&&o++}),user.statistics={completed:(o/r*100).toFixed(1),inProgress:(s/r*100).toFixed(1),notStarted:(e/r*100).toFixed(1)}):user.statistics={completed:"0.0",inProgress:"0.0",notStarted:"0.0"},updateDB(user)}function startTaskHandler(t){m();let e=r(t,user.todos);-1!==e&&(user.todos[e].status="In Progress",updateDB(user),insertTodos(user.todos),insertCompletedTodos(user.todos),updateStatistics(user.todos),insertTodosStatistics(user.statistics),setTodoOptionsEvent())}function editTaskHandler(t){m();let e=r(t,user.todos);-1!==e&&p(user.todos[e])}async function deleteTaskHandler(t){m();let e=await swal({title:"Are you sure?",buttons:["Cancel","Delete"]});if(e){let s=user.todos.filter(e=>String(e.id)!==String(t));user.todos=[...s],updateDB(user),insertTodos(user.todos),insertCompletedTodos(user.todos),updateStatistics(user.todos),insertTodosStatistics(user.statistics),setTodoOptionsEvent()}}function finishTaskHandler(t){m();let e=r(t,user.todos);-1!==e&&(user.todos[e].status="Finished",updateDB(user),insertTodos(user.todos),insertCompletedTodos(user.todos),updateStatistics(user.todos),insertTodosStatistics(user.statistics),setTodoOptionsEvent())}window.addEventListener("load",async()=>{T();let t=d("currentUser");t.rememberMe||l("currentUser"),DB=d("DB"),user=i(t.userId,DB.users),a(`Welcome ${user.name} 👋`,"user-name"),insertTodos(user.todos),insertCompletedTodos(user.todos),insertTodosStatistics(user.statistics),setTodoOptionsEvent(),x()}),window.startTaskHandler=startTaskHandler,window.editTaskHandler=editTaskHandler,window.deleteTaskHandler=deleteTaskHandler,window.finishTaskHandler=finishTaskHandler;let showCreateTodoModalBtn=document.getElementById("show-create-todo-modal");function saveTodoHandler(t){T();let e=[...user.todos];user.todos.length=0,user.todos=[t.detail,...e],updateDB(user),insertTodos(user.todos),updateStatistics(user.todos),insertTodosStatistics(user.statistics),setTodoOptionsEvent(),x()}function updateTodoHandler(t){T();let e=t.detail,s=r(e.id,user.todos);-1!==s&&(user.todos[s]=e,updateDB(user),insertTodos(user.todos),insertCompletedTodos(user.todos),updateStatistics(user.todos),insertTodosStatistics(user.statistics),setTodoOptionsEvent()),x()}showCreateTodoModalBtn.addEventListener("click",u),document.addEventListener("todoCreated",saveTodoHandler),document.addEventListener("todoUpdated",updateTodoHandler);