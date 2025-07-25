import {
  findUser,
  formattingDateTime,
  getDateTime,
  getFromLocalStorage,
  idGenerator,
  saveToLocalStorage,
} from "../modules/utils.js";

const firstNameInput = document.getElementById("first-name-input");
const lastNameInput = document.getElementById("last-name-input");
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");

const acceptTermsCheckbox = document.getElementById("accept-terms-checkbox");
const registerBtn = document.getElementById("register-btn");

function isUserValid(newUser) {
  const regexPattern = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    name: /^[a-zA-Z]{3,24}$/,
    username: /^[a-zA-Z]\w{2,15}$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\(!\)%*?&])[A-Za-z\d@\(!\)%*?&]{8,24}$/,
  };

  const hasAllInputValue =
    newUser.name &&
    newUser.family &&
    newUser.email &&
    newUser.username &&
    newUser.password &&
    newUser.confirmPassword;

  if (!acceptTermsCheckbox.checked) {
    swal({
      title: "Please accept terms",
      icon: "warning",
    });
    return false;
  }
  if (!hasAllInputValue) {
    swal({ title: "Please enter all fields", icon: "warning" });
    return false;
  }
  if (!regexPattern.name.test(newUser.name)) {
    swal({
      title: "please enter valid name (first name)",
      icon: "warning",
    });
    return false;
  }
  if (!regexPattern.name.test(newUser.family)) {
    swal({
      title: "please enter valid name (last name)",
      icon: "warning",
    });
    return false;
  }
  if (!regexPattern.username.test(newUser.username)) {
    swal({
      title: "please enter valid username",
      icon: "warning",
    });
    return false;
  }
  if (!regexPattern.email.test(newUser.email)) {
    swal({
      title: "please enter valid email",
      icon: "warning",
    });
    return false;
  }
  if (!regexPattern.password.test(newUser.password)) {
    swal({
      title: "password must contain at least 8 charactors",
      text: "must have lower case, upper case, number and special charactor",
      icon: "warning",
    });
    return false;
  }
  if (newUser.password !== newUser.confirmPassword) {
    swal({
      title: "Password and confirm password must be the same!",
      icon: "warning",
    });
    return false;
  }

  return true;
}

function craeteUser() {
  return {
    id: idGenerator(),
    name: firstNameInput.value.trim(),
    family: lastNameInput.value.trim(),
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
    confirmPassword: confirmPasswordInput.value.trim(),
    phone: "",
    position: "",
    createdAt: formattingDateTime(getDateTime()).iso,
    profile: "",
    todos: [],
    notifications: [],
  };
}

function signUpUser() {
  const newUser = craeteUser();

  if (isUserValid(newUser)) {
    delete newUser.confirmPassword;

    saveNewUser(newUser);
  }
}

function isUserExists(id, users) {
  return findUser(id, users) ? true : false;
}

function saveNewUser(newUser) {
  const DB = getFromLocalStorage("DB");

  if (!isUserExists(newUser.id, DB.users)) {
    DB.users.push(newUser);

    saveToLocalStorage("DB", DB);

    location.href = "./login.html";
  }
}

registerBtn.addEventListener("click", signUpUser);
