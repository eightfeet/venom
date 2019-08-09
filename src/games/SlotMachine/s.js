const $topTextInner = document.getElementById("topTextInner");
const $oldTextEl = $topTextInner.children[0];
const $textEl = $topTextInner.children[1];
const $slotBoard = document.getElementById("slotBoard");
const $slotItems = $slotBoard.querySelectorAll(".board-item");

function randomNum() {
  return Math.floor(Math.random() * 999);
}

function stopMachine(score) {
  let num = ("000" + score).slice(-3);
  let nums = num.toString().split("");
  $slotItems.forEach((slotItem, index) => {
    const numOutWrapEl = slotItem.children[0];
    const numWrapEl = numOutWrapEl.children[0];

    setTimeout(() => {
      let target = nums[index];
      numOutWrapEl.classList.remove("num-out-wrap-slot");
      numWrapEl.classList.add("num-wrap-spin-" + target);
      if (index === 2) {
        changeText("Luck Number:" + num);
      }
    }, 800 * index);
  });
}

function startMachine() {
  $slotItems.forEach((slotItem, index) => {
    const numOutWrapEl = slotItem.children[0];
    const numWrapEl = numOutWrapEl.children[0];
    numWrapEl.className = "num-wrap";
    setTimeout(() => {
      numOutWrapEl.classList.add("num-out-wrap-slot");
    }, 800 * index);
  });
}

let oldText;
function changeText(text) {
  if (oldText) {
    $oldTextEl.innerText = oldText;
  }
  $textEl.innerText = text;
  $topTextInner.classList.add("top-text-inner-animate");
  setTimeout(() => {
    $topTextInner.classList.remove("top-text-inner-animate");
  }, 400);
}

function start() {
  changeText("Goooooood luck");
  startMachine();
  setTimeout(() => {
    stopMachine(randomNum());
  }, 5000);
}

changeText("Press Button Start");
