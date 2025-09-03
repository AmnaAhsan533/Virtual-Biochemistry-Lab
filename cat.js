gsap.from("#ins_area", {
  y: 10,
  duration: 0.5,
  delay: 0.2,
  top: 0
});

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

const beaker = document.getElementById("beaker");
const labArea = document.querySelector(".lab-area");
const milkJar = document.getElementById("milk");
const waterJar = document.getElementById("water");
const milkStream = document.getElementById("milk-stream");
const waterStream = document.getElementById("water-stream");
const milkFill = document.getElementById("milk-fill");
const waterFill = document.getElementById("water-fill");
const precipitateSurface = document.getElementById("precipitate-surface");
const precipitateContainer = document.getElementById("precipitate-container");

let milkAdded = false;
let waterAdded = false;
let reactionStarted = false;

// Utility function for overlap check
function isOverlapping(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

// Drag setup for hydrogen peroxide (milk jar)
Draggable.create(milkJar, {
  bounds: labArea,
  onDragEnd: function () {
    if (isOverlapping(this.target, beaker) && !milkAdded) {
      pourLiquid("milk", this.target);
    } else {
      gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
    }
  }
});

// Drag setup for spinach paste (water jar)
Draggable.create(waterJar, {
  bounds: labArea,
  onDragEnd: function () {
    if (isOverlapping(this.target, beaker) && !waterAdded) {
      pourLiquid("water", this.target);
    } else {
      gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
    }
  }
});

// Improved pouring logic with precise positioning
function pourLiquid(type, jar) {
  let stream = type === "milk" ? milkStream : waterStream;
  let fill = type === "milk" ? milkFill : waterFill;

  // Create and position stream properly - EXACT CENTER OF CYLINDER
  stream.style.position = "absolute";
  stream.style.background = type === "milk" ? "#ffffff" : "#15803d"; // White for H2O2, Dark green for spinach
  stream.style.width = "6px";
  stream.style.height = "0px";
  stream.style.borderRadius = "3px";
  stream.style.opacity = "0.9";
  stream.style.zIndex = "5";
  stream.style.boxShadow = type === "milk" ? "0 0 4px rgba(255,255,255,0.5)" : "0 0 4px rgba(21,128,61,0.5)";
  
  // PRECISE CENTER POSITIONING - calculated from beaker center
  const beakerRect = beaker.getBoundingClientRect();
  const labRect = labArea.getBoundingClientRect();
  const centerX = (beakerRect.left - labRect.left) + (beakerRect.width * 0.575); // Exact center of cylinder opening
  
  stream.style.left = centerX + "px";
  stream.style.top = type === "milk" ? "200px" : "300px";
  
  labArea.appendChild(stream);

  // Tilt jar to point toward cylinder - corrected angles
  let tiltAngle;
  if (type === "milk") {
    // Hydrogen peroxide: tilt right to point toward cylinder
    tiltAngle = 45;
  } else {
    // Spinach paste: tilt left to point toward cylinder  
    tiltAngle = -45;
  }
  
  gsap.to(jar, { 
    rotate: tiltAngle, 
    duration: 0.3,
    ease: "power2.out"
  });

  // Stream animation - falls into cylinder center
  gsap.fromTo(stream, 
    { height: 0, opacity: 0.9 }, 
    {
      height: type === "milk" ? 180 : 120,
      duration: 1.2,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to(stream, { 
          opacity: 0, 
          duration: 0.4,
          onComplete: () => stream.remove()
        });
      }
    }
  );

  // Fill cylinder with liquid - MASSIVE VOLUME INCREASE
  const fillHeight = 80; // Increased base fill
  gsap.to(fill, {
    height: `+=${fillHeight}`,
    duration: 1.5,
    delay: 0.5,
    ease: "power2.out",
    onComplete: () => {
      // Change the solution color to dark green when both are mixed
      if (milkAdded && waterAdded) {
        // Make the solution dark green (mix of H2O2 and spinach)
        milkFill.style.background = "#15803d";  // Dark green
        milkFill.style.opacity = "0.9";
        waterFill.style.background = "#15803d"; // Dark green
        waterFill.style.opacity = "0.9";
      } else if (type === "water") {
        // Spinach paste is dark green
        waterFill.style.background = "#15803d"; // Dark green
        waterFill.style.opacity = "0.9";
      }
      
      // Rotate jar back to upright position
      gsap.to(jar, {
        rotate: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          // Move jar back to original position
          gsap.to(jar, { 
            x: 0, 
            y: 0, 
            duration: 0.6,
            ease: "power2.out"
          });
          
          // Disable further dragging of this jar
          jar.style.pointerEvents = "none";
          jar.style.opacity = "0.6";
          
          // Mark as added and check if reaction should start
          if (type === "milk") {
            milkAdded = true;
          } else {
            waterAdded = true;
          }
          
          // Start reaction when both liquids are added
          if (milkAdded && waterAdded && !reactionStarted) {
            startCatalaseReaction();
          }
        }
      });
    }
  });
}

// Start the catalase reaction (bubble formation and volume increase)
function startCatalaseReaction() {
  reactionStarted = true;
  
  // Show instruction update
  const instructionArea = document.querySelector('.ins-area ul');
  const reactionNote = document.createElement('li');
  reactionNote.innerHTML = '<strong style="color: #15803d;">Reaction started!</strong> Observe extensive bubble formation and volume increase.';
  reactionNote.style.color = '#15803d';
  instructionArea.appendChild(reactionNote);
  
  // Start bubble formation after a short delay
  setTimeout(() => {
    createBubbles();
    createMassivePrecipitates(); // Enhanced precipitate formation
    // MASSIVE volume increase due to gas formation
    increaseVolume();
  }, 1000);
}

// Create continuous bubble formation - MANY MORE BUBBLES
function createBubbles() {
  const bubbleContainer = document.createElement('div');
  bubbleContainer.id = 'bubble-container';
  bubbleContainer.style.position = 'absolute';
  bubbleContainer.style.bottom = '200px';
  
  // Calculate exact center position based on beaker
  const beakerRect = beaker.getBoundingClientRect();
  const labRect = labArea.getBoundingClientRect();
  const centerX = (beakerRect.left - labRect.left) + (beakerRect.width * 0.5);
  
  bubbleContainer.style.left = centerX - 30 + 'px'; // Center the bubble container
  bubbleContainer.style.width = '60px';
  bubbleContainer.style.height = '200px';
  bubbleContainer.style.pointerEvents = 'none';
  bubbleContainer.style.zIndex = '10';
  labArea.appendChild(bubbleContainer);
  
  let bubbleCount = 0;
  const maxBubbles = 60; // MANY MORE bubbles for dramatic effect
  
  const bubbleInterval = setInterval(() => {
    if (bubbleCount >= maxBubbles) {
      clearInterval(bubbleInterval);
      return;
    }
    
    createSingleBubble(bubbleContainer);
    bubbleCount++;
  }, 80); // Faster bubble creation
  
  // Continue creating bubbles continuously
  setTimeout(() => {
    const slowBubbleInterval = setInterval(() => {
      createSingleBubble(bubbleContainer);
    }, 200);
    
    // Stop after 60 seconds
    setTimeout(() => {
      clearInterval(slowBubbleInterval);
    }, 60000);
  }, 4000);
}

// Create individual bubble - DARK GREEN BUBBLES
function createSingleBubble(container) {
  const bubble = document.createElement('div');
  bubble.style.position = 'absolute';
  bubble.style.borderRadius = '50%';
  bubble.style.background = 'rgba(21, 128, 61, 0.8)'; // Dark green bubbles
  bubble.style.border = '1px solid rgba(21, 128, 61, 0.6)';
  bubble.style.pointerEvents = 'none';
  
  // Random bubble size
  const size = Math.random() * 10 + 3;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  // Random horizontal position within container - stay inside cylinder
  bubble.style.left = `${Math.random() * 40 + 10}px`;
  bubble.style.bottom = '0px';
  
  container.appendChild(bubble);
  
  // Animate bubble rising - minimal horizontal movement
  gsap.to(bubble, {
    y: -150 - Math.random() * 50,
    x: (Math.random() - 0.5) * 8, // Very limited horizontal movement
    opacity: 0,
    duration: 3 + Math.random() * 2,
    ease: "power1.out",
    onComplete: () => bubble.remove()
  });
}

// MASSIVE precipitate formation - Enhanced version
function createMassivePrecipitates() {
  // Create different types of precipitates
  createSurfacePrecipitates();
  createFloatingParticles(); 
  createFoamLayer();
  createDensePrecipitateLayer();
}

// Create surface precipitates/bubbles across entire surface - MORE INTENSE
function createSurfacePrecipitates() {
  const surface = precipitateSurface;
  
  // Create MANY MORE precipitates across the surface
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createSurfacePrecipitate(surface);
    }, i * 100);
  }
  
  // Continue adding surface precipitates more frequently
  const surfaceInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) { // Create 3 at once
      createSurfacePrecipitate(surface);
    }
  }, 300);
  
  setTimeout(() => {
    clearInterval(surfaceInterval);
  }, 45000);
}

// Create individual surface precipitate - ENHANCED
function createSurfacePrecipitate(surface) {
  const precipitate = document.createElement('div');
  precipitate.className = 'surface-bubble';
  
  // Random size - bigger range
  const size = Math.random() * 8 + 2;
  precipitate.style.width = `${size}px`;
  precipitate.style.height = `${size}px`;
  
  // Random position across entire surface width
  precipitate.style.left = `${Math.random() * 90}%`;
  precipitate.style.bottom = '0px';
  precipitate.style.background = `rgba(21, 128, 61, ${0.7 + Math.random() * 0.3})`;
  
  surface.appendChild(precipitate);
  
  // Remove after animation completes
  setTimeout(() => {
    if (precipitate.parentNode) {
      precipitate.remove();
    }
  }, 6000);
}

// NEW: Create floating particles throughout the solution
function createFloatingParticles() {
  const container = precipitateContainer;
  
  // Create many floating particles
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      createFloatingParticle(container);
    }, i * 150);
  }
  
  // Continue creating floating particles
  const particleInterval = setInterval(() => {
    for (let i = 0; i < 2; i++) {
      createFloatingParticle(container);
    }
  }, 400);
  
  setTimeout(() => {
    clearInterval(particleInterval);
  }, 50000);
}

// Create individual floating particle
function createFloatingParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'surface-precipitate';
  
  // Random shapes and sizes
  const isRound = Math.random() > 0.5;
  const size = Math.random() * 4 + 1;
  
  if (isRound) {
    particle.style.borderRadius = '50%';
  } else {
    particle.style.borderRadius = '1px';
  }
  
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 85 + 5}%`;
  particle.style.bottom = `${Math.random() * 100 + 20}px`;
  particle.style.background = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`;
  particle.style.border = '1px solid rgba(255, 255, 255, 0.3)';
  
  container.appendChild(particle);
  
  // Animate floating movement
  gsap.to(particle, {
    y: Math.random() * 20 - 10,
    x: Math.random() * 10 - 5,
    rotation: Math.random() * 360,
    duration: 3 + Math.random() * 2,
    repeat: 3,
    yoyo: true,
    ease: "power1.inOut",
    onComplete: () => {
      if (particle.parentNode) {
        particle.remove();
      }
    }
  });
  
  // Remove after extended time
  setTimeout(() => {
    if (particle.parentNode) {
      particle.remove();
    }
  }, 15000);
}

// NEW: Create foam layer at the top
function createFoamLayer() {
  const container = precipitateContainer;
  
  // Create foam patches
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      createFoamPatch(container);
    }, i * 200);
  }
}

// Create individual foam patch
function createFoamPatch(container) {
  const foam = document.createElement('div');
  foam.className = 'foam-layer';
  
  // Irregular foam shapes
  const width = Math.random() * 12 + 4;
  const height = Math.random() * 6 + 2;
  
  foam.style.width = `${width}px`;
  foam.style.height = `${height}px`;
  foam.style.left = `${Math.random() * 80 + 5}%`;
  foam.style.bottom = `${Math.random() * 30 + 80}px`; // Near the top
  foam.style.borderRadius = `${Math.random() * 5 + 2}px`;
  foam.style.background = `rgba(240, 253, 244, ${0.5 + Math.random() * 0.4})`;
  
  container.appendChild(foam);
  
  // Remove after animation
  setTimeout(() => {
    if (foam.parentNode) {
      foam.remove();
    }
  }, 8000);
}

// NEW: Create dense precipitate layer
function createDensePrecipitateLayer() {
  const container = precipitateContainer;
  
  // Create dense layer of small precipitates
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      createDenseParticle(container);
    }, i * 100);
  }
}

// Create dense particles
function createDenseParticle(container) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.borderRadius = '50%';
  particle.style.background = `rgba(34, 197, 94, ${0.3 + Math.random() * 0.4})`;
  particle.style.border = '0.5px solid rgba(34, 197, 94, 0.2)';
  particle.style.pointerEvents = 'none';
  
  // Very small particles
  const size = Math.random() * 2 + 0.5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 90 + 2}%`;
  particle.style.bottom = `${Math.random() * 120 + 10}px`;
  
  container.appendChild(particle);
  
  // Subtle movement
  gsap.to(particle, {
    y: Math.random() * 6 - 3,
    x: Math.random() * 4 - 2,
    duration: 4 + Math.random() * 3,
    repeat: 2,
    yoyo: true,
    ease: "power1.inOut"
  });
  
  // Remove after time
  setTimeout(() => {
    if (particle.parentNode) {
      particle.remove();
    }
  }, 12000);
}

// MASSIVE volume increase due to gas formation
function increaseVolume() {
  // DRAMATIC height increase to show 20ml to 150ml+ volume increase
  gsap.to(milkFill, {
    height: "+=120", // MASSIVE increase
    duration: 5,
    ease: "power2.out"
  });
  
  gsap.to(waterFill, {
    height: "+=120", // MASSIVE increase  
    duration: 5,
    ease: "power2.out"
  });
  
  // Also increase the precipitate surface height
  gsap.to(precipitateSurface, {
    height: "+=120",
    duration: 5,
    ease: "power2.out"
  });
  
  gsap.to(precipitateContainer, {
    height: "+=120",
    duration: 5,
    ease: "power2.out"
  });
  
  // Add volume measurement indication
  setTimeout(() => {
    const volumeIndicator = document.createElement('div');
    volumeIndicator.innerHTML = '<strong>MASSIVE Volume Increase Due to O₂ Gas!</strong><br>Initial: 20ml → Final: ~100ml<br><small>Oxygen gas bubbles cause 5x volume increase</small>';
    volumeIndicator.style.position = 'absolute';
    volumeIndicator.style.top = '50px';
    volumeIndicator.style.right = '20px';
    volumeIndicator.style.background = 'rgba(21, 128, 61, 0.15)';
    volumeIndicator.style.color = '#15803d';
    volumeIndicator.style.padding = '15px';
    volumeIndicator.style.borderRadius = '12px';
    volumeIndicator.style.border = '2px solid #15803d';
    volumeIndicator.style.fontSize = '13px';
    volumeIndicator.style.textAlign = 'center';
    volumeIndicator.style.fontWeight = 'bold';
    volumeIndicator.style.boxShadow = '0 4px 15px rgba(21, 128, 61, 0.3)';
    labArea.appendChild(volumeIndicator);
    
    // Fade in the indicator
    gsap.fromTo(volumeIndicator, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 0.6 }
    );
  }, 3000);
}


// Reset functionality
function resetExperiment() {
  // Reset all variables
  milkAdded = false;
  waterAdded = false;
  reactionStarted = false;
  
  // Reset liquid fills with animation
  gsap.to([milkFill, waterFill], { 
    height: 0, 
    duration: 0.5,
    ease: "power2.out"
  });
  
  gsap.to([precipitateSurface, precipitateContainer], { 
    height: 0, 
    duration: 0.5,
    ease: "power2.out"
  });
  
  // Reset fill colors back to original
  setTimeout(() => {
    milkFill.style.background = "#15803d";
    milkFill.style.opacity = "0.9";
    waterFill.style.background = "#15803d";
    waterFill.style.opacity = "0.9";
  }, 100);
  
  // Re-enable jars with animation
  gsap.to([milkJar, waterJar], {
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
      milkJar.style.pointerEvents = "auto";
      waterJar.style.pointerEvents = "auto";
    }
  });
  
  // Reset jar positions and rotations
  gsap.to(milkJar, { x: 0, y: 0, rotation: 0, duration: 0.5 });
  gsap.to(waterJar, { x: 0, y: 0, rotation: 0, duration: 0.5 });
  
  // Remove any created elements
  const bubbleContainer = document.getElementById('bubble-container');
  if (bubbleContainer) bubbleContainer.remove();
  
  const volumeIndicator = labArea.querySelector('div');
  if (volumeIndicator && volumeIndicator.innerHTML.includes('MASSIVE Volume')) {
    volumeIndicator.remove();
  }
  
  // Clear surface precipitates
  if (precipitateSurface) precipitateSurface.innerHTML = '';
  if (precipitateContainer) precipitateContainer.innerHTML = '';
  
  // Reset instructions
  const instructionArea = document.querySelector('.ins-area ul');
  if (instructionArea) {
    const reactionNote = instructionArea.querySelector('li[style*="color: #15803d"]');
    if (reactionNote) reactionNote.remove();
  }
  
  // Clear any remaining streams or visual effects
  const existingStreams = labArea.querySelectorAll('[id$="-stream"]');
  existingStreams.forEach(stream => stream.remove());
  
  // Clear any intervals that might be running
  const highestId = setTimeout(() => {}, 1);
  for (let i = 0; i < highestId; i++) {
    clearTimeout(i);
    clearInterval(i);
  }
}

// Add event listener for reset button
document.addEventListener('DOMContentLoaded', () => {
  const resetButton = document.getElementById('reset-btn');
  if (resetButton) {
    resetButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetExperiment();
    });
  }
});

// Also add backup event listener for the class selector
document.addEventListener('DOMContentLoaded', () => {
  const resetButtons = document.querySelectorAll('.reset');
  resetButtons.forEach(button => {
    // Remove any existing onclick
    button.removeAttribute('onclick');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetExperiment();
    });
  });
});
// Add visual feedback for dragging
document.addEventListener('DOMContentLoaded', () => {
  [milkJar, waterJar].forEach(jar => {
    jar.addEventListener('mouseenter', () => {
      if (jar.style.pointerEvents !== 'none') {
        gsap.to(jar, { scale: 1.05, duration: 0.3 });
      }
    });
    
    jar.addEventListener('mouseleave', () => {
      if (jar.style.pointerEvents !== 'none') {
        gsap.to(jar, { scale: 1, duration: 0.3 });
      }
    });
  });
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
    question: "Which of the following best describes catalase?",
    options: [
      "An enzyme that helps to break harmful substances in your body.",
      "A chemical compound that destroys harmful substance in your body",
      "A substrate that destroys harmful substance in your body",
      "A molecule that destroys harmful substance within your body"
    ],
    answer: 0
  },
  {
    question: " Two hydrogen peroxide molecules are converted into how many water molecules?",
    options: ["One", "Two", "Three", "Four"],
    answer: 1
  },
  {
    question: " Catalase converts hydrogen peroxide into:",
    options: ["Carbon Dioxide and Water", "Hydrogen and oxygen gas", "Water and Oxygen", "Water and Carbon Dioxide" ],
    answer: 2
  },
  {
    question: " In higher plants, catalase is found in;",
    options: ["Peroxisomes", "Mitochondria", "Chloroplast", "All of these"],
    answer: 3
  },
  {
    question: "Catalase is classified as … enzyme.",
    options: ["Hydrolase", "Oxideroductase", "Transferase", "Ligase"],
    answer: 1
  },
  {
    question: " Which of the following types of a molecule is catalase?",
    options: ["RNA", "DNA", "Protien", "Carbohydrate"],
    answer: 2
  },
  {
    question: "The prosthetic group of catalase is a;.",
    options: ["Heamtin", "Zinc", "FAD", "Biotin"],
    answer: 0
  },
  {
    question: "The prosthetic group of catalase is a;",
    options: ["Lipase", "Amalse", "Tyrosinase", "Catalse"],
    answer: 3
  },
  {
    question: "Which of the following method can be used to determine catalase activity?",
    options: ["UV-spectrophotometry", "Oxygen evolution methods", "Colorimtric assay", "All of these"],
    answer: 3
  },
  {
    question: "Which of the following is a direct consequence of catalase deficiency in plants?",
    options: [" Increased the production of chlorophyll", "Accumulation of reactive oxygen species, such as hydrogen peroxide", "Improved water absorption by roots", "Stimulation of root growth"],
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
