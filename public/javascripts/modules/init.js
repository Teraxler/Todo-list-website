<<<<<<< HEAD
import getDB from"../apis/db.api.js";import{getFromLocalStorage,saveToLocalStorage}from"./utils.js";async function saveDefaultData(){let a=getFromLocalStorage("DB");null==a&&(a=await getDB(),saveToLocalStorage("DB",a))}window.addEventListener("load",(async()=>{await saveDefaultData()}));
=======
import getDB from "../apis/db.api.js";
import { getFromLocalStorage, saveToLocalStorage } from "./utils.js";

async function saveDefaultData() {
  let DB = getFromLocalStorage("DB");
  if (DB == null) {
    DB = await getDB();

    saveToLocalStorage("DB", DB);
  }
}

window.addEventListener("load", async () => {
  await saveDefaultData();
});
>>>>>>> 9ed8f5af226bc334d4a671902162e6d3dce9d127
