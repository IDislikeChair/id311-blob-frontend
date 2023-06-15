<script>
  import { SOCKET } from '../../../stores';
  import { onMount, onDestroy } from 'svelte';

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let xAcceleration = 0;
  let tiltInterval;
  let deviceTiltCoeff = 1;

  let updated = false;
  let pImageID = 'player1';

  let attempts = 5;

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
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
    }

    socket.on('broadcastPlayerStatus', (players) => {
      updated = true;
    });

    socket.on('myRolePartner', (partnerNumber) => {
      pImageID = 'player' + (partnerNumber + 1);
    });
  });

  onDestroy(() => {
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
    tap screen<br /> to pick lock
  </div>

  <div class="attemtDesc">
    {attempts}/5 lock picking attempt(s) left
  </div>

  {#if updated}
    <div class="partnerCharacter">
      <div class="pDesc">your partner</div>
      <div class="pImage" id={pImageID} />
    </div>
  {/if}
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
