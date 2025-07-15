import { hideLoader, showLoader } from "../modules/shared.js";
import {
  findUser,
  getFromLocalStorage,
  saveToLocalStorage,
} from "../modules/utils.js";

let user = {};

function fillUserInfo(user) {
  const firstNameInput = document.getElementById("first-name-input");
  const lastNameInput = document.getElementById("last-name-input");
  const emailInput = document.getElementById("email-input");
  const currentPasswordInput = document.getElementById(
    "current-password-input"
  );
  const newPasswordInput = document.getElementById("new-password-input");

  firstNameInput.value = user.name;
  lastNameInput.value = user.family;
  emailInput.value = user.email;
}

function isPasswordCorrect(password) {
  const isPasswordCorrect = user.password === password;

  if (!isPasswordCorrect) {
    swal({
      title: "Your password is wrong",
      icon: "error",
    });
  }

  return isPasswordCorrect;
}

function isUserValid({ name, family, email, newPassword }) {
  console.log("🚀 ~ isUserValid ~ newPassword:", newPassword);
  console.log("🚀 ~ isUserValid ~ email:", email);
  console.log("🚀 ~ isUserValid ~ family:", family);
  console.log("🚀 ~ isUserValid ~ name:", name);
  const patternMap = {
    name: /^[a-zA-Z]{3,16}$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)*(?=.*[@\(!\)%*?&])[a-zA-Z\d@\(!\)%*?&]{8,24}$/,
  };

  const hasAllFieldsValue = name && family && email && newPassword;

  if (!newPassword) {
    swal({
      title: "Please enter new password",
      text: "if you don't want to change password enter current password",
      icon: "warning",
    });
    return false;
  }

  if (!hasAllFieldsValue) {
    swal({
      title: "Please fill all fields",
      icon: "warning",
    });
    return false;
  }

  if (!patternMap.name.test(name)) {
    swal({
      title: "Please enter valid first name",
      text: "minimun 3 charactor (number is not valid!!)",
      icon: "warning",
    });
    return false;
  }

  if (!patternMap.name.test(family)) {
    swal({
      title: "Please enter valid last name",
      text: "minimun 3 charactor (number is not valid!!)",
      icon: "warning",
    });
    return false;
  }

  if (!patternMap.email.test(email)) {
    swal({
      title: "Please enter valid email",
      icon: "warning",
    });
    return false;
  }

  if (!patternMap.password.test(newPassword)) {
    swal({
      title: "please enter valid password",
      text: "at least 8 charactor, contain lower case, upper case, number, special charactor",
      icon: "warning",
    });
    return false;
  }

  return true;
}

function getUpdatedUser() {
  const newPasswordInput = document.getElementById("new-password-input");
  const firstNameInput = document.getElementById("first-name-input");
  const lastNameInput = document.getElementById("last-name-input");
  const emailInput = document.getElementById("email-input");
  const currentPasswordInput = document.getElementById(
    "current-password-input"
  );

  return {
    ...user,
    name: firstNameInput.value.trim(),
    family: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: currentPasswordInput.value.trim(),
    newPassword: newPasswordInput.value.trim(),
  };
}

function updateDB(updatedUser) {
  const DB = getFromLocalStorage("DB");

  const userIndex = DB.users.findIndex((user) => user.id === updatedUser.id);

  if (userIndex !== -1) {
    DB.users[userIndex] = updatedUser;

    saveToLocalStorage("DB", DB);
  }
}

function updateUserHandler(clickEvent) {
  clickEvent.preventDefault();
  const updatedUser = getUpdatedUser();

  if (isPasswordCorrect(updatedUser.password) && isUserValid(updatedUser)) {
    updatedUser.password = updatedUser.newPassword;
    delete updatedUser.newPassword;

    user = updatedUser;
    updateDB(user);

    swal({
      title: "Your information successfuly updated",
      icon: "success",
    }).then(() => location.reload());
  }
}

const saveChangesBtn = document.getElementById("save-changes-btn");
saveChangesBtn.addEventListener("click", updateUserHandler);

window.addEventListener("load", () => {
  showLoader();

  const userId = getFromLocalStorage("currentUser").userId;
  const DB = getFromLocalStorage("DB");

  user = findUser(userId, DB.users);

  fillUserInfo(user);
  hideLoader();
});
