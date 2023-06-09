<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import StepTV from '../../lib/StepTV.svelte';
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
  });
</script>

<div>
  <div>
    <StepTV {socket} ballSize={50} />
  </div>
  <svelte:component this={DebugGoToMission} />
</div>
