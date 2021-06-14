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