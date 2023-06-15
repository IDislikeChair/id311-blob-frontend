<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { PLAYER_NUMBER, ROLE, SOCKET } from '../stores';
  import WaitingPlayers from './emceeScenes/WaitingPlayers.svelte';
  import ReadyBeforeStart from './playerScenes/ReadyBeforeStart.svelte';

  const dispatch = createEventDispatcher();

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (navigator.userAgent.match(/Android/i)) {
    } else if (navigator.userAgent.match(/iPhone/i)) {
    } else {
      join_as_host();
    }
  });

  let sessionId;
  let playerName;

  const join_as_host = () => {
    socket.emit('join_as', { role: 0 });

    socket.on('success_join_as_emcee', () => {
      ROLE.set(0);
      dispatch('changeScene', {
        new_scene: WaitingPlayers,
      });
    });

    socket.on('error', (error) => console.log(`Error: ${error}`));
  };

  const join_as_player = () => {
    socket.emit('join_as', {
      role: 1,
      sessionId: sessionId,
      playerName: playerName,
    });

    socket.on('success_join_as_player', (msg) => {
      ROLE.set(1);
      PLAYER_NUMBER.set(msg.player_number);
      dispatch('changeScene', {
        new_scene: ReadyBeforeStart,
      });
    });
  };
</script>

<div>
  <div class="joining">
    <div class="inputUnit">
      <div class="question">Enter Game Code:</div>
      <div class="answer">
        <input class="inputbox" bind:value={sessionId} />
      </div>
    </div>
    <div class="inputUnit">
      <div class="question">Enter Your Name:</div>
      <div class="answer">
        <input class="inputbox" bind:value={playerName} />
      </div>
    </div>
    <button class="joinBtn" on:click={join_as_player}> Join Game </button>
  </div>
</div>

<style>
  .joining {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../images/join_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
  .inputUnit {
    margin-bottom: 4vh;
  }
  .question {
    font-size: 3.5vh;
    color: white;
    font-weight: bolder;
  }
  .inputbox {
    width: 50vw;
    height: 6vh;
    font-size: 3vh;
    background-color: transparent;
    border: none;
    border-bottom: 0.5vh solid #373f3d;
    color: white;
    font-weight: bolder;
  }
  .joinBtn {
    width: 50vw;
    height: 7vh;
    font-size: 3.5vh;
    margin-top: 5vh;

    border: 0.5vh solid #373f3d;
    border-radius: 0px;
    box-shadow: 0.5vh 0.5vh 0px #373f3d;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: rgb(132, 216, 15);
    color: white;
  }
</style>
