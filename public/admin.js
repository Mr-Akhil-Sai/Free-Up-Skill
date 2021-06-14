const token =document.cookie
const decodedToken = JSON.parse(atob(token.split(".")[1]))
const username = decodedToken.username
