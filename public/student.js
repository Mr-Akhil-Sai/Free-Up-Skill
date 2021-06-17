const questionDiv = document.querySelector(".questionsDiv")
const takeTestBtn = document.querySelector("#takeTestBtn")
const alert = document.querySelector("#alert");
let questions
let index = 0
let answersId = []
let options = []
let questionId
takeTestBtn.addEventListener("click", showQuestions)

// fetching data 
async function showQuestions(e){
    e.preventDefault()
    const response = await fetch("/student")
    const result = await response.json()
    if(result.status === "ok"){
        questions = result.data
        questionData();
    }
}

// storing data from backend 
function questionData(){
                questionId = questions[index]._id
                const questionsLength = questions.length
                const question = questions[index].question
                for (let i = 0; i < questions[index].options.length; i++) {
                    options.push(questions[index].options[i])
                }
                displayingValues(questionsLength, question)
}

const nextBtn = document.querySelector("#nextBtn")
const previousBtn = document.querySelector("#previousBtn")

// next question function
nextBtn.addEventListener("click", nextQuestion)
function nextQuestion(e){
    e.preventDefault()
    if(index === questions.length - 2){
        nextBtn.style.display = "none"
        submitBtn.style.display = "flex"
    }
    if(index === 0){
        previousBtn.style.display = "flex"   
    }
    gettingSelectedOptions(questionId)
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

// randomizing the options on screen
let individualOptions = []
function randomValues(){
    let option = []
    for (let i = 0; i < 4; i++) {
        option.push(options[i].option)
    }
    option.sort()
    option.forEach(ele => {
        for (let i = 0; i < 4; i++) {
            if(ele === options[i].option){
                individualOptions.push({
                    option: ele,
                    id: options[i]._id
                })
            }
        }
    })
}
// printing values on to screen
function displayingValues(questionsLength, question){
    randomValues()
    const noOfQuestions = document.querySelector(".noOfQuestions")
    const questionPara = document.querySelector(".questionPara")
    const optionA = document.querySelector(".labelA")
    const optionB= document.querySelector(".labelB")
    const optionC = document.querySelector(".labelC")
    const optionD = document.querySelector(".labelD")
    noOfQuestions.innerText = `Total no of questions: ${questionsLength}`
    questionPara.innerHTML = question
    optionA.innerHTML = individualOptions[0].option
    optionA.id = individualOptions[0].id
    optionB.innerHTML = individualOptions[1].option
    optionB.id = individualOptions[1].id
    optionC.innerHTML = individualOptions[2].option
    optionC.id = individualOptions[2].id
    optionD.innerHTML = individualOptions[3].option
    optionD.id = individualOptions[3].id
    options = []
    individualOptions = []
    questionDiv.style.display = "block"
}
    
const submitBtn = document.querySelector("#submitBtn")
submitBtn.addEventListener("click", submitingAnswers)

function submitingAnswers(e){
    e.preventDefault()
    gettingSelectedOptions(questionId)
    sendingAnswersToBackend()
}

// getting seclected options
function gettingSelectedOptions(questionId){
    const input = document.querySelectorAll("input")
    const label = document.querySelectorAll("label")
    for(let i =0; i < input.length; i++){
        if(input[i].type === "radio"){
            if(input[i].checked){
                const selectedOptionId = label[i].id
                answersId.push({
                    optionsId: selectedOptionId,
                    questionId: questionId
                })
                input[i].checked = false; 
            }
        }
    }
}

// sending answers to backend
async function sendingAnswersToBackend(){
    console.log(answersId);
    const details = {
        answers: answersId
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
        let correctAswers = 0
        let wrongAnswers = 0
        questionDiv.style.display = "none"
        result.message.forEach(element => {
            if(element === 1){
                correctAswers ++
            }
            else{
                wrongAnswers ++
            }
        });
        showingAlertMessages(correctAswers, wrongAnswers, "alert-success")
    }
    else{
        questionDiv.style.display = "none"
        showingAlertMessages( "no data from back end", "alert-danger")
    }
}

// showing alert messages
function showingAlertMessages(correctAswers, wrongAnswers, className) {
    const closeBtn = document.createElement("button");
    const correctAnswersPara = document.createElement("p")
    const wrongAnswersPara= document.createElement("p") 
    closeBtn.className = "btn-close";
    correctAnswersPara.innerText = `Correct Answers: ${correctAswers}`
    wrongAnswersPara.innerText = `Wrong Answers: ${wrongAnswers}`
    correctAnswersPara.className = "text-center"
    wrongAnswersPara.className = "text-center"
    alert.className = `alert ${className} alert-dismissible fade show mt-3`;
    alert.appendChild(correctAnswersPara)
    alert.appendChild(wrongAnswersPara)
    alert.appendChild(closeBtn);
    closeBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        location.reload()
    })
  }