"use strict";import{calcRelativeDateTimeDifference,findUser,getCookie,getFromLocalStorage}from"./utils.js";import{hideTransparentOverlay,showTransparentOverlay}from"./shared.js";let user={};function showNotifications(){showTransparentOverlay();document.getElementById("notification").classList.remove("opacity-0","invisible")}function hideNotifications(){hideTransparentOverlay();document.getElementById("notification").classList.add("opacity-0","invisible")}function generateNotification(t){const{priority:e,cover:i,title:s,createdAt:a}=t;const n=calcRelativeDateTimeDifference(a);return`
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <a
          class="flex items-center justify-between gap-x-4"
          href="javascripts:void(0)"
        >
          <div>
            <p class="text-sm lg:text-base/relaxed line-clamp-2">${s}
              <span class="text-quick-silver font-medium text-xs">${n}</span>
            </p>
            <span class="font-medium text-xs">Priority: </span
            ><span class="font-medium text-xs ${e==="high"?"text-danger":e==="medium"?"text-amber-400":"text-picton-blue"}">${e}</span>
          </div>
          <div
            class="size-10 lg:size-13 shrink-0 rounded-sm overflow-hidden"
          >
            ${i.path?`<img class="aspect-square" src="../../public/assets/images/todoes/${i.path}" alt="${i.alt}" />`:`<img class="aspect-square" src="${i.img}" alt="${i.alt}" />`}
          </div>
        </a>
      </li>
      `}function insertNotifications(t,e){let i="";if(t.length){t.forEach(t=>{i+=generateNotification(t)})}else{i=`<li class="px-3.75 py-1.5 lg:py-2.5"> <span class="text-quick-silver">Nothing</span></li>`}e.innerHTML=i}const notificationsContainer=document.getElementById("notifications-container");window.addEventListener("load",async()=>{const t=getFromLocalStorage("DB");const e=getCookie("userId");user=findUser(e,t.users);insertNotifications(user.notifications,notificationsContainer)});export{showNotifications,hideNotifications};