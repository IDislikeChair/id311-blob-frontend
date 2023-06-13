<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NUMBER, SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let player_number,
    myName = 'None',
    alive = true,
    updated = false,
    imageID = 'player1';
  PLAYER_NUMBER.subscribe((value) => {
    player_number = value;
    imageID = 'player' + (player_number + 1);
  });

  const innerHeight = window.innerHeight;
  let device = 'Undefined';

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (navigator.userAgent.match(/Android/i)) {
      device = 'Android';
    } else if (navigator.userAgent.match(/iPhone/i)) {
      device = 'iPhone';
    } else {
      device = 'We only support Android and iOS(iPhone)';
    }
  });

  socket.on('broadcastPlayerStatus', (players) => {
    updated = true;
    let pNames = Object.keys(players);
    let mySocket = pNames[player_number];
    myName = players[mySocket]['pName'];
    alive = players[mySocket]['alive'] == 0;
  });

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

<div class="preMissionOneContainer" style="--innerHeight:{innerHeight};">
  {#if alive == false}
    <div class="failTitle">You've failed :(</div>
  {:else if device === 'Android'}
    <div class="readyTitle">You are ready!</div>
  {:else}
    <p class="permissionInstr">
      If you are the iPhone user,<br />get permission first<br />👇
    </p>
    <button class="permissionBtn" on:click={getPermission}
      >Get Permission</button
    >
  {/if}
  {#if updated}
    <div class="myCharacter">
      <div class="name">{myName}</div>
      <div class="pImage" id={imageID} />
    </div>
  {/if}
  <div class="readyCmd">
    {#if alive == true}
      Press NEXT on the TV<br /> to continue ...
    {:else}
      Better luck<br /> next time
    {/if}
  </div>
</div>

<style>
  .preMissionOneContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-image: url('../../images/mission2_background.png');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }
  .failTitle {
    font-size: 5vh;
    color: white;
    font-weight: bolder;
  }
  .readyTitle {
    font-size: 5vh;
    color: transparent;
    font-weight: bolder;
  }

  .myCharacter {
    width: 25vh;
    height: 25vh;
    padding: 5vh;
    margin-top: 3vh;
    margin-bottom: 14vh;
    background-color: #faf2ef;
    border: 0.5vh solid #8e1a46;
    box-shadow: 1.5vh 1.5vh 0px #8e1a46;
    font-size: 5vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .permissionInstr {
    color: white;
    font-size: 3vh;
    line-height: 4vh;
  }

  .permissionBtn {
    width: 35vh;
    height: 5vh;
    padding-left: 3vh;
    padding-left: 3vh;
    background-color: #faf2ef;
    color: #505050;
    border: 0.5vh solid #a4315d;
    border-radius: 0px;
    box-shadow: 1.5vh 1.5vh 0px #a4315d;
    font-size: 3vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .pImage {
    width: 20vh;
    height: 20vh;
    margin-left: 1vw;
  }

  #player1 {
    background-image: url('../../images/sprites/player1.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player2 {
    background-image: url('../../images/sprites/player2.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player3 {
    background-image: url('../../images/sprites/player3.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player4 {
    background-image: url('../../images/sprites/player4.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player5 {
    background-image: url('../../images/sprites/player5.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player6 {
    background-image: url('../../images/sprites/player6.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }

  .readyCmd {
    font-size: 4vh;
    line-height: 4vh;
    color: white;
    font-weight: bolder;
  }
</style>
