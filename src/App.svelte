<script>
  import { onMount } from 'svelte';
  import io from 'socket.io-client';
  import Ping from './lib/Ping.svelte';
  import { SOCKET } from './stores';

  let socket;

  onMount(async () => {
    socket = io('https://blob-backend.herokuapp.com');
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
</script>

<main>
  <div class="card">
    <Ping />
  </div>
</main>
