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
  let status = 'Hello';
  let device = 'Device not identified';
  let xAcc = 0;
  let yAcc = 0;
  let zAcc = 0;
  let tiltInterval;
  let tiltCoef = 1;

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (navigator.userAgent.match(/Android/i)) {
      device = 'Android';
      tiltCoef = -1;
    } else if (navigator.userAgent.match(/iPhone/i)) {
      device = 'iPhone';
      getPermission();
    } else {
      device = 'We only support Android and iOS(iPhone)';
    }
    // Check if the device supports the accelerometer
    if (window.DeviceMotionEvent) {
      // Register the event listener for device motion
      window.addEventListener('devicemotion', handleMotionEvent);
      // Start the tilt detection interval
      tiltInterval = setInterval(checkForTilt, 200);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleMotionEvent);
      tiltInterval = setInterval(checkForTilt, 200);
    } else {
      // Display an error message if the device does not support the accelerometer
      status = 'Accelerometer not supported';
    }

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
  });

  onDestroy(() => {
    // Clean up event listeners and intervals
    window.removeEventListener('devicemotion', handleMotionEvent);
    clearInterval(tiltInterval);
  });

  function handleMotionEvent(event) {
    // Get the acceleration values including gravity
    const acc = event.accelerationIncludingGravity;
    // Update the acceleration values
    xAcc = acc.x;
    yAcc = acc.y;
    zAcc = acc.z;
    status = '' + Math.floor(yAcc * tiltCoef);
  }

  function checkForTilt() {
    socket.emit('beTilted', Number(status));
  }

  function getPermission() {
    status = 'getPermissionFirst';
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS 13+
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          status = response;
          if (response == 'granted') {
            window.addEventListener('devicemotion', (e) => {
              // do something with e
            });
          }
        })
        .catch(console.error);
    } else {
      // non iOS 13+
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          status = response;
          if (response == 'granted') {
            window.addEventListener('deviceorientation', (e) => {
              // do something with e
            });
          }
        })
        .catch(console.error);
    }
  }
</script>

<div class="stepClientContainer" style="--innerHeight:{innerHeight};">
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

    background-image: url('../../assets/mission2_background.png');
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
