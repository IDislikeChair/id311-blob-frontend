<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import PostMissionTwo from '../PostMissionTwo.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let status = 'Hello';
  let device = 'Device not identified';
  let xAcceleration = 0;
  let tiltInterval;
  let deviceTiltCoeff = 1;

  let updated = false,
    myPartner = 0,
    pImageID = 'player1',
    totPlayers = [];

  let attempts = 5;

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (navigator.userAgent.match(/Android/i)) {
      device = 'Android';
      deviceTiltCoeff = -1;
    } else if (navigator.userAgent.match(/iPhone/i)) {
      device = 'iPhone';
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

  socket.on('myRolePartner', (partnerNumber) => {
    myPartner = partnerNumber;
    pImageID = 'player' + (partnerNumber + 1);
  });

  socket.on('start_post_mission', () => {
    dispatch('changeScene', {
      new_scene: PostMissionTwo,
    });
  });

  onDestroy(() => {
    // Clean up event listeners and intervals
    window.removeEventListener('devicemotion', handleMotionEvent);
    clearInterval(tiltInterval);
  });

  function handleMotionEvent(event) {
    xAcceleration = event.accelerationIncludingGravity.x;
  }

  function send_acceleration() {
    socket.emit('sendAcceleration', xAcceleration * deviceTiltCoeff);
  }

  function submit_answer() {
    socket.emit('submitAnswer');
  }
</script>

<div
  class="tiltContainer"
  style="--innerHeight:{innerHeight};"
  on:touchstart={submit_answer}
>
  <div class="clientTitle">
    Tilt your phone<br /> to move the slider,<br />
    tap screen<br /> to lockpick
  </div>

  <div class="attemtDesc">
    {attempts}/5 lockpick attempt(s) left
  </div>

  {#if updated}
    <div class="partnerCharacter">
      <div class="pDesc">your partner</div>
      <div class="pImage" id={pImageID} />
    </div>
  {/if}
  <!-- <div id="device">Device Type: {device}</div>
  <div id="status">Tilting Status: {status}</div> -->
</div>

<style>
  .tiltContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../../images/mission2_background.png');
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
    color: #e9e9e9;
  }
  .attemtDesc {
    font-size: 5vw;
    line-height: 7vw;
    color: white;
  }

  .partnerCharacter {
    width: 25vh;
    height: 25vh;
    padding: 4vh;
    margin-top: 3vh;
    margin-bottom: 3vh;
    background-color: #faf2ef;
    border: 0.5vh solid #8e1a46;
    box-shadow: 1.5vh 1.5vh 0px #8e1a46;
    font-size: 5vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .pDesc {
    font-size: 5vh;
    line-height: 5vh;
    margin-bottom: 3vh;
  }

  .pImage {
    width: 20vh;
    height: 20vh;
    margin-left: 1vw;
  }

  #player1 {
    background-image: url('../../../images/sprites/player1.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player2 {
    background-image: url('../../../images/sprites/player2.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player3 {
    background-image: url('../../../images/sprites/player3.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player4 {
    background-image: url('../../../images/sprites/player4.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player5 {
    background-image: url('../../../images/sprites/player5.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player6 {
    background-image: url('../../../images/sprites/player6.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
