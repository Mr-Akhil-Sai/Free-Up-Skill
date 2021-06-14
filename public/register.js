const inputName = document.querySelector("#name");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const selectMenu = document.querySelector("#select")
const registerBtn = document.querySelector("#registerButton")
const alert = document.querySelector("#alert");

registerBtn.addEventListener("click", register)
async function register(event) {
  event.preventDefault()
  let selectLower = selectMenu.value
  selectLower = selectLower.toLowerCase()
  console.log(selectLower);
  const data = {
    userName: inputName.value,
    email: inputEmail.value,
    password: inputPassword.value,
    confirmPassword:confirmPassword.value,
    role: selectLower
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  let userDetails = await fetch("/register", options);
  let response = await userDetails.json();

  if(response.status ==="user exits"){
    showingAlertMessages(response.message, "warning")
  }
  else if( response.status === "length error"){
    showingAlertMessages(response.message, "warning")
  }
  else if(response.status === "not matched"){
    showingAlertMessages(response.message, "warning")
  }
  else if(response.status === "role error"){
    showingAlertMessages(response.message, "warning")
  }
  else{
    showingAlertMessages(response.message, "success")
  }
}

function showingAlertMessages(message, className) {
  closeBtn = document.createElement("button");
  closeBtn.className = "btn-close";
  alert.innerText = message;
  alert.className = `alert ${className} alert-dismissible fade show`;
  alert.appendChild(closeBtn);
}


