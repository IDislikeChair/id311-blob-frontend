<script>
  import { SOCKET } from '../../stores';
  import { onMount } from 'svelte';
  import narration from '../../sounds/L3_Pre.mp3';

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });

  const start = () => {
    socket.emit('on_next');
  };
</script>

<audio src={narration} autoplay />

<div class="preMissionThreeTVContainer">
  <div class="missionCard" />
  <div class="nextBtn" on:click={start} />
</div>

<style>
  .preMissionThreeTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission3_background.png');
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
  }
  .missionCard {
    background-image: url('../../images/level3/tv_instructions_card.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 15 * 5);
    height: calc(1vw * 9 * 5);
  }
  .nextBtn {
    background-image: url('../../images/level3/tv_next.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 6 * 4);
    height: calc(1vw * 1.5 * 4);

    position: fixed;
    right: calc(1vw * 5 * 16 / 25);
    bottom: calc(1vw * 5 * 9 / 25);
  }
</style>
