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

<div class="preMissionOneTVContainer">
  <!-- <div class="card">PreMissionOneTV {session_id}</div> -->
  <button class="startBtn" on:click={start}>NEXT</button>
  <svelte:component this={DebugGoToMission} />
</div>

<style>
  .preMissionOneTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    background-image: url('../../../docs/images/mission1_pre.png');
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
  }
  .startBtn {
    display: flex;
    align-items: center;
    font-size: 3vh;

    position: fixed;
    right: 15vw;
    bottom: 18vh;

    border: 0.5vh solid #373f3d;
    border-radius: 0px;
    box-shadow: 0.5vh 0.5vh 0px #373f3d;
  }
</style>
