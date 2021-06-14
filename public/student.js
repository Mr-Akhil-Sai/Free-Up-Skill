const questionDiv = document.querySelector(".questionsDiv")
const takeTestBtn = document.querySelector("#takeTestBtn")

takeTestBtn.addEventListener("click", showQuestions)

async function showQuestions(e){
    e.preventDefault()
    const response = await fetch("/student")
    const result = await response.json()
    if(result.status === "ok"){
        const question = result.message[0].question
        const a = result.message[0].a
        const b = result.message[0].b
        const c = result.message[0].c
        const d = result.message[0].d
        questionDiv.innerHTML = `<p>${question}?</p>
        <p>a. ${a}</p>
        <p>b. ${b}</p>
        <p>c. ${c}</p>
        <p>d. ${d}</p>`
    }
}
