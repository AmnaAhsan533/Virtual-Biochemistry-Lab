// // Initial milk drag logic
// Draggable.create("#milk", {
//   onDragEnd: function () {
//     const milk = this.target;
//     const beaker = document.getElementById("beaker").getBoundingClientRect();
//     const milkRect = milk.getBoundingClientRect();

//     const nearBeaker = milkRect.left < beaker.right &&
//                        milkRect.right > beaker.left &&
//                        milkRect.top < beaker.bottom &&
//                        milkRect.bottom > beaker.top;

//     if (nearBeaker) {
//       startPouringMilk(); // starts the animation
//     }
//   }
// });

// let pouringMilkTween;

// function startPouringMilk() {
//   const milkInBeaker = document.getElementById("milkInBeaker");
//   pouringMilkTween = gsap.to(milkInBeaker, {
//     duration: 1.5,
//     opacity: 1,
//     scale: 1.5,
//     repeat: -1,
//     yoyo: true,
//     ease: "power1.inOut"
//   });
// }

// // Clicking milk stops flow and resets
// document.getElementById("milk").addEventListener("click", () => {
//   if (pouringMilkTween) pouringMilkTween.kill();
//   gsap.to("#milkInBeaker", { opacity: 0 });
//   gsap.to("#milk", { x: 0, y: 0, duration: 0.8 });
// });


// let ph = 7.0;

// document.getElementById("dropper").addEventListener("click", () => {
//   if (ph <= 4.6) return;

//   // Add a single acid drop animation
//   let drop = document.createElement("div");
//   drop.style.position = "absolute";
//   drop.style.width = "10px";
//   drop.style.height = "10px";
//   drop.style.background = "#dc2626";
//   drop.style.borderRadius = "50%";
//   drop.style.left = "50%";
//   drop.style.top = "150px"; // starting dropper height
//   drop.style.transform = "translateX(-50%)";
//   document.querySelector(".lab-area").appendChild(drop);

//   gsap.to(drop, {
//     y: 100,
//     duration: 0.7,
//     ease: "bounce.out",
//     onComplete: () => {
//       drop.remove();
//       ph = parseFloat((ph - 0.2).toFixed(1));
//       document.getElementById("phValue").textContent = ph;

//       if (ph <= 4.6) {
//         document.getElementById("precipitate").style.opacity = 1;
//       }
//     }
//   });
// });


//Movement
// const milk = document.getElementById('milk');
// let m_moved = false;

// milk.addEventListener('click', function(){
//   if(!m_moved){
//     milk.classList.remove("m-reverse");
//     milk.classList.add("m-animate");
//   }else {
//     milk.classList.remove("m-animate");
//     milk.classList.add("m-reverse");
//   }
//   m_moved = !m_moved; //Toggle state
// })

// const water = document.getElementById('water');
// let w_moved = false;

// water.addEventListener('click', function(){
//   if(!w_moved){
//     water.classList.remove("w-reverse");
//     water.classList.add("w-animate");
//   }else {
//     water.classList.remove("w-animate");
//     water.classList.add("w-reverse");
//   }
//   w_moved = !w_moved; //Toggle state
// })



console.log(true + 1);

// // ====== STATE ======
// let milkAdded = false;
// let waterAdded = false;
// let pH = 0.0; // starting pH

// // Elements
// const milk = document.getElementById("milk");
// const water = document.getElementById("water");
// const beaker = document.getElementById("beaker");
// const labArea = document.querySelector(".lab-area");



// // Fill & stream placeholders
// const milkFill = document.getElementById("milk-fill");
// const milkStream = document.getElementById("milk-stream");
// const waterFill = document.getElementById("water-fill");
// const waterStream = document.getElementById("water-stream");

// // ====== DRAG SETUP ======
// Draggable.create(milk, {
//   type: "x,y",
//   bounds: labArea,
//   onDragEnd: function () {
//     if (isOverlapping(this.target, beaker)) {
//       pourLiquid("milk");
//       gsap.to(this.target, { x: 0, y: 0, duration: 1 });
//       this.target.style.pointerEvents = "none"; // Prevent dragging again
//       milkAdded = true;
//       pH = 6.6;
//       phMeter.textContent = `pH: ${pH.toFixed(1)}`;
//     } else {
//       gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
//     }
//   },
// });

// Draggable.create(water, {
//   type: "x,y",
//   bounds: labArea,
//   onDragEnd: function () {
//     if (isOverlapping(this.target, beaker) && milkAdded) {
//       pourLiquid("water");
//       gsap.to(this.target, { x: 0, y: 0, duration: 1 });
//       this.target.style.pointerEvents = "none"; // Prevent dragging again
//       waterAdded = true;
//       enableAcidDrop();
//     } else {
//       gsap.to(this.target, { x: 0, y: 0, duration: 0.5 });
//     }
//   },
// });

// // ====== FUNCTIONS ======
// function isOverlapping(el1, el2) {
//   let rect1 = el1.getBoundingClientRect();
//   let rect2 = el2.getBoundingClientRect();
//   return !(
//     rect1.top > rect2.bottom ||
//     rect1.bottom < rect2.top ||
//     rect1.right < rect2.left ||
//     rect1.left > rect2.right
//   );
// }

// function pourLiquid(type) {
//   let stream = type === "milk" ? milkStream : waterStream;
//   let fill = type === "milk" ? milkFill : waterFill;
//   let jar = type === "milk" ? milk : water; // Add this line

//   stream.style.position = "absolute";
//   stream.style.background = type === "milk" ? "#fff" : "#9ee7ff";
//   stream.style.width = "8px";
//   stream.style.height = "0px";
//   stream.style.left = "38%";
//   stream.style.top = "300px";
//   stream.style.borderRadius = "4px";
//   labArea.appendChild(stream);
//   // Tilt the jar to -40 degrees (or any angle you like)
// gsap.to(jar, { rotate: -120, duration: 0.3 });
//   // Stream animation
//   gsap.to(stream, { height: 120, duration: 0.5, ease: "power1.inOut",
//     onComplete: () => {
//       gsap.to(stream, {opacity: 0, duration: 0.5});  
//     }
//   });

//   // Move jar back only after fill animation completes
//   gsap.to(fill, {
//   height: "+=50",
//   duration: 1,
//   ease: "linear",
//   delay: 0.3,
//   onComplete: () => {
//     // First, rotate upright
//     gsap.to(jar, {
//       rotate: 0,
//       duration: 0.3,
//       onComplete: () => {
//         // Then move back to original position
//         gsap.to(jar, { x: 0, y: 0, duration: 20 });
//         jar.style.pointerEvents = "none";
//         if (type === "milk") milkAdded = true;
//         if (type === "water") waterAdded = true;
//       }
//     });
//   }
// });
// }

// // Enable acid button
// let drop = document.getElementById("drop");
// function enableAcidDrop() {
//   const acidBtn = document.getElementById("dropper");

//   acidBtn.addEventListener("click", () => {
//     drop.classList.remove("drop-animate");
//     void drop.offsetWidth; // reset animation
//     drop.classList.add("drop-animate");
//     // Only decrease if above target
//      if (pH > 4.6) {
//       pH = Math.max(4.6, pH - 0.2); // clamp so it never goes below 4.6
//       phMeter.textContent = `pH: ${pH.toFixed(1)}`;

//       if (Math.abs(pH - 4.6) < 0.05) { // close enough to 4.6
//         showPrecipitate();
//       }
//     } else {
//       alert("pH must be 4.6! Cannot add more acid.");
//     }
//   });
// }

// function showPrecipitate() {
//   const bubbleInterval = setInterval(createBubble, 0);
//    setTimeout(() => {
//     clearInterval(bubbleInterval);
//   }, 3000);
// }

// const container = document.getElementById('precipitate');

// function createBubble() {
//   const bubble = document.createElement('div');
//   bubble.classList.add('bubble');
  
//   const size = Math.random() * 8 + 2; // 2px-10px
//   bubble.style.width = `${size}px`;
//   bubble.style.height = `${size}px`;
  
//   bubble.style.left = `${Math.random() * 70}px`; // spread inside container
//   bubble.style.bottom = '-4px'; 
  
//   bubble.style.animationDuration = 'none';
  
//   container.appendChild(bubble);
  
// }
