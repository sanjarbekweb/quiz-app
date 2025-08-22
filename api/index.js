import express from 'express';
import cors from "cors"
import bodyParser from 'body-parser';
import fs from "fs";
const FILE = "./data/questions.json";
const right = "./data/rights.json";
const server = express();

server.use(cors())
server.use(bodyParser.json())


const questions = JSON.parse(fs.readFileSync(FILE, "utf-8"));
const rightOptions = JSON.parse(fs.readFileSync(right, "utf-8"));

server.get('/health', (req, res) => {
    res.send(
        { message: "ok" }
    );
});


server.get("/questions", (_, res) => {
    res.send(questions)
})

server.get("/rights", (_, res) => {
    res.send(rightOptions)
})


server.post("/check", (req, res) => {
    let countOfRightAnswers = 0
    const correctAnswers = []

    for (const a of req.body) {
        const optionIndex = rightOptions[a[0]]

        if (optionIndex === a[1]) {
            countOfRightAnswers++
        }

        correctAnswers.push([a[0], optionIndex])
    }

    res.send({
        countOfRightAnswers,
        correctAnswers
    })
})



function getQuestion(questions, id) {
    for (const q of questions) {
        if (q.id === id) {
            return q
        }
    }
    return null
}



function writeQuestions(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}



server.post("/questions", (req, res) => {
    const questions = questions();
    const newQuestion = {
        id: questions.length + 1,
        ...req.body
    };
    questions.push(newQuestion);
    writeQuestions(questions);
    res.send(newQuestion);
});



server.put("/questions/:id", (req, res) => {
    const questions = questions();
    const id = Number(req.params.id);

    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return res.status(404).send({ error: "Not found" });

    questions[index] = { ...questions[index], ...req.body };
    writeQuestions(questions);
    res.send(questions[index]);
});





server.delete("/questions/:id", (req, res) => {
    let questions = questions();
    const id = Number(req.params.id);

    const newQuestions = questions.filter(q => q.id !== id);
    writeQuestions(newQuestions);

    res.send({ message: "Deleted", id });
});




server.listen(3000)