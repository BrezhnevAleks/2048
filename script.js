document.addEventListener("DOMContentLoaded", () => {
  const gameField = document.querySelector(".game");

  let elements = [];
  let checkElements = [];
  let score = 0;
  let stepBack = [];
  let stepCount = 0;
  let displayScore = document.querySelector(".score__value");
  displayScore.textContent = score;

  //создаём игровое поле
  function createBoard() {
    for (let i = 0; i < 16; i++) {
      let element = document.createElement("div");
      element.textContent = "";
      changeColor(element);
      gameField.appendChild(element);
      elements.push(element);
    }

    generateNumber();
    generateNumber();
    rememberStep();
    console.log(stepBack[--stepCount]);

    for (let i = 0; i < 16; i++) {
      checkElements.push(elements[i].textContent);
    }
  }
  createBoard();

  //добавляем новое значение в рандомное место
  function generateNumber() {
    let numberedElement = Math.floor(Math.random() * elements.length);
    if (Number(elements[numberedElement].textContent) === 0) {
      let chance = Math.floor(1 + Math.random() * 10);
      elements[numberedElement].textContent = chance === 9 ? 4 : 2;

      changeColor(elements[numberedElement]);
      gameOver();
    } else generateNumber();
  }

  // изменяем цвет секции для каждого числа, чтобы красиво было
  function changeColor(element) {
    let requiredColor = {
      "": "white",
      2: "gray",
      4: "orange",
      8: "red",
      16: "#6e3d04",
      32: "green",
      64: "purple",
      128: "#189ec0",
      256: "#344d6e",
      512: "#df5555",
      1024: "#33421f",
      2048: "#7a7c00",
    };

    {
      element.style.backgroundColor = requiredColor[element.textContent];
    }
  }

  // свайп вправо
  function goRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        getRow(i, true, 1);
      }
    }
  }

  // свайп влево
  function goLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        getRow(i, false, 1);
      }
    }
  }

  // свайп вниз
  function goDown() {
    for (let i = 0; i < 4; i++) {
      getRow(i, true, 4);
    }
  }

  // свайп вверх
  function goUp() {
    for (let i = 0; i < 4; i++) {
      getRow(i, false, 4);
    }
  }

  // получить массив элементов в клонке или в ряду
  function getRow(index, direction, axis) {
    let row = [
      Number(elements[index].textContent),
      Number(elements[index + axis * 1].textContent),
      Number(elements[index + axis * 2].textContent),
      Number(elements[index + axis * 3].textContent),
    ];

    let notNulls = row.filter((num) => num);
    let empty = 4 - notNulls.length;
    let nulls = Array(empty).fill("");
    let newRow = direction ? nulls.concat(notNulls) : notNulls.concat(nulls);

    for (let j = 0; j < 4; j++) {
      if (elements[index + axis * j].textContent != newRow[j]) {
        elements[index + axis * j].textContent = newRow[j];
        changeColor(elements[index + axis * j]);
      }
    }
  }

  //объединяем в рядах при свайпе влево
  function rowPlusLeft() {
    for (let i = 0; i < 15; i++) {
      if (
        (i + 1) % 4 != 0 &&
        elements[i].textContent === elements[i + 1].textContent
      ) {
        let sumResult =
          Number(elements[i].textContent) + Number(elements[i + 1].textContent);
        elements[i + 1].textContent = "";
        changeColor(elements[i + 1]);
        elements[i].textContent = sumResult;
        changeColor(elements[i]);
        score += sumResult;
        displayScore.textContent = score;
        win();
        goLeft();
      }
    }
  }

  //объединяем в рядах при свайпе вправо
  function rowPlusRight() {
    for (let i = 15; i > 0; i--) {
      if (
        i % 4 != 0 &&
        elements[i].textContent === elements[i - 1].textContent
      ) {
        let sumResult =
          Number(elements[i].textContent) + Number(elements[i - 1].textContent);
        elements[i - 1].textContent = sumResult;
        changeColor(elements[i - 1]);
        elements[i].textContent = "";
        changeColor(elements[i]);
        score += sumResult;
        displayScore.textContent = score;
        win();
        goRight();
      }
    }
  }

  //объединяем в колонках при свайпе вверх
  function columnPlusUp() {
    for (let i = 0; i < 12; i++) {
      if (elements[i].textContent === elements[i + 4].textContent) {
        let sumResult =
          Number(elements[i].textContent) + Number(elements[i + 4].textContent);
        elements[i + 4].textContent = sumResult;
        changeColor(elements[i + 4]);
        elements[i].textContent = "";
        changeColor(elements[i]);
        score += sumResult;
        displayScore.textContent = score;
        win();
        goUp();
      }
    }
  }

  //объединяем в колонках при свайпе вниз
  function columnPlusDown() {
    for (let i = 15; i > 3; i--) {
      if (elements[i].textContent === elements[i - 4].textContent) {
        let sumResult =
          Number(elements[i].textContent) + Number(elements[i - 4].textContent);
        elements[i - 4].textContent = sumResult;
        changeColor(elements[i - 4]);
        elements[i].textContent = "";
        changeColor(elements[i]);
        score += sumResult;
        displayScore.textContent = score;
        win();
        goDown();
      }
    }
  }

  //проверка на изменение результата
  function checkResult() {
    let check = true;
    for (let i = 0; i < 16; i++) {
      if (checkElements[i] != elements[i].textContent) {
        check = false;
      }
    }
    if (check === false) {
      generateNumber();
      for (let i = 0; i < 16; i++) {
        checkElements[i] = elements[i].textContent;
      }
    }

    console.log(checkElements);
    rememberStep();
  }

  //проверка на проигрыш
  function gameOver() {
    let rowCheck = false;
    let columnCheck = false;
    let winCheck = false;
    let zeros = 0;
    for (let i = 0; i < elements.length; i++) {
      if (!elements[i].textContent) {
        zeros++;
      }
      if (elements[i].textContent === "2048") {
        winCheck = true;
      }
    }
    if (zeros === 0) {
      for (let i = 0; i < 13; i++) {
        if (i % 4 === 0) {
          for (let j = i; j < i + 3; j++) {
            if (elements[j].textContent === elements[j + 1].textContent) {
              rowCheck = true;
            }
          }
        }
      }
      if (!rowCheck) {
        for (let i = 0; i < 12; i++) {
          if (elements[i].textContent === elements[i + 4].textContent) {
            columnCheck = true;
          }
        }
      }
      if (!rowCheck && !columnCheck && !winCheck) {
        let endScreen = document.querySelector(".end-game");
        endScreen.innerHTML = "<p>You Lose</p>";
        endScreen.style.display = "flex";
        document.removeEventListener("keyup", controlKeys);
      }
    }
  }
  // проверка на победу
  function win() {
    for (let i = 0; i < 15; i++) {
      if (elements[i].textContent === "2048") {
        let endScreen = document.querySelector(".end-game");
        endScreen.innerHTML = "<p>You Win!</p>";
        endScreen.style.display = "flex";
        document.removeEventListener("keyup", controlKeys);
      }
    }
  }

  // шаг назад (кнопка b)
  function goBack() {
    for (let i = 0; i < 16; i++) {
      elements[i].textContent = stepBack[stepCount - 1][i];
      changeColor(elements[i]);
    }
    displayScore.textContent = stepBack[stepCount - 1][16];
    score = Number(stepBack[stepCount - 1][16]);
    stepBack.pop();
    stepCount--;
  }

  //запомнить текущий шаг
  function rememberStep() {
    let step = [];
    for (let i = 0; i < 16; i++) {
      step.push(elements[i].textContent);
    }
    step.push(displayScore.textContent);
    stepBack.push(step);
    stepCount++;
  }

  // реакция на нажатие стрелок
  function controlKeys(e) {
    switch (e.keyCode) {
      case 37:
        keyLeft();
        break;
      case 38:
        keyUp();
        break;
      case 39:
        keyRight();
        break;
      case 40:
        keyDown();
        break;
      case 81:
        pressToLose();
        break;
      case 87:
        pressToWin();
        break;
      case 66:
        goBack();
        break;
    }
  }
  document.addEventListener("keyup", controlKeys);

  //функции для нажатия кнопки стрелок

  // вправо
  function keyRight() {
    goRight();
    rowPlusRight();
    setTimeout(checkResult, 300);
  }

  // влево
  function keyLeft() {
    goLeft();
    rowPlusLeft();
    setTimeout(checkResult, 300);
  }

  // вверх
  function keyUp() {
    goUp();
    columnPlusUp();
    setTimeout(checkResult, 300);
  }

  // вниз
  function keyDown() {
    goDown();
    columnPlusDown();
    setTimeout(checkResult, 300);
  }

  function pressToLose() {
    elements[0].textContent = "4";
    elements[1].textContent = "4";
    elements[2].textContent = "4";
    elements[3].textContent = "2";
    elements[4].textContent = "16";
    elements[5].textContent = "4";
    elements[6].textContent = "2";
    elements[7].textContent = "4";
    elements[8].textContent = "64";
    elements[9].textContent = "2";
    elements[10].textContent = "16";
    elements[11].textContent = "8";
    elements[12].textContent = "16";
    elements[13].textContent = "32";
    elements[14].textContent = "4";
    elements[15].textContent = "128";
    changeColor();
    gameOver();
  }

  function pressToWin() {
    elements[0].textContent = "4";
    elements[1].textContent = "4";
    elements[2].textContent = "16";
    elements[3].textContent = "2";
    elements[4].textContent = "16";
    elements[5].textContent = "128";
    elements[6].textContent = "2";
    elements[7].textContent = "4";
    elements[8].textContent = "4";
    elements[9].textContent = "8";
    elements[10].textContent = "16";
    elements[11].textContent = "2";
    elements[12].textContent = "128";
    elements[13].textContent = "16";
    elements[14].textContent = "4";
    elements[15].textContent = "2";
    changeColor();
    win();
  }
});
