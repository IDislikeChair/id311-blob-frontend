<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../../stores';
  import { onMount } from 'svelte';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let ding = 'No ding';

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('alertAnswer', () => {
      doDing();
    });
  });

  function doDing() {
    ding = 'Ding!';
    setTimeout(() => {
      ding = 'No ding';
    }, 1000);
  }
</script>

<div class="stepClientContainer" style="--innerHeight:{innerHeight};">
  <div class="clientTitle">Ding status: {ding}</div>
</div>

<style>
  .stepClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission2_background.png');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }
  .clientTitle {
    text-align: center;
    width: 70vw;
    font-size: 10vw;
    line-height: 10vw;

    margin-bottom: 5vh;
    color: #e9e9e9;
  }
</style>
