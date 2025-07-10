import { getFromLocalStorage, saveToLocalStorage } from "../modules/utils.js";

const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

const rememberMeCheckbox = document.getElementById("remember-me-checkbox");
const signUpBtn = document.getElementById("sign-up-btn");

function findUserByUserPass(username, password) {
  const DB = getFromLocalStorage("DB");

  return DB.users.find(
    (user) => user.username === username && user.password === password
  );
}

async function signInUser() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const user = findUserByUserPass(username, password);
  if (user) {
    await swal({
      title: `Welcome ${user.name}`,
      icon: "success",
    });

    const currentUser = {
      userId: user.id,
      rememberMe: rememberMeCheckbox.checked,
    };

    const isSavedSuccessfull = saveToLocalStorage("currentUser", currentUser);

    if (isSavedSuccessfull) {
      location.href = "../index.html";
    }
  } else {
    swal({
      title: `Username or Password is wrong!`,
      icon: "error",
    });
  }
}

signUpBtn.addEventListener("click", signInUser);
