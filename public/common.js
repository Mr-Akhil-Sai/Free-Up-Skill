// getting the token
const token =document.cookie
const decodedToken = JSON.parse(atob(token.split(".")[1]))
const username = decodedToken.username
// showing userName
const user = document.querySelector(".user")
user.innerText = username;
document.onload= redirectingFunction()

function redirectingFunction(){
    const token  = document.cookie
    if(!token){
        window.location.href = "/login.html";
    }
}

// loging user out

const logoutBtn = document.querySelector("#logoutBtn")

logoutBtn.addEventListener("click", logoutUser)

async function logoutUser(e){
    e.preventDefault()
    const response = await fetch("logout")
    const result = await response.json()
    console.log(result)
    if(result.status === "ok"){
        window.location.href ="/login.html"
    }
}