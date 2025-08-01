// exp.js

let pH = 7.0;
let hasMilk = false;
let hasWater = false;
let dropperFilled = false;

const beaker = document.getElementById("beaker");
const milk = document.getElementById("milk");
const water = document.getElementById("water");
const dropper = document.getElementById("dropper");
const acid = document.getElementById("acid");
const milkInBeaker = document.getElementById("milkInBeaker");
const waterInBeaker = document.getElementById("waterInBeaker");
const precipitate = document.getElementById("precipitate");

function isOverlapping(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function showLiquid(element) {
  gsap.to(element, { opacity: 1, duration: 0.5 });
}

function addDropperBehavior() {
  Draggable.create(dropper, {
    bounds: "body",
    onDragEnd: function () {
      if (!dropperFilled && isOverlapping(this.target, acid)) {
        dropperFilled = true;
        gsap.to(this.target, { y: "-=20", duration: 0.3, yoyo: true, repeat: 1 });
      }
      if (dropperFilled && isOverlapping(this.target, beaker)) {
        pH -= 0.5;
        dropperFilled = false;
        console.log("pH:", pH.toFixed(1));
        if (pH <= 4.6) {
          showLiquid(precipitate);
        }
      }
    },
  });
}

Draggable.create(milk, {
  bounds: "body",
  onDragEnd: function () {
    if (isOverlapping(this.target, beaker)) {
      hasMilk = true;
      showLiquid(milkInBeaker);
    }
  },
});

Draggable.create(water, {
  bounds: "body",
  onDragEnd: function () {
    if (isOverlapping(this.target, beaker)) {
      hasWater = true;
      showLiquid(waterInBeaker);
    }
  },
});

addDropperBehavior();
