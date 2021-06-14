document.onload= redirectingFunction()

function redirectingFunction(){
    const token  = document.cookie
    if(!token){
        window.location.href = "/login.html";
    }
}