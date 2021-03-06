document.addEventListener("DOMContentLoaded", () => {
  const GAME_FIELD = document.querySelector(".game");
  const REQUIRED_COLOR = {
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

  let elements = [];
  let checkElements = [];
  let score = 0;
  let stepBack = [];
  let stepCount = 0;
  let displayScore = document.querySelector(".score__value");
  displayScore.textContent = score;

  // создаём игровое поле
  function createBoard() {
    for (let i = 0; i < 16; i++) {
      let element = document.createElement("div");
      element.textContent = "";
      changeColor(element);
      GAME_FIELD.appendChild(element);
      elements.push(element);
    }

    generateNumber();
    generateNumber();
    rememberStep();
    console.log(stepBack[--stepCount]);

    elements.forEach((element) => {
      checkElements.push(element.textContent);
    });
  }
  createBoard();

  // добавляем новое значение в рандомное место
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
    element.style.backgroundColor = REQUIRED_COLOR[element.textContent];
  }

  // свайп вправо
  function goRight() {
    for (let i = 0; i < 16; i += 4) {
      getRow(i, true, 1);
    }
  }

  // свайп влево
  function goLeft() {
    for (let i = 0; i < 16; i += 4) {
      getRow(i, false, 1);
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
    newRow.forEach((element, ind) => {
      if (elements[index + axis * ind].textContent != element) {
        elements[index + axis * ind].textContent = element;
        changeColor(elements[index + axis * ind]);
      }
    });
  }

  // объединяем в рядах при свайпе влево
  function rowPlusLeft() {
    for (let i = 0; i < 15; i++) {
      if (
        (i + 1) % 4 != 0 &&
        elements[i].textContent === elements[i + 1].textContent
      ) {
        rowPlus(i, true, 1);
        goLeft();
      }
    }
    rememberStep();
  }

  // объединяем в рядах при свайпе вправо
  function rowPlusRight() {
    for (let i = 15; i > 0; i--) {
      if (
        i % 4 != 0 &&
        elements[i].textContent === elements[i - 1].textContent
      ) {
        rowPlus(i, false, 1);
        goRight();
      }
    }
    rememberStep();
  }

  // объединяем в колонках при свайпе вверх
  function columnPlusUp() {
    for (let i = 0; i < 12; i++) {
      if (elements[i].textContent === elements[i + 4].textContent) {
        rowPlus(i, true, 4);
        goUp();
      }
    }
    rememberStep();
  }

  // объединяем в колонках при свайпе вниз
  function columnPlusDown() {
    for (let i = 15; i > 3; i--) {
      if (elements[i].textContent === elements[i - 4].textContent) {
        rowPlus(i, false, 4);
        goDown();
      }
    }
    rememberStep();
  }
  // объединение в колонках или в рядах
  function rowPlus(index, direction, rows) {
    let firstElement = Number(elements[index].textContent);
    let secondElement;
    let sumResult;
    if (direction) {
      secondElement = Number(elements[index + rows].textContent);
      if (rows === 1) {
        sumResult = firstElement + secondElement;
        elements[index + rows].textContent = "";
        elements[index].textContent = sumResult;
      }
      if (rows === 4) {
        sumResult = firstElement + secondElement;
        elements[index + rows].textContent = sumResult;
        elements[index].textContent = "";
      }
      changeColor(elements[index + rows]);
      changeColor(elements[index]);
    } else {
      secondElement = Number(elements[index - rows].textContent);
      sumResult = firstElement + secondElement;
      elements[index - rows].textContent = sumResult;
      elements[index].textContent = "";
      changeColor(elements[index]);
      changeColor(elements[index - rows]);
    }
    win();
    score += sumResult;
    displayScore.textContent = score;
  }

  // проверка на изменение результата
  function checkResult() {
    let check = true;

    elements.forEach((element, index) => {
      if (checkElements[index] != element.textContent) {
        check = false;
      }
    });

    if (!check) {
      generateNumber();
      elements.forEach((element, index) => {
        checkElements[index] = element.textContent;
      });
    }

    console.log(checkElements);
  }

  // проверка на проигрыш
  function gameOver() {
    let rowCheck = false;
    let columnCheck = false;
    let winCheck = false;
    let zeros = 0;
    elements.forEach((element) => {
      if (!element.textContent) {
        zeros++;
      }
      if (element.textContent === "2048") {
        winCheck = true;
      }
    });

    if (zeros === 0) {
      for (let i = 0; i < 13; i += 4) {
        for (let j = i; j < i + 3; j++) {
          if (elements[j].textContent === elements[j + 1].textContent) {
            rowCheck = true;
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
    elements.forEach((element, index) => {
      element.textContent = stepBack[stepCount - 1][index];
      changeColor(element);
    });
    displayScore.textContent = stepBack[stepCount - 1][16];
    score = Number(stepBack[stepCount - 1][16]);
    stepBack.pop();
    stepCount--;
  }

  // запомнить текущий шаг
  function rememberStep() {
    let step = [];
    elements.forEach((element) => {
      step.push(element.textContent);
    });
    step.push(displayScore.textContent);
    stepBack.push(step);
    stepCount++;
  }

  // реакция на нажатие стрелок
  function controlKeys(e) {
    switch (e.keyCode) {
      case 37:
        goLeft();
        rowPlusLeft();
        break;
      case 38:
        goUp();
        columnPlusUp();
        break;
      case 39:
        goRight();
        rowPlusRight();
        break;
      case 40:
        goDown();
        columnPlusDown();
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
    elements.forEach((element) => {
      changeColor(element);
    });
    gameOver();
  }

  function pressToWin() {
    elements[0].textContent = "1024";
    elements[1].textContent = "1024";
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
    elements.forEach((element) => {
      changeColor(element);
    });
    win();
  }
  document.addEventListener("keyup", controlKeys);
});
