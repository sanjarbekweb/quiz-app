let questions = null

await load()

async function load() {
    const response = await fetch("http://localhost:3000/questions")

    if (response.ok) {
        questions = await response.json()
    } else {
        console.log("oxshamadi");
    }
}

const ul = document.querySelector("ul")
const finishButton = document.getElementById("finish")
const nextt = document.getElementById("next")
const previous = document.getElementById("pre")
let act = 0

for (const q of questions) {
    const li = document.createElement("li")
    li.classList.add("content")
    const h1 = document.createElement("h1")
    const divQuestions = document.createElement("div")
    divQuestions.className = "questions"
    h1.textContent = `${q.id}. ${q.question}`
    for (let i = 0; i < q.options.length; i++) {
        const o = q.options[i]
        const div = document.createElement("div")
        div.className = "quest"
        const input = document.createElement("input")
        const label = document.createElement("label")
        input.type = "radio"
        input.name = `q${q.id}`
        input.id = `q${q.id}_${i}`

        label.setAttribute("for", input.id)
        label.textContent = o.answer
        label.style.textTransform = "capitalize"
        div.appendChild(input)
        div.appendChild(label)
        divQuestions.appendChild(div)
    }
    li.appendChild(h1)
    li.appendChild(divQuestions)
    ul.appendChild(li)
    document.querySelectorAll(".content")[act].classList.add("active")
}

function stylerAct(tar) {
    tar.style.pointerEvents = "auto"
    tar.style.opacity = "1"
}
function stylerNone(tar) {
    tar.style.pointerEvents = "none"
    tar.style.opacity = ".6"
}
const contents = document.querySelectorAll(".content")
nextt.addEventListener("click", () => {
    if (act < questions.length) {
        act++
        stylerAct(pre)
    }
    if (act === questions.length - 1) {
        stylerNone(nextt)
    }
    contents.forEach((e) => {
        e.classList.remove("active")
    })
    contents[act].classList.add("active")
})
stylerNone(pre)
pre.addEventListener("click", () => {
    contents.forEach((e) => {
        e.classList.remove("active")
    })
    if (act < questions.length) {
        act--
        stylerAct(nextt)
    }
    if (act === 0) {
        stylerNone(pre)
        stylerAct(nextt)
    }

    contents[act].classList.add("active")
})



const not = document.createElement("p")
not.className = "tot"
not.style.color = "red"
not.textContent = "Hammasini to'ldiring , Iltimos"
ul.appendChild(not)


finishButton.onclick = async () => {
    const inputs = document.querySelectorAll("#app ul input:checked")
    if (inputs.length == questions.length) {
        const countOfQuestions = questions.length
        const userData = []
        for (const input of inputs) {
            const [qID, optionIndex] = input.id.substring(1).split("_").map((n) => n - 0)
            userData.push([qID, optionIndex])
        }
        const response = await fetch("http://localhost:3000/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        const result = await response.json()

        const score = Math.round(100 * result.countOfRightAnswers / countOfQuestions)
        console.info(score + "%")

        // Score ekranga chiqarish
        let scoreEl = document.getElementById("score");
        if (!scoreEl) {
            scoreEl = document.createElement("div");
            scoreEl.id = "score";
            document.getElementById("app").appendChild(scoreEl);
        }
        scoreEl.innerHTML = `<div class="score-card"><h2>Your Score</h2><p>${score}%</p></div>`;

        result.correctAnswers.forEach(([qID, correctIndex]) => {
            const correctInput = document.getElementById(`q${qID}_${correctIndex}`);
            const correctLabel = document.querySelector(`label[for="q${qID}_${correctIndex}"]`);
            if (correctLabel) correctLabel.classList.add("correct");

            const userAnswer = userData.find(([id]) => id === qID);
            if (userAnswer && userAnswer[1] !== correctIndex) {
                const wrongInput = document.getElementById(`q${qID}_${userAnswer[1]}`);
                const wrongLabel = document.querySelector(`label[for="q${qID}_${userAnswer[1]}"]`);
                if (wrongLabel) wrongLabel.classList.add("wrong");
            }
        });
        not.className = "tot"
        not.style.display = "none"
        contents.forEach((e) => {
            e.classList.add("active")
        })
    } else {
        not.className = "untot"
    }

}

function getQuestion(questions, id) {
    for (const q of questions) {
        if (q.id === id) {
            return q
        }
    }
    return null
}


result.correctAnswers.forEach(([qID, correctIndex]) => {

    const correctLabel = document.querySelector(`label[for="q${qID}_${correctIndex}"]`)
    if (correctLabel) correctLabel.classList.add("correct")

    const userAnswer = userData.find(([id]) => id === qID)
    if (userAnswer && userAnswer[1] !== correctIndex) {
        const wrongLabel = document.querySelector(`label[for="q${qID}_${userAnswer[1]}"]`)
        if (wrongLabel) wrongLabel.classList.add("wrong")
    }
})
