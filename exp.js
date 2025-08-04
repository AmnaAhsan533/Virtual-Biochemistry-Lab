let isPouring = false;
    let milkLevel = 0;
    const maxLevel = 200; // max height in px
    let pourInterval;

    window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("milk").addEventListener("click", togglePour);
});
    function togglePour() {
      const bottle = document.getElementById("milk");
      const stream = document.getElementById("milk-stream");
      const fill = document.getElementById("milk-fill");

      if (!isPouring) {
        // Start pouring
        isPouring = true;

        // Animate bottle tilt
        anime({
          targets: bottle,
          rotate: 45,
          duration: 400,
          easing: 'easeInOutSine'
        });

        // Animate milk stream down
        anime({
          targets: stream,
          height: '100px',
          duration: 300,
          easing: 'easeOutQuad'
        });

        // Start filling gradually
        pourInterval = setInterval(() => {
          if (milkLevel >= maxLevel) {
            stopPour();
            return;
          }
          milkLevel += 1;
          fill.style.height = milkLevel + 'px';
        }, 30);
      } else {
        stopPour();
      }
    }

    function stopPour() {
      const bottle = document.getElementById("milk");
      const stream = document.getElementById("milk-stream");

      isPouring = false;
      clearInterval(pourInterval);

      // Animate bottle back
      anime({
        targets: bottle,
        rotate: 0,
        duration: 400,
        easing: 'easeInOutSine'
      });

      // Animate milk stream up
      anime({
        targets: stream,
        height: '0px',
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
    let isPouringWater = false;
let waterLevel = 0;
const waterMax = 200;
let waterInterval;

document.getElementById("water").addEventListener("click", toggleWaterPour);

function toggleWaterPour() {
  const bottle = document.getElementById("water");
  const stream = document.getElementById("water-stream");
  const fill = document.getElementById("water-fill");

  if (!isPouringWater) {
    isPouringWater = true;

    anime({
      targets: bottle,
      rotate: -45,
      duration: 400,
      easing: 'easeInOutSine'
    });

    anime({
      targets: stream,
      height: '100px',
      duration: 300,
      easing: 'easeOutQuad'
    });

    waterInterval = setInterval(() => {
      if (waterLevel >= waterMax) {
        stopWaterPour();
        return;
      }
      waterLevel += 1;
      fill.style.height = waterLevel + 'px';
    }, 30);
  } else {
    stopWaterPour();
  }
}

function stopWaterPour() {
  const bottle = document.getElementById("water");
  const stream = document.getElementById("water-stream");

  isPouringWater = false;
  clearInterval(waterInterval);

  anime({
    targets: bottle,
    rotate: 0,
    duration: 400,
    easing: 'easeInOutSine'
  });

  anime({
    targets: stream,
    height: '0px',
    duration: 300,
    easing: 'easeOutQuad'
  });
}
