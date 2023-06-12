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

<div class="preMissionThreeTVContainer">
  <!-- <div class="card">PreMissionThreeTV {session_id}</div> -->
  <button class="startBtn" on:click={start}>NEXT</button>
  <svelte:component this={DebugGoToMission} />
</div>

<style>
  .preMissionThreeTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    background-image: url('../../images/mission3_pre.png');
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
  }

  .startBtn {
    display: flex;
    align-items: center;
    font-size: 2vw;

    position: fixed;
    right: 16vw;
    top: 9vw;

    border: 0.3vw solid #373f3d;
    border-radius: 0px;
    box-shadow: 0.3vw 0.3vw 0px #373f3d;
  }
</style>
