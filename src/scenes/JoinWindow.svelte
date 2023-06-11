<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { PLAYER_NUMBER, ROLE, SOCKET } from '../stores';
  import WaitingPlayers from './emceeScenes/WaitingPlayers.svelte';
  import PreMissionOneTv from './emceeScenes/PreMissionOneTV.svelte';
  import PreMissionOne from './playerScenes/PreMissionOne.svelte';
  import { Socket } from 'socket.io-client';

  const dispatch = createEventDispatcher();
  let device = 'Device not identified';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (navigator.userAgent.match(/Android/i)) {
      device = 'Android';
    } else if (navigator.userAgent.match(/iPhone/i)) {
      device = 'iPhone';
    } else {
      device = 'You should be host';
      join_as_host();
    }
  });

  let session_id;
  let player_name;

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
      session_id: session_id,
      player_name: player_name,
    });

    socket.on('success_join_as_player', (msg) => {
      ROLE.set(1);
      console.log('here');
      PLAYER_NUMBER.set(msg.player_number);
      dispatch('changeScene', {
        new_scene: PreMissionOne,
      });
    });
  };
</script>

<div>
  <div class="joining">
    <div class="inputUnit">
      <div class="question">Game Code:</div>
      <div class="answer">
        <input class="inputbox" bind:value={session_id} />
      </div>
    </div>
    <div class="inputUnit">
      <div class="question">User Name:</div>
      <div class="answer">
        <input class="inputbox" bind:value={player_name} />
      </div>
    </div>
    <button class="joinBtn" on:click={join_as_player}> Join as player </button>
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
    font-size: 3vh;
  }
  .inputbox {
    width: 50vw;
    height: 6vh;
    font-size: 3vh;
    background-color: transparent;
    border: none;
    border-bottom: 0.5vh solid #373f3d;
  }
  .joinBtn {
    width: 50vw;
    height: 6vh;
    font-size: 3vh;
    margin-top: 5vh;

    background-color: #f4f9fa;

    border: 0.5vh solid #373f3d;
    border-radius: 0px;
    box-shadow: 0.5vh 0.5vh 0px #373f3d;

    display: flex;
    align-items: center;
    text-align: center;

    color: rgb(100, 166, 8);
  }
</style>
