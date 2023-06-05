<script>
  import { onMount } from 'svelte';
  import io from 'socket.io-client';
  import Step from './lib/Step.svelte';
  import Lock from './lib/Lock.svelte';
  import { SOCKET } from './stores';

  let socket;
  let status = 'NONE';

  onMount(async () => {
    // socket = io('https://blob-backend.herokuapp.com');
    socket = io('http://192.168.0.2:3000');
    SOCKET.set(socket);

    socket.on('connect', () => {
      console.log('connected');
      status = 'CONNECTED';
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
  <!-- <h3>Server Connection: {status}</h3> -->
  <div>
    <Step {socket} />
    <!-- <Lock {socket} /> -->
  </div>
</main>

<style>
</style>
