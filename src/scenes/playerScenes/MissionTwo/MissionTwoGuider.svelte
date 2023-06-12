<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../../stores';
  import { onMount } from 'svelte';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let ding = 'No ding';
  let updated = false,
    myPartner = 0,
    pImageID = 'player1',
    totPlayers = [];

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('alertAnswer', () => {
      doDing();
    });

    socket.on('broadcastPlayerStatus', (players) => {
      updated = true;
      totPlayers = players;
    });
  });

  socket.on('myRolePartner', (partnerNumber) => {
    myPartner = partnerNumber;
    pImageID = 'player' + (partnerNumber + 1);
  });

  function doDing() {
    ding = 'Ding!';
    setTimeout(() => {
      ding = 'No ding';
    }, 1000);
  }
</script>

<div class="tiltContainer" style="--innerHeight:{innerHeight};">
  <div class="clientTitle">
    Tell your partner<br /> the location <br />when the orb <br />turns green
  </div>

  {#if ding === 'Ding!'}
    <div class="orb" id="green" />
  {:else}
    <div class="orb" id="red" />
  {/if}

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

  .orb {
    width: 8vh;
    height: 8vh;
    margin-bottom: 1vh;
  }
  #red {
    background-image: url('../../../images/level2/orb_red.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #green {
    background-image: url('../../../images/level2/orb_green.png');
    background-size: contain;
    background-repeat: no-repeat;
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
