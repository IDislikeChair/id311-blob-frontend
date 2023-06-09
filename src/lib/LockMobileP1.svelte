<script>
  import { onDestroy, onMount } from 'svelte';

  export let socket;
  export let status = 'Hello';
  export let device = 'Device not identified';
  let xAcc = 0;
  let yAcc = 0;
  let zAcc = 0;
  let tiltInterval;
  let tiltCoef = 1;

  $: onMount(async () => {
    if (navigator.userAgent.match(/Android/i)) {
      device = 'Android';
      tiltCoef = -1;
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
    status = '' + Math.floor(xAcc * tiltCoef);
  }

  function checkForTilt() {
    socket.emit('tilt', Number(status));
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

<div class="lockMobileContainer">
  <div id="device">Device Type: {device}</div>
  {#if device == 'iPhone'}
    <p>
      If you are a iPhone user,<br />get permission first by clicking the button
      here<br />👇
    </p>
    <button on:click={getPermission}>Get Permission</button>
  {/if}
  <div id="status">Tilting Status: {status}</div>
  <div class="clientTitle">
    <h3>LOCK PICKING</h3>
    <p>
      Find the player whose mechanism you control. Press unlock at their
      specified location.
    </p>
  </div>

  <div class="instruction">
    Tilt the phone left or right to control the mechanism on your partner’s
    phone.
  </div>

  <div class="pickTrial">
    <p>3 attempts left</p>
    <button>Pick</button>
  </div>
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
