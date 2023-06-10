<script>
  import P5 from 'p5-svelte';
  import { onDestroy, onMount } from 'svelte';
  import Button from './Button.svelte';

  export let ballSize = 20;
  export let width = 800;
  export let height = 600;
  export let socket;

  let steps = {};

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastStepCount', (stepCount) => {
      for (let socketID of Object.keys(stepCount)) {
        steps[stepCount[socketID].pName] = stepCount[socketID].steps;
      }
    });
  });

  onDestroy(() => {
    socket.off('broadcastStepCount');
  });

  function resetStep() {
    socket.emit('resetStepCount');
  }

  const sketch = (p5) => {
    p5.setup = function () {
      p5.createCanvas(width, height);
    };

    p5.draw = function () {
      p5.background(150);
      p5.noStroke();
      p5.fill(255);
      p5.ellipse(width / 2, height - steps * 5, ballSize);
    };
  };
</script>

<div class="serverTitle">
  <h3>SWIMMING</h3>
  <p>Current steps: {steps}</p>
  <Button on:click={resetStep} icon="fa-regular fa-trash-arrow-up" />
  <P5 {sketch} />
</div>

<style>
  .serverTitle {
    width: 80vw;
    margin-left: 30px;
  }
</style>
