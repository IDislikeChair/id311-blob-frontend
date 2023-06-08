<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import MissionOneTV from './MissionOneTV.svelte';

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

    socket.on('start_mission', () => {
      dispatch('changeScene', {
        new_scene: MissionOneTV,
      });
    });
  });

  const start_mission_one = () => {
    socket.emit('start_mission_one');
  };
</script>

<div>
  <div class="card">PreMissionOneTV</div>
  <button on:click={start_mission_one} />
</div>
