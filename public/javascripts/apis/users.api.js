import { baseUrl } from "../const.js";
import { findUser } from "../modules/utils.js";

async function getUser(userId) {
  try {
    const response = await fetch(`../public/javascripts/database.json`);
    const data = await response.json();

    const user = findUser(userId, data.users);

    return user;
  } catch (error) {
    console.error("Get user Failed error:", error);
  }
}

export { getUser };
