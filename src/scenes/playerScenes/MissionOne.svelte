<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NUMBER, SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import PostMissionOne from './PostMissionOne.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let player_number;
  PLAYER_NUMBER.subscribe((value) => {
    player_number = value;
  });

  let result;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('get_mission_result', () => {
      socket.emit('post_mission_result', {
        player_number: player_number,
        stepCount: result,
      });
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
    <input bind:value={result} />
  </div>
</div>
