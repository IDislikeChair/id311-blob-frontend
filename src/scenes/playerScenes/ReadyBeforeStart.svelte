<script>
  import { PLAYER_NUMBER, SOCKET } from '../../stores';
  import { onMount } from 'svelte';

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let player_number,
    myName = 'None',
    updated = false,
    imageID = 'player1';
  PLAYER_NUMBER.subscribe((value) => {
    player_number = value;
    imageID = 'player' + (player_number + 1);
  });

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastPlayerStatus', (players) => {
      updated = true;
      let pNames = Object.keys(players);
      let mySocket = pNames[player_number];
      myName = players[mySocket]['pName'];
    });
  });
</script>

<div class="readyClientContainer" style="--innerHeight:{innerHeight};">
  <div class="readyTitle">You are ready!</div>
  {#if updated}
    <div class="myCharacter">
      <div class="name">{myName}</div>
      <div class="pImage" id={imageID} />
    </div>
  {/if}
  <div class="readyCmd">Wait for the<br />game to start ...</div>
</div>

<style>
  .readyClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-image: url('../../images/join_background.png');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }
  .readyTitle {
    font-size: 5vh;
    color: white;
    font-weight: bolder;
  }

  .myCharacter {
    width: 25vh;
    height: 25vh;
    padding: 5vh;
    margin-top: 3vh;
    margin-bottom: 14vh;
    background-color: #ecf1e5;
    border: 0.5vh solid #3c6b1f;
    box-shadow: 1.5vh 1.5vh 0px #7fad71;
    font-size: 5vh;

    display: flex;
    flex-direction: column;
    align-items: center;
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
