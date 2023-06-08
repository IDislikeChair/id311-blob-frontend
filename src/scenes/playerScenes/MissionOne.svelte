<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import PostMissionOne from './PostMissionOne.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let player_number;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('get_mission_result', () => {
      socket.emit('post_mission_result', player_number);
    });

    socket.on('start_post_mission', () => {
      dispatch('changeScene', {
        new_scene: PostMissionOne,
      });
    });
  });
</script>

<div>
  <div class="card">
    <input bind:value={player_number} />
  </div>
</div>
