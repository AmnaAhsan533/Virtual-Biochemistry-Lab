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
// ALL CONSTANT VARIABLES
const pipette98 = document.getElementById("pipette98");
const microtube = document.getElementById("microtube");
const pbsTube = document.getElementById("pbs-tube");
const milkTube = document.getElementById("milk-tube");
const blankCuvette = document.getElementById("blank");
const pipette201 = document.getElementById("pipette20.1");
const pipette202 = document.getElementById("pipette20.2");
const sampleCuvette = document.getElementById("sample");
const pipette1 = document.getElementById("pipette1");
const specteophotometer = document.getElementById("spectrophotometer");
const pipette2 = document.getElementById('pipette2');
//bradford count
let bradfordFilledCount = 0;
//ALL STATES
let pipette201State = "empty";
let pipette202State = "empty";
let pipette2State = "empty";
let sampleCuvetteState = "empty";
let blankCuvetteState = "empty";
let pipette98State = "empty"; // empty, pbs, milk
let microtubeState = "empty"; // empty, pbs, pbs+milk
let pipette1State = "empty";
let spectrophotometerState = "empty";


// ---------------- Reset Function ----------------
function resetPipettePosition(pipetteEl) {
    pipetteEl.style.transition = "transform 0.5s ease";
    pipetteEl.style.transform = `translate(0px, 0px)`;
    pipetteEl.setAttribute("data-x", 0);
    pipetteEl.setAttribute("data-y", 0);

    setTimeout(() => {
        pipetteEl.style.transition = "";
    }, 600);
}

// Make bradford reagent a dropzone
interact('#bradford').dropzone({
    accept: '#pipette1',
    ondrop: () => {
        if (pipette1State === "empty") {
            pipette1.src = "images/bradford-filled-pipette.png";
            pipette1State = "bradford";
        }
    }
});
// Make milk tube a dropzone
interact('#milk-tube').dropzone({
    accept: '#pipette2',
    ondrop: () => {
        if (pipette2State === "empty") {
            pipette2.src = "images/milkfilled pipette.png";
            pipette2State = "milk";
            
        }
    }
});
// Make PBS tube a dropzone
interact('#pbs-tube').dropzone({
    accept: '.pipette', // accept all pipettes
    ondrop: (event) => {
        const targetId = event.relatedTarget.id;

        // pipette98 logic
        if (targetId === "pipette98") {
            if (pipette98State === "empty") {
                    pipette98.src = "images/pbsfilled pipette.png";
                    pipette98State = "pbs-filled";
                    
                
            }
           
        }

        // pipette20 logic
        else if (targetId === "pipette20.2") {
            if (pipette202State === "empty" ) {
                pipette202.src = "images/pbsfilled pipette.png";
                pipette202State = "pbs-filled-pipette";
            }
        }
    }
});
// Create droplet at pipette tip
function createDropFromPipette() {
    let pipetteRect = pipette98.getBoundingClientRect();
    let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();

    // Position tip near bottom-right of pipette image
    let tipX = pipetteRect.left + pipetteRect.width*0.3  - apparatusRect.left;
    let tipY = pipetteRect.bottom - apparatusRect.top - 5;

    let drop = document.createElement('img');
    drop.src = "images/drop.png";
    drop.classList.add('drop');
    drop.style.left = `${tipX}px`;
    drop.style.top = `${tipY}px`;

    document.querySelector('.apparatus').appendChild(drop);
    setTimeout(() => drop.remove(), 500);
}
// Make microtube a dropzone
// Single dropzone for microtube
interact('#microtube').dropzone({
    accept: '.pipette', // accept all pipettes
    ondrop: (event) => {
        const targetId = event.relatedTarget.id;

        // pipette98 logic
        if (targetId === "pipette98") {
            if (pipette98State === "pbs-filled" && microtubeState === "empty") {
                let dropInterval = setInterval(createDropFromPipette, 150);
                setTimeout(() => {
                    clearInterval(dropInterval);
                    microtube.src = "images/pbs filled micricentrifuge.png";
                    microtubeState = "pbs";
                    pipette98.src = "images/unfilled pipette.png";
                    pipette98State = "empty";
                     resetPipettePosition(pipette98); 
                }, 600);
            }
            
        }

        // pipette20 logic
        else if (targetId === "pipette20.1") {
            if (microtubeState === "pbs+milk") {
                pipette201.src = "images/pbs+milk filled pipette.png";
                pipette201State = "pbs+milk-filled-pipette";
            }
        }
        else if(targetId==="pipette2"){
             if ( microtubeState === "pbs") {
                 // Droplet animation (falling drops)
            let dropInterval = setInterval(() => {
                let pipetteRect = pipette2.getBoundingClientRect();
                let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();
                let tipX = pipetteRect.left + pipetteRect.width * 0.3 - apparatusRect.left;
                let tipY = pipetteRect.bottom - apparatusRect.top - 5;
                let drop = document.createElement('img');
                drop.src = "images/drop.png";
                drop.classList.add('drop');
                drop.style.left = `${tipX}px`;
                drop.style.top = `${tipY}px`;
                document.querySelector('.apparatus').appendChild(drop);
                setTimeout(() => drop.remove(), 500);
            }, 150);
                setTimeout(() => {
                    clearInterval(dropInterval);
                    microtube.src = "images/pbs+milk filled microcentrifuge.png";
                    microtubeState = "pbs+milk";
                    pipette2.src = "images/unfilled pipette.png";
                    pipette2State = "empty";
                    resetPipettePosition(pipette2);   
                }, 500);
            }
            
        }
    }
});



interact('#blank').dropzone({
    accept: `.pipette`,
    ondrop: (event) => {
        const targetId = event.relatedTarget.id;
        if (targetId === "pipette20.2") {
            if (pipette202State === "pbs-filled-pipette" && blankCuvetteState === "empty") {
            // Droplet animation (falling drops)
            let dropInterval = setInterval(() => {
                let pipetteRect = pipette202.getBoundingClientRect();
                let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();
                let tipX = pipetteRect.left + pipetteRect.width * 0.3 - apparatusRect.left;
                let tipY = pipetteRect.bottom - apparatusRect.top - 5;
                let drop = document.createElement('img');
                drop.src = "images/drop.png";
                drop.classList.add('drop');
                drop.style.left = `${tipX}px`;
                drop.style.top = `${tipY}px`;
                document.querySelector('.apparatus').appendChild(drop);
                setTimeout(() => drop.remove(), 500);
            }, 150);

            // Show filling GIF
            blankCuvette.src = "images/filled-cuvette-animation.gif";

            setTimeout(() => {
                clearInterval(dropInterval);
                blankCuvette.src = "images/filled cuvette.png"; // Final static filled image
                blankCuvetteState = "filled";
                pipette202.src = "images/unfilled pipette.png";
                pipette202State = "empty";
                resetPipettePosition(pipette202);   
            }, 600); // Total pour time (match GIF duration)
           }
        }
         // pipette1 logic
        else if (targetId === "pipette1") {
            if (pipette1State === "bradford" && blankCuvetteState === "filled") {
                // Droplet animation (falling drops)
            let dropInterval = setInterval(() => {
                let pipetteRect = pipette1.getBoundingClientRect();
                let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();
                let tipX = pipetteRect.left + pipetteRect.width * 0.3 - apparatusRect.left;
                let tipY = pipetteRect.bottom - apparatusRect.top - 5;
                let drop = document.createElement('img');
                drop.src = "imagesdrop.png";
                drop.classList.add('drop');
                drop.style.left = `${tipX}px`;
                drop.style.top = `${tipY}px`;
                document.querySelector('.apparatus').appendChild(drop);
                setTimeout(() => drop.remove(), 500);
            }, 150);

            // Show filling GIF
            blankCuvette.src = "images/bradford-filled-cuvette-animation.gif";

            setTimeout(() => {
                clearInterval(dropInterval);
                blankCuvette.src = "images/bradford-filled-cuvette.png"; // Final static filled image
                blankCuvetteState = "filled";
                pipette1.src = "images/unfilled pipette.png";
                pipette1State = "empty";
            }, 600); // Total pour time (match GIF duration)
            bradfordFilledCount++;
            }
        }

        
    }
});






/*-------------pipette20 setup-----------------------*/



interact('#sample').dropzone({

    accept: '.pipette', // accept all pipettes
    ondrop: (event) => {
        const targetId = event.relatedTarget.id;

        // pipette98 logic
        if (targetId === "pipette20.1") {
            if (pipette201State === "pbs+milk-filled-pipette" && sampleCuvetteState === "empty") {
            // Droplet animation (falling drops)
            let dropInterval = setInterval(() => {
                let pipetteRect = pipette201.getBoundingClientRect();
                let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();
                let tipX = pipetteRect.left + pipetteRect.width * 0.3 - apparatusRect.left;
                let tipY = pipetteRect.bottom - apparatusRect.top - 5;
                let drop = document.createElement('img');
                drop.src = "images/drop.png";
                drop.classList.add('drop');
                drop.style.left = `${tipX}px`;
                drop.style.top = `${tipY}px`;
                document.querySelector('.apparatus').appendChild(drop);
                setTimeout(() => drop.remove(), 500);
            }, 150);

            // Show filling GIF
            sampleCuvette.src = "images/filled-cuvette-animation.gif";

            setTimeout(() => {
                clearInterval(dropInterval);
                sampleCuvette.src = "images/filled cuvette.png"; // Final static filled image
                sampleCuvetteState = "filled";
                pipette201.src = "images/unfilled pipette.png";
                pipette201State = "empty";
                resetPipettePosition(pipette201);   
            }, 600); // Total pour time (match GIF duration)
        }
        }

        // pipette1 logic
        else if (targetId === "pipette1") {
            if (pipette1State === "bradford" && sampleCuvetteState === "filled") {
                // Droplet animation (falling drops)
            let dropInterval = setInterval(() => {
                let pipetteRect = pipette1.getBoundingClientRect();
                let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();
                let tipX = pipetteRect.left + pipetteRect.width * 0.3 - apparatusRect.left;
                let tipY = pipetteRect.bottom - apparatusRect.top - 5;
                let drop = document.createElement('img');
                drop.src = "images/drop.png";
                drop.classList.add('drop');
                drop.style.left = `${tipX}px`;
                drop.style.top = `${tipY}px`;
                document.querySelector('.apparatus').appendChild(drop);
                setTimeout(() => drop.remove(), 500);
            }, 150);

            // Show filling GIF
            sampleCuvette.src = "images/bradford-filled-cuvette-animation.gif";

            setTimeout(() => {
                clearInterval(dropInterval);
                sampleCuvette.src = "images/bradford-filled-cuvette.png"; // Final static filled image
                sampleCuvetteState = "filled";
                pipette1.src = "images/unfilled pipette.png";
                pipette1State = "empty";
            }, 600); // Total pour time (match GIF duration)
            bradfordFilledCount++;
            }
        }
    }
    
    });
/* ---------------- BASIC DRAG SETUP ---------------- */
interact('.pipette').draggable({
    inertia: true,
    listeners: {
        move (event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});






/* ---------------- PIPETTE–SAMPLE–CUVETTE MAPPINGS ---------------- */
const mappings = [
    { pipette: "pipette0125c", sample: "green-sample", cuvette: 0 },
    { pipette: "pipette025c",  sample: "yellow-sample", cuvette: 1 },
    { pipette: "pipette05c",   sample: "brown-sample", cuvette: 2 },
    { pipette: "pipette075c",  sample: "pink-sample", cuvette: 3 },
    { pipette: "pipette1c",    sample: "red-sample", cuvette: 4 }
];

const cuvettes = document.querySelectorAll('.cuvette');

mappings.forEach(({ pipette, sample, cuvette }) => {
    let pipetteEl = document.getElementById(pipette);
    let sampleEl = document.getElementById(sample);
    let cuvetteEl = cuvettes[cuvette];

    let pipetteState = "empty";
    let cuvetteState = "empty";

    // Sample dropzone (fills pipette with sample)
    interact(`#${sample}`).dropzone({
        accept: `#${pipette.replace('.', '\\.')}`,
        ondrop: () => {
            if (pipetteState === "empty") {
                pipetteEl.src = "images/sample filled pipette.png";
                pipetteState = "sample";
            }
        }
    });

    // Combined dropzone for sample pipette & pipette1 (Bradford)
    interact(cuvetteEl).dropzone({
        accept: `#${pipette.replace('.', '\\.')}, #pipette1`,
        ondrop: (event) => {
            const targetId = event.relatedTarget.id;

            // --- SAMPLE PIPETTE LOGIC ---
            if (targetId === pipette && pipetteState === "sample" && cuvetteState === "empty") {
                let dropInterval = startDropping(pipetteEl);
                cuvetteEl.src = "images/filled-cuvette-animation.gif";
                setTimeout(() => {
                    stopDropping(dropInterval);
                    cuvetteEl.src = "images/filled cuvette.png";
                    cuvetteState = "filled";
                    pipetteEl.src = "images/unfilled pipette.png";
                    pipetteState = "empty";
                    resetPipettePosition(pipetteEl);   
                }, 600);
            }

            // --- BRADFORD PIPETTE1 LOGIC ---
            else if (targetId === "pipette1" && pipette1State === "bradford") {
                let dropInterval = startDropping(pipette1);
                cuvetteEl.src = "images/bradford-filled-cuvette-animation.gif";
                setTimeout(() => {
                    stopDropping(dropInterval);
                    cuvetteEl.src = "images/bradford-filled-cuvette.png";
                    cuvetteEl.setAttribute('data-filled', 'true');
                    pipette1.src = "images/unfilled pipette.png";
                    pipette1State = "empty";
                }, 600);
                bradfordFilledCount++;
            }
        }
    });
    
});

// Helper functions
function startDropping(pipetteEl) {
    return setInterval(() => {
        let pipetteRect = pipetteEl.getBoundingClientRect();
        let apparatusRect = document.querySelector('.apparatus').getBoundingClientRect();
        let tipX = pipetteRect.left + pipetteRect.width * 0.3 - apparatusRect.left;
        let tipY = pipetteRect.bottom - apparatusRect.top - 5;
        let drop = document.createElement('img');
        drop.src = "images/drop.png";
        drop.classList.add('drop');
        drop.style.left = `${tipX}px`;
        drop.style.top = `${tipY}px`;
        document.querySelector('.apparatus').appendChild(drop);
        setTimeout(() => drop.remove(), 500);
    }, 150);
}

function stopDropping(intervalId) {
    clearInterval(intervalId);
}
document.getElementById("incubateBtn").addEventListener("click", () => {
    if (bradfordFilledCount >= 3) {
        let incubateImg = document.createElement("img");
        incubateImg.src = "images/smoke.png";
        incubateImg.style.position = "fixed";
        incubateImg.style.height = "1000px";
        incubateImg.style.left = "50%";
        incubateImg.style.top = "50%";
        incubateImg.style.transform = "translate(-50%, -50%)";
        incubateImg.style.zIndex = "9999";
        document.body.appendChild(incubateImg);

        setTimeout(() => incubateImg.remove(), 6000);
            cuvette1 = document.getElementById('cuvette1');
    cuvette2 = document.getElementById('cuvette2');
    cuvette3 = document.getElementById('cuvette3');
    cuvette4 = document.getElementById('cuvette4');
    cuvette5 = document.getElementById('cuvette5');
    
    cuvetteSample = document.getElementById('sample');
    cuvetteBlank = document.getElementById('blank');

    cuvette1.src="images/cuvette1.png";
    cuvette2.src="images/cuvette2.png";
    cuvette3.src="images/cuvette3.png";
    cuvette4.src="images/cuvette4.png";
    cuvette5.src="images/cuvette5.png";

    cuvetteSample.src="images/cuvetteSample.png";
    cuvetteBlank.src="images/cuvetteBlank.png";
    }
    else {
        alert("You need to fill all 9 cuvettes with Bradford first!");
    }

});
/* ---------------- BASIC DRAG SETUP ---------------- */
interact('.cuvette').draggable({
    inertia: true,
    listeners: {
        move (event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});



function togglePanel() {
    const panel = document.getElementById("myPanel");
    panel.classList.toggle("open");
}


// Make spectophotometer a dropzone

interact('#spectrophotometer').dropzone({
    accept: '.cuvette, #blank, #sample',
    ondrop: (event) => {
        const targetId = event.relatedTarget.id;

        // Blank logic
        if (targetId === "blank" && blankCuvetteState === "filled") {
            spectrophotometer.src = "images/spectrophotometer.gif";
            blankCuvette.src="";
            setTimeout(() => {
                spectrophotometer.src = "images/spectrophotometerBlank.png";
                spectrophotometerState = "blank";
            }, 2000);
        }

        // Sample logic
        else if (targetId === "sample" && sampleCuvetteState === "filled") {
            spectrophotometer.src = "images/spectrophotometer.gif";
            sampleCuvette.src="";
            setTimeout(() => {
                spectrophotometer.src = "images/spectrophotometerSample.png";
                spectrophotometerState = "sample";
            }, 2000);
        }

        // Standards cuvettes
        else if (targetId.startsWith("cuvette")) {
            const cuvetteIndex = targetId.replace("cuvette", "");
            const cuvetteEl = document.getElementById(targetId); 
            spectrophotometer.src = "images/spectrophotometer.gif";
            cuvetteEl.src="";
            setTimeout(() => {
                spectrophotometer.src = `images/spectrophotometerSample${cuvetteIndex}.png`;
                spectrophotometerState = cuvetteIndex;
            }, 2000);
        }
    }
});

// graph
 const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const margin = 50;

    const xValues = [0, 20, 40, 60, 80, 100];
    const yValues = [0, 0.215, 0.35, 0.526, 0.666, 0.794];

    const xMax = 100;
    const yMax = 1.0;

    const xScale = (width - 2 * margin) / xMax;
    const yScale = (height - 2 * margin) / yMax;

    const points = xValues.map((x, i) => ({
      x: margin + x * xScale,
      y: height - margin - yValues[i] * yScale,
      valX: x,
      valY: yValues[i]
    }));

    const specialY = 0.222;
    let specialX = null;

    // Linear interpolation to find x for special Y
    for (let i = 0; i < yValues.length - 1; i++) {
      if (yValues[i] <= specialY && specialY <= yValues[i + 1]) {
        const x1 = xValues[i], y1 = yValues[i];
        const x2 = xValues[i + 1], y2 = yValues[i + 1];
        specialX = x1 + ((specialY - y1) * (x2 - x1)) / (y2 - y1);
      }
    }

    const specialPoint = {
      x: margin + specialX * xScale,
      y: height - margin - specialY * yScale,
      valX: specialX.toFixed(2),
      valY: specialY
    };

    function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.lineTo(width - margin - 10, height - margin - 5);
  ctx.moveTo(width - margin, height - margin);
  ctx.lineTo(width - margin - 10, height - margin + 5);

  ctx.moveTo(margin, height - margin);
  ctx.lineTo(margin, margin);
  ctx.lineTo(margin - 5, margin + 10);
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin + 5, margin + 10);
  ctx.stroke();

  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // X-axis labels
  for (let i = 0; i < xValues.length; i++) {
    let x = margin + xValues[i] * xScale;
    ctx.fillText(xValues[i], x, height - margin + 5);
  }

  // Y-axis labels (0 to 0.9 step 0.1)
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 9; i++) {
    let y = height - margin - (i * 0.1) * yScale;
    ctx.fillText((i * 0.1).toFixed(1), margin - 5, y);
  }

  // Axis headings
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  // X-axis heading
  ctx.fillText("Concentration(μg/ml)", width / 2, height - 15);

  // Y-axis heading (rotated)
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Absorbance", 0, 0);
  ctx.restore();
}


    function drawGraphAnimation(callback) {
      let progress = 0;
      const totalSteps = 300;

      function animate() {
        ctx.clearRect(0, 0, width, height);
        drawAxes();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        const currentIndex = Math.min(
          Math.floor((progress / totalSteps) * (points.length - 1)) + 1,
          points.length - 1
        );

        for (let i = 1; i <= currentIndex; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw dots for points reached
        ctx.fillStyle = "red";
        for (let i = 0; i <= currentIndex; i++) {
          ctx.beginPath();
          ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }

        progress++;
        if (progress <= totalSteps) {
          requestAnimationFrame(animate);
        } else if (callback) {
          callback();
        }
      }
      animate();
    }

    function showSpecialDot() {
      ctx.beginPath();
      ctx.arc(specialPoint.x, specialPoint.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();

      // Projection lines
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(specialPoint.x, specialPoint.y);
      ctx.lineTo(specialPoint.x, height - margin);
      ctx.moveTo(specialPoint.x, specialPoint.y);
      ctx.lineTo(margin, specialPoint.y);
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("x = " + specialPoint.valX, specialPoint.x, height - margin + 20);
      ctx.textAlign = "right";
      ctx.fillText("y = " + specialPoint.valY, margin - 10, specialPoint.y);
    }



        function startGraph() {
  // show canvas and close button
  canvas.style.display = "block";
  document.getElementById("closeBtn").style.display = "inline-block";

  ctx.clearRect(0, 0, width, height);
  drawGraphAnimation(showSpecialDot);
}

// close/hide the graph
document.getElementById("closeBtn").addEventListener("click", () => {
  canvas.style.display = "none";
  document.getElementById("closeBtn").style.display = "none";
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
    question: "What is the application of Bradford assay?",
    options: [
      "Isolation of DNA",
      "Determination of protein concentration",
      "Protein purification",
      "Separation of proteins"
    ],
    answer: 1
  },
  {
    question: "In Bradford protein assay, what is the dye used in the experiment?",
    options: ["Benedict’s reagent", "Coomassie brilliant blue", "Methylene blue","Ethidium bromide"],
    answer: 1
  },
  {
    question: "In Bradford protein assay, when Bradford dye reagent binds protein, the dye color will change from?",
    options: ["Blue to Red","Red to Blue","Yellow to Blue","Blue to Yellow" ],
    answer: 1
  },

  {
    question: "At which of the below wavelength that absorbance is maximum when Bradford dye reagent binds protein?",
    options: ["At 295nm","At 320nm","At 595nm","At 800nm"],
    answer: 2
  },
  {
    question: "Which of the following statements is false about Bradford assay?",
    options: ["This method relies on the dye binding to protein.",
      "At low pH, the free dye has absorption maxima at 470 and 650nm",
      "The practical advantage of the method is that many proteins dissolve well in the acidic reaction medium",
      "To read the result, the more intense color means the more protein is present."],
    answer: 2
  },
  {
    question: "In the Bradford Assay, under what condition does the Coomassie brilliant blue dye change colour?",
    options: ["When binding to DNA","When exposed to alkaline conditions","When binding to protein under acidic conditions","When interacting with fats or lipids"],
    answer: 2
  },
  {
    question: "How many standards should be made for the standard curve using Bovine Serum Albumin (BSA)?",
    options: ["1 standard","2 standards","3 standards","As many as necessary for an accurate and reliable standard curve"],
    answer: 3
  },
  {
    question: "What is the purpose of preparing dilutions of an unknown solution in water for a Bradford assay?",
    options: ["To maximize the likelihood of obtaining an absorbance reading within the accepted range for absorbance",
      "To minimize the likelihood of obtaining an absorbance reading within the accepted range for absorbance",
      "To calculate the concentration of the unknown solution",
      "To determine the enzyme activity of the unknown solution"],
    answer: 1
  },
  {
    question: "What does an R2 value indicate in the context of a standard curve?",
    options: ["The reliability and validity of the data",
      "The concentration of the unknown enzyme solution",
      "The absorbance reading of the unknown solution",
      "The dilution factor of the unknown solution"],
    answer: 0
  },
  {
    question: "Which amino acids are primarily involved in the binding of Coomassie dye in the Bradford assay?",
    options: ["Alanine and Glycine","Arginine and Lysine","Aspartic acid and Glutamic acid","Leucine and Isoleucine "],
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