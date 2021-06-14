const userEmail = document.querySelector("#userEmail");
const password = document.querySelector("#password");
const alert = document.querySelector("#alert");

const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", login);

async function login(event) {
  event.preventDefault();
  const userDetails = {
    email: userEmail.value,
    password: password.value,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  };
  const response = await fetch("/login", options);
  const result = await response.json();
  // success
  if (result.status === "ok") {
    if(result.role === "admin"){
      window.location.href = "/admin.html"
    }
    else{
      window.location.href = "/student.html"
    }
    }
  // user not found
  else if (result.status === "no user") {
    showingAlertMessages(result.message, "alert-warning");
    userEmail.value = "";
    password.value = "";
  }
  // email or password error
  else if (result.status === "error") {
    showingAlertMessages(result.message, "alert-danger");
    userEmail.value = "";
    password.value = "";
  }
}

function showingAlertMessages(message, className) {
  closeBtn = document.createElement("button");
  closeBtn.className = "btn-close";
  alert.innerText = message;
  alert.className = `alert ${className} alert-dismissible fade show`;
  alert.appendChild(closeBtn);
}
