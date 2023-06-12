<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NAMES, SOCKET } from '../../stores';
  import { onMount } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let sessionId;
  let pNames = [];
  let playerNum = 0;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.emit('get_session_id');

    socket.on('post_session_id', (id) => {
      sessionId = id;
    });
  });

  socket.on('broadcastPlayerStatus', (players) => {
    for (let socketID of Object.keys(players)) {
      if (pNames.includes(players[socketID].pName)) continue;
      pNames.push(players[socketID].pName);
    }
    playerNum = pNames.length;

    PLAYER_NAMES.set(pNames.slice(0, 6));
  });
  const start = () => {
    if (pNames.length >= 6) {
      PLAYER_NAMES.set(pNames.slice(0, 6));
    } else {
      const padding = Array(6 - pNames.length).fill('player');
      PLAYER_NAMES.set(pNames.concat(padding));
    }

    socket.emit('on_next');
  };
</script>

<div class="waitingPlayers" style="--innerWidth:{window.innerWidth};">
  <div class="hostInfo">
    <div class="codeTitle">Game Code:</div>
    <div class="gameCode">{sessionId}</div>
    <button class="startGame" on:click={start}>Start Game</button>
  </div>
  <div class="joinedPlayers">
    Joined Players:
    <div class="player">
      <div class="pImage" id="player1" style="--height:{window.innerHeight};" />
      <div class="pName">
        {#if playerNum > 0}
          {pNames[0]}
        {:else}
          ...
        {/if}
      </div>
    </div>
    <div class="player">
      <div class="pImage" id="player2" style="--height:{window.innerHeight};" />
      <div class="pName">
        {#if playerNum > 1}
          {pNames[1]}
        {:else}
          ...
        {/if}
      </div>
    </div>
    <div class="player">
      <div class="pImage" id="player3" style="--height:{window.innerHeight};" />
      <div class="pName">
        {#if playerNum > 2}
          {pNames[2]}
        {:else}
          ...
        {/if}
      </div>
    </div>
    <div class="player">
      <div class="pImage" id="player4" style="--height:{window.innerHeight};" />
      <div class="pName">
        {#if playerNum > 3}
          {pNames[3]}
        {:else}
          ...
        {/if}
      </div>
    </div>
    <div class="player">
      <div class="pImage" id="player5" style="--height:{window.innerHeight};" />
      <div class="pName">
        {#if playerNum > 4}
          {pNames[4]}
        {:else}
          ...
        {/if}
      </div>
    </div>
    <div class="player">
      <div class="pImage" id="player6" style="--height:{window.innerHeight};" />
      <div class="pName">
        {#if playerNum > 5}
          {pNames[5]}
        {:else}
          ...
        {/if}
      </div>
    </div>
  </div>
  <!-- <svelte:component this={DebugGoToMission} /> -->
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Road+Rage&display=swap');

  .waitingPlayers {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/join_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }

  .hostInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .codeTitle {
    font-size: 10vh;
    line-height: 12vh;
    color: white;
  }
  .gameCode {
    font-family: 'Road Rage', cursive;
    font-size: 35vh;
    line-height: 30vh;
    color: rgb(132, 216, 15);
    -webkit-text-stroke: 0.4vh white;
    text-shadow: 1vh 1vh 0px #373f3d;
  }
  .startGame {
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: 6vh;
    border-radius: 0px;
    border: 0.5vh solid #373f3d;
    box-shadow: 1vh 1vh 0px #373f3d;

    font-size: 8vh;
    color: white;
    background-color: rgb(132, 216, 15);
  }

  .joinedPlayers {
    width: 30vw;
    height: 65vh;
    margin-left: 14vw;
    padding: 5vh;
    background-color: #f4f9fa;
    border: 0.5vh solid #373f3d;
    box-shadow: 1vh 1vh 0px #373f3d;
    font-size: 5vh;
  }
  .player {
    display: flex;
    height: 10vh;
  }
  .pImage {
    width: 7vw;
    height: calc(var(--height) * 0.08 * 1px);
    margin-left: 1vw;
  }
  #player1 {
    background-image: url('../../images/player1.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player2 {
    background-image: url('../../images/player2.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player3 {
    background-image: url('../../images/player3.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player4 {
    background-image: url('../../images/player4.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player5 {
    background-image: url('../../images/player5.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player6 {
    background-image: url('../../images/player6.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .pName {
    width: 15vw;
  }
</style>
