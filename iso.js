const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const hamburger = document.getElementById("hamburger");

function toggleSidebar() {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");

    if (sidebar.classList.contains("active")) {
        hamburger.innerHTML = "<i class='bxr  bx-x'  ></i> ";
    } else {
        hamburger.innerHTML = "<i class='bxr  bx-menu'  ></i> ";
    }
}

function openSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    toggleSidebar(); // close sidebar after selection
}

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

//Theory Section
const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(acc => {
      acc.querySelector(".accordion-header").addEventListener("click", () => {
        // Close all others
        accordions.forEach(other => {
          if (other !== acc) other.classList.remove("active");
        });
        // Toggle clicked one
        acc.classList.toggle("active");
      });
    });

//Quiz section
const quizData = [
  {
    question: "Why we use skimmed milk instead of whole milk for this procedure?",
    options: [
      "To avoid flavor defects",
      "To avoid fat interference",
      "To simplifies protein purification",
      "All of the above"
    ],
    answer: 3
  },
  {
    question: "For casein, the isoelectric point is approximately;",
    options: ["4.3", "4.4", "4.5", "4.6"],
    answer: 3
  },
  {
    question: "What method other than precipitation could isolate protein from the milk solution?",
    options: ["Proteolytic Coagulation", "Simple heat treatment", "Simple filtration", "None of these" ],
    answer: 0
  },
  {
    question: "Casein is a primary protein milk which accounts for approximately________of the total protein content.",
    options: ["70%", "80%", "90%", "95%"],
    answer: 1
  },
  {
    question: "Casein exists in milk as a colloidal suspension of;",
    options: ["Casein micelles", "Casein droplets", "Casein precipitates", "Casein particles"],
    answer: 0
  },
  {
    question: "Whole milk is an oil-in-water emulsion, containing__________amount of fat dispersed as micron-sized globules.",
    options: ["Oil-in-water emulsion", "Water-in-oil emulsion", "Oil in water in oil emulsion", "water in oil in water emulsion"],
    answer: 0
  },
  {
    question: "Bovine milk contains_____types of casein.",
    options: ["1", "2", "3", "4"],
    answer: 3
  },
  {
    question: "What type of protein is casein?",
    options: ["Phosphoprotein", "Sulphur containing", "Amino protein", "Lactoglobulin"],
    answer: 0
  },
  {
    question: "Environmental conditions which affect a protein’s stability during purification;",
    options: ["Temperature", "pH", "Ionic strength", "All of these"],
    answer: 3
  },
  {
    question: "What happens to pH when acid is added to a solution?",
    options: ["Increase pH", "Decrease pH", "Can increase or decrease pH", "No change"],
    answer: 1
  }
];
let quizSubmitted = false;
let currentQuestion = 0;
let userAnswers = [];

const questionBox = document.getElementById("question-box");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const resultBox = document.getElementById("result");
const resetQuizBtn = document.getElementById("reset-quiz");

function loadQuestion(index) {
  const q = quizData[index];
  questionBox.innerHTML = `
    <div class="quiz-question">${index+1}. ${q.question}</div>
    <div class="quiz-options">
      ${q.options.map((opt,i) => `
        <label>
          <input type="radio" name="question${index}" value="${i}" 
          ${userAnswers[index] == i ? "checked" : ""}>
          ${opt}
        </label>
      `).join("")}
    </div>
  `;
  prevBtn.style.display = index === 0 ? "none" : "inline-block";
  nextBtn.style.display = index === quizData.length-1 ? "none" : "inline-block";
  submitBtn.style.display = index === quizData.length-1 ? "inline-block" : "none";

  // Highlight answers if quiz has been submitted
  if (quizSubmitted) {
    const options = document.querySelectorAll(`input[name="question${index}"]`);
    options.forEach(opt => {
      const label = opt.parentElement;
      label.classList.remove("correct", "wrong", "show-correct");
      if (parseInt(opt.value) === q.answer) {
        label.classList.add("show-correct");
      }
      if (opt.checked) {
        if (parseInt(opt.value) === q.answer) {
          label.classList.add("correct");
        } else {
          label.classList.add("wrong");
        }
      }
      opt.disabled = true;
    });
  }
}

function saveAnswer() {
  const selected = document.querySelector(`input[name="question${currentQuestion}"]:checked`);
  if (selected) userAnswers[currentQuestion] = parseInt(selected.value);
}

nextBtn.addEventListener("click", () => {
  saveAnswer();
  currentQuestion++;
  loadQuestion(currentQuestion);
});

prevBtn.addEventListener("click", () => {
  saveAnswer();
  currentQuestion--;
  loadQuestion(currentQuestion);
});

submitBtn.addEventListener("click", () => {
  saveAnswer();
  quizSubmitted = true;
  let score = 0;
  quizData.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });
  resultBox.textContent = `Your Score: ${score} / ${quizData.length}`;
  loadQuestion(currentQuestion); // reload to show highlights for current question
});

resetQuizBtn.addEventListener("click", () => {
  currentQuestion = 0;
  userAnswers = [];
  quizSubmitted = false;
  resultBox.textContent = "";
  loadQuestion(currentQuestion);
});

// Load first question
loadQuestion(currentQuestion);
