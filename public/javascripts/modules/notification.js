"use strict";import{calcRelativeDateTimeDifference as t,findUser as s,getFromLocalStorage as i}from"./utils.js";import{hideTransparentOverlay as e,showTransparentOverlay as a}from"./shared.js";let user={};function showNotifications(){a(),document.getElementById("notification").classList.remove("opacity-0","invisible")}function hideNotifications(){e(),document.getElementById("notification").classList.add("opacity-0","invisible")}function insertNotifications(s){let i="",e=document.getElementById("notifications-container");s.length?s.forEach(s=>{let{id:e,priority:a,cover:n,title:o}=s,c=t(s.createdAt);i+=`
      <li class="px-3.75 py-1.5 lg:py-2.5">
        <a
          class="flex items-center justify-between gap-x-4"
          href="javascripts:void(0)"
        >
          <div>
            <p class="text-sm lg:text-base/relaxed line-clamp-2">${o}
              <span class="text-quick-silver font-medium text-xs">${c}</span>
            </p>
            <span class="font-medium text-xs">Priority: </span
            ><span class="font-medium text-xs ${"high"===a.toLowerCase()?"text-danger":"medium"===a.toLowerCase()?"text-amber-400":"text-picton-blue"}">${a}</span>
          </div>
          <div
            class="size-10 lg:size-13 shrink-0 rounded-sm overflow-hidden"
          >
            ${n.path?`<img class="aspect-square" src="/Todo-list-website/public/assets/images/todoes/${n.path}" alt="${n.alt}" />`:`<img class="aspect-square" src="${n.img}" alt="${n.alt}" />`}
          </div>
        </a>
      </li>
      `}):i='<li class="px-3.75 py-1.5 lg:py-2.5"> <span class="text-quick-silver">Nothing</span></li>',e.innerHTML=i}window.addEventListener("load",async()=>{let t=i("DB"),e=i("currentUser");user=s(e.userId,t.users),insertNotifications(user.notifications)});export{showNotifications,hideNotifications};