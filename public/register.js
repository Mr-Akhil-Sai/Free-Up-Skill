const inputName = document.querySelector("#name");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const registerBtn = document.querySelector("#registerButton")
const alert = document.querySelector("#alert");

registerBtn.addEventListener("click", register)
async function register(event) {
  event.preventDefault()
  gettingRole()
  const data = {
    userName: inputName.value,
    email: inputEmail.value,
    password: inputPassword.value,
    confirmPassword:confirmPassword.value,
    role: role
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
    showingAlertMessages(response.message, "alert-warning")
  }
  else if( response.status === "length error"){
    showingAlertMessages(response.message, "alert-warning")
  }
  else if(response.status === "not matched"){
    showingAlertMessages(response.message, "alert-warning")
  }
  else if(response.status === "role error"){
    showingAlertMessages(response.message, "alert-warning")
  }
  else{
    showingAlertMessages(response.message, "alert-success")
  }
}

function showingAlertMessages(message, className) {
  closeBtn = document.createElement("button");
  closeBtn.className = "btn-close";
  alert.innerText = message;
  alert.className = `alert ${className} alert-dismissible fade show`;
  alert.appendChild(closeBtn);
}

function gettingRole(){
  const input = document.querySelectorAll("input")
  const label = document.querySelectorAll("label")
  for(let i = 0; i < input.length; i++){
    if(input[i].type === "radio"){
      if(input[i].checked){
        role = label[i].innerText
        return role
      }
    }
  }
}