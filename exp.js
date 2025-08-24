
// DOM elements
const beaker = document.getElementById("beaker");
const labArea = document.querySelector(".lab-area");

const milkJar = document.getElementById("milk");
const waterJar = document.getElementById("water");

const milkStream = document.getElementById("milk-stream");
const waterStream = document.getElementById("water-stream");

const milkFill = document.getElementById("milk-fill");
const waterFill = document.getElementById("water-fill");

const dropper = document.getElementById("dropper");
const drop = document.getElementById("drop");
const precipitate = document.getElementById("precipitate");

let milkAdded = false;
let waterAdded = false;
let pH = 0.0;

// Create pH meter UI
const phMeter = document.createElement("div");
phMeter.className = "ph-meter";
phMeter.textContent = `pH: ${pH.toFixed(1)}`;
labArea.appendChild(phMeter);

// Utility function for overlap check
function isOverlapping(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

// Drag setup
Draggable.create(milkJar, {
  bounds: labArea,
  onDragEnd: function () {
    if (isOverlapping(this.target, beaker)) {
      pourLiquid("milk", this.target);
    } else {
      gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
    }
  }
});

Draggable.create(waterJar, {
  bounds: labArea,
  onDragEnd: function () {
    if (isOverlapping(this.target, beaker)) {
      pourLiquid("water", this.target);
    } else {
      gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
    }
  }
});

// Pouring logic
function pourLiquid(type, jar) {
  let stream = type === "milk" ? milkStream : waterStream;
  let fill = type === "milk" ? milkFill : waterFill;

  stream.style.position = "absolute";
  stream.style.background = type === "milk" ? "#fff" : "#9ee7ff";
  stream.style.width = "8px";
  stream.style.height = "0px";
  stream.style.left = "38%";
  stream.style.top = "300px";
  stream.style.borderRadius = "4px";
  labArea.appendChild(stream);

  // Tilt jar in place
  gsap.to(jar, { rotate: -120, duration: 0.3 });

  // Stream animation
  gsap.fromTo(stream, { height: 0, opacity: 1 }, {
    height: 120,
    duration: 0.5,
    ease: "power1.inOut",
    onComplete: () => gsap.to(stream, { opacity: 0, duration: 0.3 })
  });

  // Fill beaker
  gsap.to(fill, {
    height: "+=50",
    duration: 1,
    delay: 0.3,
    onComplete: () => {
      // Rotate back upright
      gsap.to(jar, {
        rotate: 0,
        duration: 0.3,
        onComplete: () => {
          // Move back home
          gsap.to(jar, { x: 0, y: 0, duration: 0.5 });
          jar.style.pointerEvents = "none"; // disable further drags
          if (type === "milk"){
             pH = 6.6;
             phMeter.textContent = `pH: ${pH.toFixed(1)}`;
             milkAdded = true;
          }
          if (type === "water") waterAdded = true;
        }
      });
    }
  });
}

// Acid drop logic
dropper.addEventListener("click", () => {
  if (!milkAdded || !waterAdded) return; // block until both added

  drop.classList.remove("drop-animate");
  void drop.offsetWidth; // reset animation
  drop.classList.add("drop-animate");

  if (pH > 4.6) {
    pH = Math.max(4.6, pH - 0.2);
    phMeter.textContent = `pH: ${pH.toFixed(1)}`;

    if (Math.abs(pH - 4.6) < 0.05) {
      showPrecipitate();
      dropper.disabled = true;
      dropper.style.opacity= 0;
      dropper.style.cursor = "not-allowed";
      drop.style.display = "none";
    }
  }
});

// Show precipitate
function showPrecipitate() {
  const bubbleInterval = setInterval(createBubble, 0);
   setTimeout(() => {
    clearInterval(bubbleInterval);
  }, 3000);
}

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  const size = Math.random() * 8 + 2; // 2px-10px
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  bubble.style.left = `${Math.random() * 70}px`; // spread inside container
  bubble.style.bottom = '-4px'; 
  
  bubble.style.animationDuration = 'none';

  precipitate.appendChild(bubble);

}

// Reset experiment
document.getElementById("reset-btn").addEventListener("click", () => {
  milkAdded = false;
  waterAdded = false;
  pH = 0.0;
  phMeter.textContent = `pH: ${pH.toFixed(1)}`;
  dropper.disabled = false;
  dropper.style.opacity = "1";
  dropper.style.cursor = "pointer";

  // Reset fills
  milkFill.style.height = "0px";
  waterFill.style.height = "0px";

  // Reset precipitate
  precipitate.style.opacity = "0";

  // Re-enable jars
  milkJar.style.pointerEvents = "auto";
  waterJar.style.pointerEvents = "auto";
});

//Tab switching

//     // Quiz logic
//     const quizForm = document.getElementById("quizForm");
//     const quizResult = document.getElementById("quizResult");
//     const resetBtn = document.getElementById("resetQuiz");

//     const correctAnswers = {
//       q1: "B", // Casein precipitates at pH 4.6
//       q2: "A"  // Isoelectric point = zero net charge
//     };

//     quizForm.addEventListener("submit", function(e) {
//   e.preventDefault();

//   let score = 0;
//   let total = Object.keys(correctAnswers).length;

//   for (let q in correctAnswers) {
//     let options = quizForm[q];
//     let selected = false;

//     // check if user selected any option for this question
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].checked) {
//         selected = true;
//         if (options[i].value === correctAnswers[q]) {
//           score++;
//           options[i].parentElement.style.color = "green"; // correct
//         } else {
//           options[i].parentElement.style.color = "red"; // wrong
//         }
//       } else {
//         options[i].parentElement.style.color = ""; // reset style
//       }
//     }

//     if (!selected) {
//       quizResult.textContent = "⚠️ Please answer all questions before submitting.";
//       quizResult.classList.add("wrong");
//       return; // stop checking further
//     }
//   }

//   // show result only if all answered
//   if (score === total) {
//     quizResult.textContent = `🎉 Excellent! You scored ${score}/${total}`;
//     quizResult.classList.remove("wrong");
//   } else {
//     quizResult.textContent = `You scored ${score}/${total}. Review the theory and try again.`;
//     quizResult.classList.add("wrong");
//   }
// });

//     // Reset quiz
//     resetBtn.addEventListener("click", () => {
//       quizForm.reset(); // clear selections
//       quizResult.textContent = ""; // clear result
//       document.querySelectorAll(".quiz-question label").forEach(l => {
//         l.classList.remove("correct", "wrong");
//         l.style.color = ""; // reset color
//       });
//     });