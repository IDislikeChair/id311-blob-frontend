<script>
  import { onMount } from 'svelte';
  import io from 'socket.io-client';
  import { SOCKET } from './stores';
  import JoinWindow from './scenes/JoinWindow.svelte';

  let socket;
  let current_scene;

  current_scene = JoinWindow;

  onMount(async () => {
    socket = io('https://blob-backend.herokuapp.com');
    // For local dev:
    // socket = io('http://localhost:3000');

    SOCKET.set(socket);

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('message', (message) => {
      console.log(message);
    });
  });

  function change_scene(event) {
    current_scene = event.detail.new_scene;
  }
</script>

<main>
  <svelte:component
    this={current_scene}
    on:changeScene={(e) => change_scene(e)}
  />
</main>
