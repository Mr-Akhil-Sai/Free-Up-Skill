const questionDiv = document.querySelector(".questionsDiv")
const takeTestBtn = document.querySelector("#takeTestBtn")
const alert = document.querySelector("#alert");

takeTestBtn.addEventListener("click", showQuestions)

async function showQuestions(e){
    e.preventDefault()
    const response = await fetch("/student")
    const result = await response.json()
    if(result.status === "ok"){
        const questionId = result.questionId
        const question = result.questions
        const a = result.options[0]
        const b = result.options[1]
        const c = result.options[2]
        const d = result.options[3]
        sendingValues(questionId, question, a, b, c, d)
    }
}

function sendingValues(questionId, question, a, b, c, d){
    const questionPara = document.querySelector(".questionPara")
    const optionA = document.querySelector(".labelA")
    const optionB= document.querySelector(".labelB")
    const optionC = document.querySelector(".labelC")
    const optionD = document.querySelector(".labelD")
    questionPara.innerHTML = question
    optionA.innerHTML = a.a
    optionA.id = a._id
    optionB.innerHTML = b.b
    optionB.id = b._id
    optionC.innerHTML = c.c
    optionC.id = c._id
    optionD.innerHTML = d.d
    optionD.id = d._id
    questionDiv.style.display = "block"
    const submitBtn = document.querySelector("#submitBtn")
    
    submitBtn.addEventListener("click", submitingAnswers)
    
    function submitingAnswers(e){
        e.preventDefault()
        const input = document.querySelectorAll("input")
        const label = document.querySelectorAll("label")
        for(let i =0; i < input.length; i++){
            if(input[i].type === "radio"){
                if(input[i].checked){
                    const answer = label[i].id
                    sendingAnswersToBackend(questionId, answer)
                }
            }
        }
    }
}
async function sendingAnswersToBackend(questionId, answer){
    const details = {
        questionId: questionId,
        answer: answer
    }
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      };
    const response = await fetch("/student", options)
    const result = await response.json();
    if(result.status === "ok"){
        questionDiv.style.display = "none"
        showingAlertMessages(result.message, "alert-success")
    }
    else{
        questionDiv.style.display = "none"
        showingAlertMessages(result.message, "alert-danger")
    }
}

function showingAlertMessages(message, className) {
    closeBtn = document.createElement("button");
    closeBtn.className = "btn-close";
    alert.innerText = message;
    alert.className = `alert ${className} alert-dismissible fade show`;
    alert.appendChild(closeBtn);
    closeBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        location.reload()
    })
  }