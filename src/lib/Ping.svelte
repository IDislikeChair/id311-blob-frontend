<script>
  import { onDestroy, onMount } from 'svelte';
  import { SOCKET } from '../stores';

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let count = 0;

  $: onMount(async () => {
    socket.emit('getPingCount', (pingCount) => {
      count = pingCount;
    });

    socket.on('broadcastPingCount', (pingCount) => {
      count = pingCount;
    });
  });

  onDestroy(async () => {
    socket.off('broadcastPingCount');
  });

  const ping = () => {
    socket.emit('ping');
  };
</script>

<div>
  <div class="card" />
  <div class="card">
    <button on:click={ping}>
      Server was pinged {count}
      {count === 1 ? 'time' : 'times'}
    </button>
  </div>
</div>
