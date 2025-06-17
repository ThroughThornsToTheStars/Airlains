let length = document.getElementsByName("length")[0];
let width = document.getElementsByName("width")[0];
let height = document.getElementsByName("height")[0];
let weight  = document.getElementsByName("weight")[0];
let path = document.getElementsByName("path");
let form = document.getElementById("form");

let submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener('click', function(){

    let isFilled = 
    length.value.trim() !== "" &&
    width.value.trim() !== "" &&
    height.value.trim() !== "" &&
    weight.value.trim() !== "" &&
    Array.from(path).some(radio => radio.checked);

    if(isFilled){
    //Чек бд, пока заглушка
    submitBtn.remove();

    let answer = document.createElement("p");
    answer.classList.add("answer")
    answer.textContent = "Решение";
    form.appendChild(answer);

    let check = document.createElement("p");
    check.classList.add("check")
    check.textContent = "❌";
    form.appendChild(check);

    let result = document.createElement("button");
    result.classList.add("result")
    result.textContent = "Техническую возможность не подтверждаю";
    result.disabled;
    form.appendChild(result);
}})
