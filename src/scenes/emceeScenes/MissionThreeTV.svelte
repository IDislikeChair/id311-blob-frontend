<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import boat from '../../images/boat.png';
  import player1 from '../../images/sprites/player1.gif';
  import player2 from '../../images/sprites/player2.gif';
  import player3 from '../../images/sprites/player3.gif';
  import player4 from '../../images/sprites/player4.gif';
  import player5 from '../../images/sprites/player5.gif';
  import player6 from '../../images/sprites/player6.gif';
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

  let alive = [];
  let targets = {};

  socket.on('broadcastState', (new_targets) => {
    targets = new_targets;
    alive = Object.keys(targets);
    console.log('broadcastState mission3', targets);
  });

  console.log('HERE mission3');

  onDestroy(() => {
    socket.off('broadcastPlayerStatus');
    socket.off('broadcastState');
  });

  const images = {};
  const sketch = (p5) => {
    p5.preload = function () {
      images['players'] = [];
      images['players'].push(p5.createImg(player1));
      images['players'].push(p5.createImg(player2));
      images['players'].push(p5.createImg(player3));
      images['players'].push(p5.createImg(player4));
      images['players'].push(p5.createImg(player5));
      images['players'].push(p5.createImg(player6));
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
