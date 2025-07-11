import getDB from "../apis/db.api.js";
import { getFromLocalStorage, saveToLocalStorage } from "./utils.js";

async function saveDefaultData() {
  let DB = getFromLocalStorage("DB");
  if (!Boolean(DB)) {
    DB = await getDB();

    saveToLocalStorage("DB", DB);
  }
}

window.addEventListener("load", async () => {
  await saveDefaultData();
});
