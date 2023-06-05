<script>
  import { onDestroy, onMount } from 'svelte';

  export let socket;
  let steps = 0;
  let isLeft = true;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastStepCount', (stepCount) => {
      steps = stepCount;
    });
  });

  const stepOnLeft = async (event) => {
    event.preventDefault();
    if (isLeft) {
      await socket.emit('stepOn');
      isLeft = false;
    }
  };
  const stepOnRight = async (event) => {
    event.preventDefault();
    if (!isLeft) {
      await socket.emit('stepOn');
      isLeft = true;
    }
  };

  onDestroy(() => {
    socket.off('broadcastStepCount');
  });
</script>

<div class="clientTitle">
  <h3>SWIMMING</h3>
  <p>Use two fingers to alternately tap on the green rectangle</p>
  <p>Current steps: {steps}</p>
</div>
<div class="stepper">
  <div
    class="leftbox"
    id={isLeft ? 'thisTime' : 'nextTime'}
    on:touchstart={stepOnLeft}
  />
  <div
    class="rightbox"
    id={isLeft ? 'nextTime' : 'thisTime'}
    on:touchstart={stepOnRight}
  />
</div>

<style>
  .clientTitle {
    width: 80vw;
    margin-left: 30px;
  }
  .stepper {
    display: flex;
  }
  .leftbox {
    width: 50vw;
    height: 400px;
  }
  .rightbox {
    width: 50vw;
    height: 400px;
  }

  #thisTime {
    background-color: #7eff9a;
    opacity: 0.5;
  }
  #nextTime {
    background-color: rgb(220, 220, 220);
    opacity: 0.5;
  }
</style>
