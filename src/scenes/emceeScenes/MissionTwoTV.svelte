<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import box_open from '../../images/box_open.png';
  import box_closed from '../../images/box_closed.png';
  import player1 from '../../images/sprites/player1_side.gif';
  import player2 from '../../images/sprites/player2_side.gif';
  import player3 from '../../images/sprites/player3_side.gif';
  import player4 from '../../images/sprites/player4_side.gif';
  import player5 from '../../images/sprites/player5_side.gif';
  import player6 from '../../images/sprites/player6_side.gif';
  DebugGoToMission;

  const margin = 10;
  const width = window.innerWidth - margin,
    height = window.innerHeight - margin;
  const playerSize = width / 10;
  const tilts = {};

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let pairs = [];
  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastState', (new_pairs) => {
      console.log(new_pairs);
      pairs = new_pairs;
    });
  });

  onDestroy(() => {
    socket.off('broadcastPlayerStatus');
  });

  console.log(tilts);

  const images = {};
  const sketch = (p5) => {
    let boxOpenRatio, boxClosedRatio;

    p5.preload = function () {
      images['box'] = {};
      images['box']['open'] = p5.loadImage(box_open);
      images['box']['closed'] = p5.loadImage(box_closed);
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

      boxOpenRatio = images['box']['open'].height / images['box']['open'].width;
      boxClosedRatio =
        images['box']['closed'].height / images['box']['closed'].width;
    };

    p5.draw = function () {
      p5.clear();
      p5.noStroke();

      for (let pair of pairs) {
        const pRatio =
          images['players'][pair.solverNumber ?? 0].height /
          images['players'][pair.solverNumber ?? 0].width;

        p5.imageMode(p5.CORNER);
        p5.image(
          images['players'][pair.solverNumber],
          width / 2 + (pair.lockState * width) / 100 / 3 - playerSize / 2,
          height / 2,
          playerSize,
          playerSize * pRatio
        );
      }
    };
  };
</script>

<div class="missionTwoTVContainer">
  <P5 {sketch} />
</div>

<style>
  .missionTwoTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    background-image: url('../../images/mission2_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
