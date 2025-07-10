import {
  formattingDateTime,
  getDateTimeV2,
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

function signUpUser() {
  const newUser = {
    id: idGenerator(),
    name: firstNameInput.value.trim(),
    family: lastNameInput.value.trim(),
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
    confirmPassword: confirmPasswordInput.value.trim(),
    phone: "",
    position: "",
    createdAt: formattingDateTime(getDateTimeV2()).dateTimeISO,
    profile: "",
    todos: [],
    notifications: [],
  };

  if (isUserValid(newUser)) {
    delete newUser.confirmPassword;

    saveNewUser(newUser);
  }
}

function saveNewUser(newUser) {
  const DB = getFromLocalStorage("DB");

  const isUserExists = DB.users.find((user) => user.id === newUser.id);

  if (!isUserExists) {
    DB.users.push(newUser);

    const isSaved = saveToLocalStorage("DB", DB);

    if (isSaved) {
      location.href = "./login.html";
    }
  }
}

registerBtn.addEventListener("click", signUpUser);
