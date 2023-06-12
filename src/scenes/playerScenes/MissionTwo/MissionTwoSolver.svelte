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

    socket.on('start_post_mission', () => {
      dispatch('changeScene', {
        new_scene: PostMissionTwo,
      });
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
    console.log('AAA');
    socket.emit('sendAcceleration', xAcceleration * deviceTiltCoeff);
  }

  function submit_answer() {
    socket.emit('submitAnswer');
  }
</script>

<div
  class="stepClientContainer"
  style="--innerHeight:{innerHeight};"
  on:touchstart={submit_answer}
>
  <div class="clientTitle">Tilt your phone to move the slider</div>

  <div id="device">Device Type: {device}</div>
  <div id="status">Tilting Status: {status}</div>
</div>

<style>
  .stepClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission2_background.png');
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
</style>
