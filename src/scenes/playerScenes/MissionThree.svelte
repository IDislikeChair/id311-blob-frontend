<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NUMBER, SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import PostMissionThree from './PostMissionThree.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let status = 'Hello';
  let device = 'Device not identified';
  let xAcceleration = 0,
    yAcceleration = 0;
  let tiltInterval;
  let deviceTiltCoeffX = 1;
  let deviceTiltCoeffY = 1;

  let player_number;
  PLAYER_NUMBER.subscribe((value) => {
    player_number = value;
  });

  const innerHeight = window.innerHeight;

  let updated = false,
    totPlayers = [];

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (navigator.userAgent.match(/Android/i)) {
      device = 'Android';
      deviceTiltCoeffX = -1;
    } else if (navigator.userAgent.match(/iPhone/i)) {
      device = 'iPhone';
      deviceTiltCoeffY = -1;
    } else {
      device = 'We only support Android and iOS(iPhone)';
    }

    // Check if the device supports the accelerometer
    if (window.DeviceMotionEvent) {
      // Register the event listener for device motion
      window.addEventListener('devicemotion', handleMotionEvent);
      // Start the tilt detection interval
      tiltInterval = setInterval(send_acceleration, 200);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleMotionEvent);
      tiltInterval = setInterval(send_acceleration, 200);
    } else {
      // Display an error message if the device does not support the accelerometer
      status = 'Accelerometer not supported';
    }

    socket.on('broadcastPlayerStatus', (players) => {
      updated = true;
      totPlayers = players;
    });
  });

  socket.on('start_post_mission', () => {
    dispatch('changeScene', {
      new_scene: PostMissionThree,
    });
  });

  onDestroy(() => {
    // Clean up event listeners and intervals
    window.removeEventListener('devicemotion', handleMotionEvent);
    clearInterval(tiltInterval);
  });

  function handleMotionEvent(event) {
    xAcceleration = event.accelerationIncludingGravity.x;
    yAcceleration = event.accelerationIncludingGravity.y;
  }

  function send_acceleration() {
    socket.emit(
      'sendAcceleration',
      xAcceleration * deviceTiltCoeffX,
      yAcceleration * deviceTiltCoeffY
    );
  }

  function submit_shot() {
    socket.emit('submitShot');
  }
</script>

<div class="shotClientContainer" style="--innerHeight:{innerHeight};">
  {#if updated == true && totPlayers[player_number].alive == 0}
    <div class="clientTitle-survivor">
      Control the flashlight <br /> by tilting the device<br /><br />Tap the box
      to shoot
    </div>
    <div class="shootBox" on:click={submit_shot}>
      <div class="crossHair" />
    </div>
  {:else}
    <div class="clientTitle-eliminated">
      Let's watch<br /> other players'<br />fantastic play
    </div>
  {/if}
</div>

<style>
  .shotClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission3_background.png');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }
  .clientTitle-survivor {
    text-align: center;
    width: 70vw;
    font-size: 8vw;
    line-height: 8vw;

    margin-bottom: 8vh;
    color: #e9e9e9;
  }
  .clientTitle-eliminated {
    text-align: center;
    width: 70vw;
    font-size: 10vw;
    line-height: 10vw;

    margin-bottom: 5vh;
    color: #e9e9e9;
  }
  .shootBox {
    width: 70vw;
    height: 70vw;
    background-color: #635e94;
    border: 2vw solid #000000;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .crossHair {
    width: 20vw;
    height: 20vw;

    background-image: url('../../images/level3/crosshair.png');
    background-size: cover;
  }
</style>
