<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { onMount } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let session_id;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.emit('get_session_id');

    socket.on('post_session_id', (id) => {
      console.log(id);
      session_id = id;
    });
  });

  const start = () => {
    socket.emit('on_next');
  };
</script>

<div class="preMissionTwoTVContainer">
  <div class="card">PreMissionTwoTV {session_id}</div>
  <button on:click={start}>start</button>
  <svelte:component this={DebugGoToMission} />
</div>

<style>
  .preMissionTwoTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    background-image: url('../../assets/mission2_pre.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
