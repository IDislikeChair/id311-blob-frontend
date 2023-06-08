<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import PostMissionOneTv from './PostMissionOneTV.svelte';

  const dispatch = createEventDispatcher();

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

    socket.on('start_post_mission', () => {
      dispatch('changeScene', {
        new_scene: PostMissionOneTv,
      });
    });
  });

  let player_number;

  const join_as_host = () => {
    socket.emit('join_as', 0, null, null);
  };
</script>

<div>
  <div class="card">MissionOneTV {session_id}</div>
</div>
