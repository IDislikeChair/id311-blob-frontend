<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NUMBER, SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import PostMissionOne from './PostMissionOne.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
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

    socket.on('start_post_mission', () => {
      dispatch('changeScene', {
        new_scene: PostMissionOne,
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

<div class="stepClientContainer">
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
  <div class="clientTitle">
    <h3>SWIMMING</h3>
    <p>Use two fingers to alternately tap on the green rectangle</p>
  </div>
</div>

<style>
  .stepClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .clientTitle {
    position: relative;
    top: calc(-100vh + 30px);
    width: 75%;
    font-size: 16px;
  }
  .stepper {
    display: flex;
  }
  .leftbox {
    width: 50vw;
    height: 100vh;
  }
  .rightbox {
    width: 50vw;
    height: 100vh;
  }

  #thisTime {
    background-color: #8effa6;
  }
  #nextTime {
    background-color: #e6e6e6;
  }
</style>
