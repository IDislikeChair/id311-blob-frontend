<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { PLAYER_NUMBER, ROLE, SOCKET } from '../stores';
  import PreMissionOneTv from './emceeScenes/PreMissionOneTV.svelte';
  import { Socket } from 'socket.io-client';
  import PreMissionOne from './playerScenes/PreMissionOne.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });

  let session_id;
  let player_name;

  const join_as_host = () => {
    socket.emit('join_as', { role: 0 });

    socket.on('success_join_as_emcee', () => {
      ROLE.set(0);
      dispatch('changeScene', {
        new_scene: PreMissionOneTv,
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
  <div class="card" />
  <div class="card">
    <button on:click={join_as_host}> Join as host </button>
  </div>
  <div class="card">
    <input bind:value={session_id} />
    <input bind:value={player_name} />
    <button on:click={join_as_player}> Join as player </button>
  </div>
</div>
