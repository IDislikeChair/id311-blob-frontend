<script>
  function getPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS 13+
      //   status = 'getPermissionFirst, iOS 13+';
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
      //   status = 'getPermissionFirst, non iOS 13+';
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

<div>
  <div class="card">PreMissionTwo</div>

  <p>
    If you are a iPhone user,<br />get permission first <br />by clicking the
    button here<br />👇
  </p>
  <button on:click={getPermission}>Get Permission</button>
</div>
