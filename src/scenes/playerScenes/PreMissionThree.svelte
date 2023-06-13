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

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });

  socket.on('broadcastPlayerStatus', (players) => {
    updated = true;
    let pNames = Object.keys(players);
    let mySocket = pNames[player_number];
    myName = players[mySocket]['pName'];
    alive = players[mySocket]['alive'];
  });
</script>

<div class="preMissionThreeContainer" style="--innerHeight:{innerHeight};">
  {#if alive == false}
    <div class="failTitle">You've failed :(</div>
  {:else}
    <div class="readyTitle">You are ready!</div>
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
  .preMissionThreeContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-image: url('../../images/mission3_background.png');
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
    background-color: #edeff4;
    border: 0.5vh solid #132725;
    box-shadow: 1.5vh 1.5vh 0px #132725;
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
    color: black;
    font-weight: bolder;
  }
</style>
