document.addEventListener("DOMContentLoaded", () => {
  const gameField = document.querySelector(".game");

  let elements = [];
  let checkElements = [];

  //создаём игровое поле
  function createBoard() {
    for (let i = 0; i < 16; i++) {
      let element = document.createElement("div");
      element.innerHTML = "";

      gameField.appendChild(element);
      elements.push(element);
    }

    generateNumber();
    generateNumber();
    for (let i = 0; i < 16; i++) {
      checkElements.push(elements[i].innerHTML);
    }
    console.log(checkElements);
    console.log(elements.innerHTML);
  }
  createBoard();

  //добавляем новое значение в рандомное место
  function generateNumber() {
    let numberedElement = Math.floor(Math.random() * elements.length);
    if (Number(elements[numberedElement].innerHTML) === 0) {
      let chance = Math.floor(1 + Math.random() * 10);
      console.log(chance);
      if (chance === 9) {
        elements[numberedElement].innerHTML = 4;
        gameOver();
      } else {
        elements[numberedElement].innerHTML = 2;
        gameOver();
      }
    } else generateNumber();
    color();
  }

  // изменяем цвет секции для каждого числа, чтобы красиво было
  function color() {
    for (let i = 0; i < elements.length; i++) {
      switch (elements[i].innerHTML) {
        case "":
          elements[i].style.backgroundColor = "white";
          break;
        case "2":
          elements[i].style.backgroundColor = "gray";
          break;
        case "4":
          elements[i].style.backgroundColor = "orange";
          break;
        case "8":
          elements[i].style.backgroundColor = "red";
          break;
        case "16":
          elements[i].style.backgroundColor = "#6e3d04";
          break;
        case "32":
          elements[i].style.backgroundColor = "green";
          break;
        case "64":
          elements[i].style.backgroundColor = "purple";
          break;
        case "128":
          elements[i].style.backgroundColor = "#189ec0";
          break;
        case "256":
          elements[i].style.backgroundColor = "#344d6e";
          break;
        case "512":
          elements[i].style.backgroundColor = "#df5555";
          break;
        case "1024":
          elements[i].style.backgroundColor = "#33421f";
          break;
        case "2048":
          elements[i].style.backgroundColor = "#7a7c00";
          break;
      }
    }
  }
  color();

  // свайп вправо
  function goRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          Number(elements[i].innerHTML),
          Number(elements[i + 1].innerHTML),
          Number(elements[i + 2].innerHTML),
          Number(elements[i + 3].innerHTML),
        ];
        let notNulls = row.filter((num) => num);
        let empty = 4 - notNulls.length;
        let nulls = Array(empty).fill("");
        let newRow = nulls.concat(notNulls);

        for (let j = 0; j < 4; j++) {
          elements[i + j].innerHTML = newRow[j];
        }
      }
    }
    color();
  }

  // свайп влево
  function goLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          Number(elements[i].innerHTML),
          Number(elements[i + 1].innerHTML),
          Number(elements[i + 2].innerHTML),
          Number(elements[i + 3].innerHTML),
        ];
        let notNulls = row.filter((num) => num);
        let empty = 4 - notNulls.length;
        let nulls = Array(empty).fill("");
        let newRow = notNulls.concat(nulls);

        for (let j = 0; j < 4; j++) {
          elements[i + j].innerHTML = newRow[j];
        }
      }
    }
    color();
  }

  // свайп вниз
  function goDown() {
    for (let i = 0; i < 4; i++) {
      let column = [
        Number(elements[i].innerHTML),
        Number(elements[i + 4].innerHTML),
        Number(elements[i + 4 * 2].innerHTML),
        Number(elements[i + 4 * 3].innerHTML),
      ];
      let notNulls = column.filter((num) => num);
      let empty = 4 - notNulls.length;
      let nulls = Array(empty).fill("");
      let newColumn = nulls.concat(notNulls);

      for (let j = 0; j < 4; j++) {
        elements[i + 4 * j].innerHTML = newColumn[j];
      }
    }
    color();
  }

  function goUp() {
    for (let i = 0; i < 4; i++) {
      let column = [
        Number(elements[i].innerHTML),
        Number(elements[i + 4].innerHTML),
        Number(elements[i + 4 * 2].innerHTML),
        Number(elements[i + 4 * 3].innerHTML),
      ];
      let notNulls = column.filter((num) => num);
      let empty = 4 - notNulls.length;
      let nulls = Array(empty).fill("");
      let newColumn = notNulls.concat(nulls);

      for (let j = 0; j < 4; j++) {
        elements[i + 4 * j].innerHTML = newColumn[j];
      }
    }
    color();
  }

  //объединяем в рядах при свайпе влево

  function rowPlusLeft() {
    for (let i = 0; i < 15; i++) {
      if (elements[i].innerHTML === elements[i + 1].innerHTML) {
        let so =
          Number(elements[i].innerHTML) + Number(elements[i + 1].innerHTML);
        elements[i + 1].innerHTML = "";
        elements[i].innerHTML = so;
      }
      color();
    }
    win();
  }

  //объединяем в рядах при свайпе вправо

  function rowPlusRight() {
    for (let i = 15; i > 0; i--) {
      if (elements[i].innerHTML === elements[i - 1].innerHTML) {
        let so =
          Number(elements[i].innerHTML) + Number(elements[i - 1].innerHTML);
        elements[i - 1].innerHTML = so;
        elements[i].innerHTML = "";
        win();
        goRight();
      }
      color();
    }
  }

  //объединяем в колонках при свайпе вверх

  function columnPlusUp() {
    for (let i = 0; i < 12; i++) {
      if (elements[i].innerHTML === elements[i + 4].innerHTML) {
        let so =
          Number(elements[i].innerHTML) + Number(elements[i + 4].innerHTML);
        elements[i + 4].innerHTML = so;
        elements[i].innerHTML = "";
      }
      color();
    }
    win();
  }

  //объединяем в колонках при свайпе вниз

  function columnPlusDown() {
    for (let i = 15; i > 3; i--) {
      if (elements[i].innerHTML === elements[i - 4].innerHTML) {
        let so =
          Number(elements[i].innerHTML) + Number(elements[i - 4].innerHTML);
        elements[i - 4].innerHTML = so;
        elements[i].innerHTML = "";
        win();
        goDown();
      }

      color();
    }
  }

  //проверка на изменение результата
  function checkResult() {
    let check = true;
    for (let i = 0; i < 16; i++) {
      if (checkElements[i] != elements[i].innerHTML) {
        check = false;
      }
    }
    if (check === false) {
      generateNumber();
      for (let i = 0; i < 16; i++) {
        checkElements[i] = elements[i].innerHTML;
      }
    }

    console.log(checkElements);
    check = true;
  }

  //проверка на проигрыш

  function gameOver() {
    let rowCheck = false;
    let columnCheck = false;
    let winCheck = false;
    let zeros = 0;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerHTML == 0) {
        zeros++;
      }
      if (elements[i].innerHTML === "2048") {
        winCheck = true;
      }
    }
    if (zeros === 0) {
      for (let i = 0; i < 13; i++) {
        if (i % 4 === 0) {
          for (let j = i; j < i + 2; j++) {
            if (elements[j].innerHTML === elements[j + 1].innerHTML) {
              rowCheck = true;
            }
          }
        }
      }
      for (let i = 0; i < 12; i += 4) {
        for (let j = i; j < i + 2; j++) {
          if (elements[j].innerHTML === elements[j + 4].innerHTML) {
            columnCheck = true;
          }
        }
      }
      if (rowCheck === false && columnCheck === false && winCheck === false) {
        let endScreen = document.querySelector(".end-game");
        endScreen.innerHTML = "<p>You Lose</p>";
        endScreen.style.display = "flex";
        document.addEventListener("keyup", controlKeys);
      }
    }
  }

  function win() {
    for (let i = 0; i < 15; i++) {
      if (elements[i].innerHTML === "2048") {
        let endScreen = document.querySelector(".end-game");
        endScreen.innerHTML = "<p>You Win!</p>";
        endScreen.style.display = "flex";
        document.addEventListener("keyup", controlKeys);
      }
    }
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
        payToLose();
        break;
      case 87:
        payToWin();
        break;
    }
  }
  document.addEventListener("keyup", controlKeys);

  //функции для нажатия на каждую из кнопок стрелок

  function keyRight() {
    goRight();
    rowPlusRight();
    goRight();

    setTimeout(checkResult, 300);
  }

  function keyLeft() {
    goLeft();
    rowPlusLeft();
    goLeft();

    setTimeout(checkResult, 300);
  }

  function keyUp() {
    goUp();
    columnPlusUp();
    goUp();

    setTimeout(checkResult, 300);
  }

  function keyDown() {
    goDown();
    columnPlusDown();
    goDown();

    setTimeout(checkResult, 300);
  }

  function payToLose() {
    elements[0].innerHTML = "4";
    elements[1].innerHTML = "4";
    elements[2].innerHTML = "4";
    elements[3].innerHTML = "2";
    elements[4].innerHTML = "16";
    elements[5].innerHTML = "4";
    elements[6].innerHTML = "2";
    elements[7].innerHTML = "4";
    elements[8].innerHTML = "64";
    elements[9].innerHTML = "2";
    elements[10].innerHTML = "16";
    elements[11].innerHTML = "8";
    elements[12].innerHTML = "16";
    elements[13].innerHTML = "32";
    elements[14].innerHTML = "4";
    elements[15].innerHTML = "128";
    color();
    gameOver();
  }

  function payToWin() {
    elements[0].innerHTML = "4";
    elements[1].innerHTML = "1024";
    elements[2].innerHTML = "4";
    elements[3].innerHTML = "2";
    elements[4].innerHTML = "16";
    elements[5].innerHTML = "1024";
    elements[6].innerHTML = "2";
    elements[7].innerHTML = "4";
    elements[8].innerHTML = "64";
    elements[9].innerHTML = "2";
    elements[10].innerHTML = "16";
    elements[11].innerHTML = "8";
    elements[12].innerHTML = "16";
    elements[13].innerHTML = "32";
    elements[14].innerHTML = "4";
    elements[15].innerHTML = "128";
    color();
    win();
  }
});
