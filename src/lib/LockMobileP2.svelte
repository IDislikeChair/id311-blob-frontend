<script>
  import { onDestroy, onMount } from 'svelte';
  import P5 from 'p5-svelte';

  export let ballSize = 30;
  export let width = 300;
  export let height = 300;
  export let socket;
  let ballPos = width / 2;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastBallPos', (curBallPos) => {
      ballPos = curBallPos;
    });
  });

  onDestroy(() => {
    socket.off('broadcastBallPos');
  });

  const sketch = (p5) => {
    p5.setup = function () {
      p5.createCanvas(width, height);
    };

    p5.draw = function () {
      p5.background(255);
      p5.noStroke();
      p5.fill('#9C9C9C');
      p5.rect(0, height / 2 - 2, width, 4);
      p5.fill('#FF7777');
      p5.ellipse(ballPos, height / 2, ballSize);
    };
  };

  function vibrate() {
    navigator.vibrate(200);
  }
</script>

<div class="lockMobileContainer">
  <div class="clientTitle">
    <h3>LOCK PICKING</h3>
    <p>
      Find the player that controls the mechanism. Tell them the location where
      you feel your phone vibrate
    </p>
  </div>
  <button on:click={vibrate}>VIBRATE</button>
  <P5 {sketch} />
</div>

<style>
  .lockMobileContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .clientTitle {
    width: 75%;
    margin-top: 30px;
    font-size: 16px;
  }
  .instruction {
    width: 75%;
    margin-top: 100px;
    font-size: 24px;
  }
  .pickTrial {
    width: 75%;
    margin-top: 100px;
    font-size: 16px;
  }
</style>
