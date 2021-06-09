const inputName = document.querySelector("#name");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");

async function register() {
  const data = {
    userName: inputName.value,
    email: inputEmail.value,
    password: inputPassword.value,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const userData = JSON.stringify(data);
  const parse = JSON.parse(userData);
  console.log(parse);
  await checkPassword();
  let userDetails = await fetch("/register", options);
  return userDetails.json();
}

function checkPassword() {
  if (inputPassword.value === confirmPassword.value) {
    console.log("password matched");
  } else {
    console.log("password does not match");
  }
}
