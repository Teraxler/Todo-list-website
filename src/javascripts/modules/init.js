import getData from "../apis/db.api.js";
import { getFromLocalStorage, saveToLocalStorage } from "./utils.js";

async function saveDefaultData() {
  let DB = getFromLocalStorage("DB");

  if (DB == null) {
    DB = await getData();
    saveToLocalStorage("DB", DB);
  }
}

window.addEventListener("load", () => {
  saveDefaultData();
});
