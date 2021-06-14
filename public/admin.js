// getting the values
const submitBtn = document.querySelector("#submitbtn")
const questionInput = document.querySelector("#questionInput")
const firstOption = document.querySelector("#firstOption")
const secondOption = document.querySelector("#secondOption")
const thirdOption = document.querySelector("#thirdOption")
const fourthOption = document.querySelector("#fourthOption")
const correctOption = document.querySelector("#correctOption")
const alert = document.querySelector("#alert");

// submting questions
submitBtn.addEventListener("click", submitQuestion)

async function submitQuestion(event){
    event.preventDefault();
    const questions={
        question: questionInput.value,
        a: firstOption.value,
        b: secondOption.value,
        c: thirdOption.value,
        d: fourthOption.value,
    }
    const option ={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(questions)
    }

    const response = await fetch("/admin",option)
    const result = await response.json()
    
    if(result.status === "ok"){
        showingAlertMessages(result.message, "alert-success")
    }
}

function showingAlertMessages(message, className) {
    closeBtn = document.createElement("button");
    closeBtn.className = "btn-close";
    alert.innerText = message;
    alert.className = `alert ${className} alert-dismissible fade show`;
    alert.appendChild(closeBtn);
  }



