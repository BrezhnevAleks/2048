document.addEventListener("DOMContentLoaded", () => {
  const gameField = document.querySelector(".game");

  let elements = [];

  //создаём игровое поле
  function createBoard() {
    for (let i = 0; i < 16; i++) {
      let element = document.createElement("div");
      element.innerHTML = 0;
      gameField.appendChild(element);
      elements.push(element);
    }
    generateNumber();
    generateNumber();
  }
  createBoard();

  //добавляем новое значение в рандомное место
  function generateNumber() {
    let numberedElement = Math.floor(Math.random() * elements.length);
    if (elements[numberedElement].innerHTML == 0) {
      elements[numberedElement].innerHTML = 2;
    } else generateNumber();
  }

  // изменяем цвет секции для каждого числа, чтобы красиво было
  function color() {
    for (let i = 0; i < elements.length; i++) {
      switch (elements[i].innerHTML) {
        case "0":
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
          parseInt(elements[i].innerHTML),
          parseInt(elements[i + 1].innerHTML),
          parseInt(elements[i + 2].innerHTML),
          parseInt(elements[i + 3].innerHTML),
        ];
        let notNulls = row.filter((num) => num);
        let empty = 4 - notNulls.length;
        let nulls = Array(empty).fill(0);
        let newRow = nulls.concat(notNulls);
        console.log(newRow);
        for (let j = 0; j < 4; j++) {
          elements[i + j].innerHTML = newRow[j];
        }
      }
    }
    color();
  }
});
