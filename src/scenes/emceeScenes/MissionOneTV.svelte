<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  DebugGoToMission;

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // socket.on(...)
  });
</script>

<div>
  <div class="card">MissionOneTV</div>
  <svelte:component this={DebugGoToMission} />
</div>
