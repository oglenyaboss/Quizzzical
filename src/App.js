import React from 'react';
import Quiz from "./Quiz";
import axios from "axios";
import {nanoid} from "nanoid";


export default function App(){
    const [questions, setQuestions] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [isChecked, setIsChecked] = React.useState(false)
    const [rightCount, setRightCount] = React.useState(0)


    function removeHtmlTags(input) {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
    }
    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const fetchTriviaData = async () => {
        if (true){
            try {
                const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple'); // Замените URL на необходимый для Trivia API
                if (response.status === 200) {
                    // Получите данные из ответа и установите их в состояние
                    setQuestions(response.data.results.map((question) => {
                        const mergedArray = [...question.incorrect_answers, question.correct_answer];
                        const shuffledArray = shuffleArray(mergedArray.map((answer) => ({
                            answerId: nanoid(),
                            text: removeHtmlTags(answer),
                            isHeld: false
                        })));
                        return {
                            ...question,
                            correct_answer: removeHtmlTags(question.correct_answer),
                            question: removeHtmlTags(question.question),
                            answers: shuffledArray,
                            id: nanoid(),
                        }
                    }));
                } else {
                    console.error('Ошибка при запросе данных');
                }
            } catch (error) {
                console.error('Произошла ошибка при выполнении запроса:', error);
            }
            finally {
                setIsLoaded(true)
            }
        }
    };

    function holdAnswer(id, answerId) {
        // need to change isHeld to true for my answer with answerId and to false for all other answers

        setQuestions(questions.map((question) => {
            if (question.id === id){
                return {
                    ...question,
                    answers: question.answers.map((answer) => {
                        if (answer.answerId === answerId){
                            return {
                                ...answer,
                                isHeld: !answer.isHeld,
                            }
                        }
                        else {
                            return {
                                ...answer,
                                isHeld: false,
                            }
                        }
                    })
                }
            }
            return question
        }))

    }

    //create function to check answers

    function checkAnswers(){
        let correctCount = 0
        setQuestions(questions.map((question) => {
            return{
                ...question,
                answers: question.answers.map((answer) => {
                    if (question.correct_answer === answer.text){
                        const isRight = answer.isHeld
                        isRight && correctCount++
                        return{
                            ...answer,
                            isCorrect: true,
                            isRight: isRight
                        }
                    }

                    else {
                        let isRight
                        answer.isHeld === true ? isRight = false : isRight = undefined
                        return {
                            ...answer,
                            isCorrect: false,
                            isRight: isRight
                        }
                    }
                })
            }
        }))
        setRightCount(correctCount)
        setIsChecked(true)
    }

    const mappedQuestions = isLoaded === true ? questions.map((question) => {
        return <Quiz key={question.id}
                     questionId={question.id}
                     question={question.question}
                     correctanswer={question.correct_answer}
                     answers={question.answers}
                     isHeld={question.answers.isHeld}
                     holdAnswer={holdAnswer}
                     isChecked={isChecked}
        />
    }) : <p>Loading...</p>

    // create function to start new game

    async function newGame(){
        await fetchTriviaData()
        setIsChecked(false)
        setRightCount(0)
    }

    return(
        <div className={"App"}>
            <img className={"blob1"} src={"blob 5.png"} />
            <img className={"blob2"} src={"blob 5 (1).png"} />
            {questions === null ?
                <div className={"start--container"}>
                    <h1 className={"main--header"}>Quizzzical</h1>
                    <h4 className={"description"}>Try yourself out!</h4>
                    <button className={"start--button"} onClick={fetchTriviaData}>Start quiz</button>
                </div>
                :
                (
                    <div className={"main--section"}>
                        <div className={"questions--container"}>
                            {mappedQuestions}
                        </div>
                        {isChecked === false ? <button className={"main--screen--button"} onClick={checkAnswers}>Check answers</button>
                            : (
                                <div className={"main--bottom--section"}>
                                    <div className={"correct--answers"}>{`You scored ${rightCount}/5 correct answers`}</div>
                                    <button className={"main--screen--button"} onClick={newGame}>New Game</button>
                                </div>
                            )
                        }
                    </div>
                )
            }


        </div>
    )
}