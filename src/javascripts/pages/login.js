import {
  findUserByUserPass,
  getFromLocalStorage,
  setCookieUserId,
} from "../modules/utils.js";

const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

const rememberMeCheckbox = document.getElementById("remember-me-checkbox");

async function signInUser() {
  const DB = getFromLocalStorage("DB");
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const user = findUserByUserPass({ username, password }, DB.users);

  if (user) {
    setCookieUserId(user.id, rememberMeCheckbox.checked);

    await swal({
      title: `Welcome ${user.name}`,
      icon: "success",
    });

    location.href = "../index.html";
  } else {
    swal({
      title: `Username or Password is wrong!`,
      icon: "error",
    });
  }
}

const signUpBtn = document.getElementById("sign-up-btn");

signUpBtn.addEventListener("click", signInUser);
