<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import box_open from '../../images/box_open.png';
  import box_closed from '../../images/box_closed.png';
  import lock_active from '../../images/level2/lock_active.png';
  import lock_unlocked from '../../images/level2/lock_unlocked.png';
  import lock_pending from '../../images/level2/lock_pending.png';
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
  const playerSize = width / 10,
    boxSize = width / 7,
    lockSize = width / 17;
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
  });

  let alive = [];
  socket.on('broadcastState', (new_pairs) => {
    pairs = new_pairs;
    console.log(pairs);
    socket.emit('gotPairs');

    for (let i = 0; i < 2; i++) {
      alive.push(pairs[i].solverNumber);
      alive.push(pairs[i].guiderNumber);
    }
  });

  onDestroy(() => {
    socket.off('broadcastPlayerStatus');
    socket.off('broadcastState');
  });

  console.log(tilts);

  const images = {};
  const sketch = (p5) => {
    let boxOpenRatio, boxClosedRatio;

    p5.preload = function () {
      images['box'] = {};
      images['box']['open'] = p5.loadImage(box_open);
      images['box']['closed'] = p5.loadImage(box_closed);

      images['lock'] = {};
      images['lock']['active'] = p5.loadImage(lock_active);
      images['lock']['unlocked'] = p5.loadImage(lock_unlocked);
      images['lock']['pending'] = p5.loadImage(lock_pending);

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

      boxOpenRatio = images['box']['open'].height / images['box']['open'].width;
      boxClosedRatio =
        images['box']['closed'].height / images['box']['closed'].width;
    };

    p5.draw = function () {
      p5.clear();
      p5.noStroke();
      p5.imageMode(p5.CENTER);

      if (pairs.length == 0) return;

      for (let i = 0; i < 2; i++) {
        images['players'][pairs[i].solverNumber].size(playerSize, playerSize);
        images['players'][pairs[i].solverNumber].position(
          (width / 2) * i + playerSize + playerSize / 2,
          height * 0.7
        );

        images['players'][pairs[i].guiderNumber].size(playerSize, playerSize);
        images['players'][pairs[i].guiderNumber].position(
          (width / 2) * i + playerSize - playerSize / 2,
          height * 0.7
        );

        p5.image(
          images['box']['closed'],
          (width / 2) * i + playerSize * 3.5,
          height * 0.7,
          boxSize,
          boxSize * boxClosedRatio
        );

        p5.stroke('#787878');
        p5.strokeWeight(height / 80);
        p5.line(
          (width / 2) * i + playerSize,
          height * 0.5,
          (width / 2) * i + 3.5 * playerSize,
          height * 0.5
        );

        p5.image(
          images['lock']['active'],
          (width / 2) * i +
            playerSize +
            (pairs[i].lockState / 100) * 2.5 * playerSize,
          height * 0.5,
          lockSize,
          lockSize
        );
      }
      for (let i = 0; i < 6; i++) {
        if (!alive.includes(i)) images['players'][i].hide();
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
