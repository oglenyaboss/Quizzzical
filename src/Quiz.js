import React from 'react';
export default function Quiz(props) {

    const answers = props.answers.map((answer) => {
        return (
            <button
                key={answer.id}
                onClick={() => props.holdAnswer(props.questionId, answer.answerId)} // Вызывается функция onAnswerClick с id при клике
                className={answer.isHeld ? "answer answer--held" : "answer"}
            >
                {answer.text}
            </button>
        )
    });

    const checkedAnswers = props.answers.map((answer) => {
        let className;
        if (answer.isHeld) {
            className = answer.isRight ? 'answer answer--right' : 'answer answer--wrong';
        } else {
            className = 'answer answer--inactive';
        }

        if (answer.isRight === false && answer.isHeld === false) {
            className = 'answer answer--right';
        }
        return (
            <button
                key={answer.id}
                onClick={() => props.holdAnswer(props.questionId, answer.answerId)} // Вызывается функция onAnswerClick с id при клике
                className={className}
            >
                {answer.text}
            </button>
        )
    })

    return (
        <div className={"quiz"}>
            <h3 className={"question"}>{props.question}</h3>
            <div className={"answers--container"}>
                {props.isChecked ? checkedAnswers : answers}
            </div>
        </div>
    );
}
