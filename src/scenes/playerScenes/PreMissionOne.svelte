<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import MissionOne from './MissionOne.svelte';

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
        new_scene: MissionOne,
      });
    });
  });
</script>

<div>
  <div class="card">PreMissionOne</div>
</div>
