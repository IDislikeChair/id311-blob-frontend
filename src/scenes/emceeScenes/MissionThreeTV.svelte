<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import boat from '../../images/boat.png';
  import player1 from '../../images/player1.png';
  import player2 from '../../images/player2.png';
  import player3 from '../../images/player3.png';
  import player4 from '../../images/player4.png';
  import player5 from '../../images/player5.png';
  import player6 from '../../images/player6.png';
  DebugGoToMission;

  const margin = 10;
  const width = window.innerWidth - margin,
    height = window.innerHeight - margin;
  const playerSize = width / 16;
  const steps = {};

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastPlayerStatus', (stepCount) => {
      for (let socketID of Object.keys(stepCount)) {
        steps[stepCount[socketID].pName] = stepCount[socketID].steps;
      }
    });
  });

  onDestroy(() => {
    socket.off('broadcastPlayerStatus');
  });

  const images = {};
  const sketch = (p5) => {
    p5.preload = function () {
      images['players'] = [];
      images['players'].push(p5.loadImage(player1));
      images['players'].push(p5.loadImage(player2));
      images['players'].push(p5.loadImage(player3));
      images['players'].push(p5.loadImage(player4));
      images['players'].push(p5.loadImage(player5));
      images['players'].push(p5.loadImage(player6));
    };

    p5.setup = function () {
      p5.createCanvas(width, height);
    };

    p5.draw = function () {
      p5.clear();
    };
  };
</script>

<div class="missionThreeTVContainer">
  <P5 {sketch} />
</div>

<style>
  .missionThreeTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    /* margin-top: 4px; */

    background-image: url('../../images/mission3_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
