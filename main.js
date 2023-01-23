//
let body = document.querySelector('body');
let questionObj = {};
let questBool = false;
let scoreNum = 0;
let reAnswer = false;

let readJeopardyData = async () => {
    let rawData = await fetch('jeopardy.json');
    let data = await rawData.json();
    let valueData = _.groupBy(data, 'value');
    let createHeader = () => {
        let header = document.createElement('h1');
        header.innerText = 'Jeopardy!'
        header.classList.add('header');
        body.appendChild(header);
        let score = document.createElement('h3');
        score.innerText = 'Score: $0';
        body.appendChild(score);
        score.classList.add('header');
        return score;
    };
    let score = createHeader();
    let createGrid = () => {
        let container = document.createElement('div');
        container.classList.add('container');
        body.appendChild(container);
        let names = ['$100','$200','$400','$600','$800'];
        for(let i = 0; i < 5; i++){
            let row = document.createElement('div');
            row.classList.add('row');
            for(let j = 0; j < 5; j++){
                let column = document.createElement('div');
                column.classList.add('col');
                column.innerText = names[i];
                row.appendChild(column);
            }
            container.appendChild(row);
        }
    };
    createGrid();
    let question = document.createElement('h5');
    question.classList.add('question');
    body.appendChild(question);
    let eventListeners = (row, value) => {
        let columns = row.querySelectorAll('.col');
        let getQuestion = (arr) => {
            let randomQuestion = arr[Math.floor(Math.random() * arr.length)];
            questionObj = randomQuestion;
            question.innerText = randomQuestion.question;
        }
        for(let i = 0; i < columns.length; i++){
            columns[i].addEventListener('click', (event) => {
                reAnswer = false;
                if(!questBool){
                    columns[i].style.background = 'gray';
                    if(event.target.classList[1] === 'cantClick'){
                    }else{
                        questBool = true;
                        if(value === 100){
                            getQuestion(valueData.$100);
                        }else if(value === 200){
                            getQuestion(valueData.$200);
                        }else if(value === 400){
                            getQuestion(valueData.$400);
                        }else if(value === 600){
                            getQuestion(valueData.$600);
                        }else if(value === 800){
                            getQuestion(valueData.$800);
                        }
                        event.target.classList.add('cantClick');
                    }
                }
            });
        }
    }
    let rows = document.querySelectorAll('.row');
    eventListeners(rows[0], 100);
    let num = 200;
    for(let i = 1; i < rows.length; i++){
        eventListeners(rows[i], num);
        num += 200;
    }
    let createInput = () => {
        let inputDiv = document.createElement('div');
        inputDiv.classList.add('input-group');
        body.appendChild(inputDiv);
        let inputSpan = document.createElement('span');
        inputSpan.classList.add('input-group-text')
        inputSpan.innerText = 'Answer';
        inputDiv.appendChild(inputSpan);
        let input = document.createElement('input');
        inputDiv.appendChild(input);
        let inputButton = document.createElement('button');
        inputButton.classList.add('btn');
        inputButton.classList.add('btn-outline-secondary');
        inputButton.innerText = 'Submit';
        inputDiv.appendChild(inputButton);
        inputButton.addEventListener('click', () => {
            if(!reAnswer){
                if(input.value.toLowerCase() === questionObj.answer.toLowerCase()){
                    question.innerText = 'Correct!';
                    scoreNum += Number(questionObj.value.substring(1));
                    score.innerText = '$' + scoreNum;
                }else{
                    question.innerText = 'Incorrect! The correct answer was ' + questionObj.answer;
                }
            }
            questBool = false;
            input.value = '';
            reAnswer = true;
        })
    }
    createInput();
};
readJeopardyData();
