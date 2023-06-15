<script>
  import { PLAYER_NUMBER, SOCKET } from '../../stores';
  import { onMount } from 'svelte';

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let player_number;
  PLAYER_NUMBER.subscribe((value) => {
    player_number = value;
  });

  let result;
  let steps = 0;
  let isLeft = true;

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('get_mission_result', () => {
      socket.emit('post_mission_result', {
        player_number: player_number,
        stepCount: result,
      });
    });

    socket.on('getMyStepCounts', (stepCount) => {
      steps = stepCount;
    });
  });

  const stepOnLeft = (event) => {
    event.preventDefault();
    if (isLeft) {
      steps += 1;
      socket.emit('stepOn', steps);
      isLeft = false;
    }
  };
  const stepOnRight = (event) => {
    event.preventDefault();
    if (!isLeft) {
      steps += 1;
      socket.emit('stepOn', steps);
      isLeft = true;
    }
  };
</script>

<div class="stepClientContainer" style="--innerHeight:{innerHeight};">
  <div class="clientTitle">Tap the boxes<br /> alternately<br /> to run</div>
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
</div>

<style>
  .stepClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission1_background.png');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }
  .clientTitle {
    text-align: center;
    width: 70vw;
    font-size: 10vw;
    line-height: 10vw;

    margin-bottom: 5vh;
  }
  .stepper {
    display: flex;
  }
  .leftbox {
    width: 35vw;
    height: 55vh;
    border: 1vh solid #ffffff;
    border-right-width: calc(1vh / 2);
  }
  .rightbox {
    width: 35vw;
    height: 55vh;
    border: 1vh solid #ffffff;
    border-left-width: calc(1vh / 2);
  }

  #thisTime {
    background-color: #ffca5f;
    opacity: 0.9;
  }
  #nextTime {
    background-color: #e6e6e6;
    opacity: 0.9;
  }
</style>
