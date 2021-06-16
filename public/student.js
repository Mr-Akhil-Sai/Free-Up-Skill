const questionDiv = document.querySelector(".questionsDiv")
const takeTestBtn = document.querySelector("#takeTestBtn")
const alert = document.querySelector("#alert");
let questions
let index = 0

takeTestBtn.addEventListener("click", showQuestions)

// fetching data 
async function showQuestions(e){
    e.preventDefault()
    const response = await fetch("/student")
    const result = await response.json()
    if(result.status === "ok"){
        console.log(result)
        questions = result.data
        questionData();
    }
}

// storing data from backend 
function questionData(){
    const questionId = questions[index].questionId
                const question = questions[index].question
                const a = questions[index].options[0]
                const b = questions[index].options[1]
                const c = questions[index].options[2]
                const d = questions[index].options[3]
                sendingValues(questionId, question, a, b, c, d)
}

const nextBtn = document.querySelector("#nextBtn")
const previousBtn = document.querySelector("#previousBtn")

// next question function
nextBtn.addEventListener("click", nextQuestion)

function nextQuestion(e){
    e.preventDefault()
    if(index === questions.length - 2){
        nextBtn.style.display = "none"
        return submitBtn.style.display = "flex"
    }
    if(index === 0){
        previousBtn.style.display = "flex"   
    }
    console.log(questionId);
    index ++
    questionData()
}

// previous question function
previousBtn.addEventListener("click", previousQuestion)

function previousQuestion(e){
    e.preventDefault()
    index --
    questionData()
}

// printing values on to screen
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

// sending answers to backend
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

// showing alert messages
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