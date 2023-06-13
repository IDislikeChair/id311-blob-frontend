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
  import heart_healthy from '../../images/level2/heart_healthy.png';
  import heart_dead from '../../images/level2/heart_dead.png';
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
  let saved_unlock_positions = [[], []];

  socket.on('broadcastState', (new_pairs) => {
    pairs = new_pairs;
    console.log(pairs);
    socket.emit('gotPairs');

    for (let i = 0; i < 2; i++) {
      alive.push(pairs[i].solverNumber);
      alive.push(pairs[i].guiderNumber);
    }
  });

  socket.on('submitAnswerSuccess', (pairNumber) => {
    saved_unlock_positions[pairNumber].push(pairs[pairNumber].lockState);
  });

  socket.on('submitAnswerFail', (pairNumber) => {
    // TODO: give feedback to the player
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

      images['heart'] = {};
      images['heart']['healthy'] = p5.loadImage(heart_healthy);
      images['heart']['dead'] = p5.loadImage(heart_dead);
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
          height * 0.72,
          boxSize,
          boxSize * boxClosedRatio
        );

        for (
          let unlockNumber = 0;
          unlockNumber < pairs[i].score;
          unlockNumber++
        ) {
          p5.stroke('#3D3D3D');
          p5.strokeWeight(height / 80);
          p5.line(
            (width / 2) * i + playerSize,
            height * 0.55 - 1.2 * lockSize * (unlockNumber + 1),
            (width / 2) * i + 3.5 * playerSize,
            height * 0.55 - 1.2 * lockSize * (unlockNumber + 1)
          );

          p5.image(
            images['lock']['unlocked'],
            (width / 2) * i +
              playerSize +
              (saved_unlock_positions[i][unlockNumber] / 100) *
                2.5 *
                playerSize,
            height * 0.55 - 1.2 * lockSize * (unlockNumber + 1),
            lockSize,
            lockSize
          );
        }

        p5.stroke('#3D3D3D');
        p5.strokeWeight(height / 80);
        p5.line(
          (width / 2) * i + playerSize,
          height * 0.55,
          (width / 2) * i + 3.5 * playerSize,
          height * 0.55
        );

        p5.image(
          images['lock']['active'],
          (width / 2) * i +
            playerSize +
            (pairs[i].lockState / 100) * 2.5 * playerSize,
          height * 0.55,
          lockSize,
          lockSize
        );

        for (
          let pendingNumber = pairs[i].score + 1;
          pendingNumber < 3;
          pendingNumber++
        ) {
          p5.stroke('#3D3D3D');
          p5.strokeWeight(height / 80);
          p5.line(
            (width / 2) * i + playerSize,
            height * 0.55 - 1.2 * lockSize * pendingNumber,
            (width / 2) * i + 3.5 * playerSize,
            height * 0.55 - 1.2 * lockSize * pendingNumber
          );

          p5.image(
            images['lock']['pending'],
            (width / 2) * i + playerSize + 0.5 * 2.5 * playerSize,
            height * 0.55 - 1.2 * lockSize * pendingNumber,
            lockSize,
            lockSize
          );
        }
        for (let lifeNumber = 0; lifeNumber < pairs[i].lifeLeft; lifeNumber++) {
          p5.image(
            images['heart']['healthy'],
            (width / 2) * i + 2.25 * playerSize + (lifeNumber - 2) * lockSize,
            height * 0.15,
            1.5 * lockSize,
            1.5 * lockSize
          );
        }

        for (let lifeNumber = pairs[i].lifeLeft; lifeNumber < 5; lifeNumber++) {
          p5.image(
            images['heart']['dead'],
            (width / 2) * i + 2.25 * playerSize + (lifeNumber - 2) * lockSize,
            height * 0.15,
            1.5 * lockSize,
            1.5 * lockSize
          );
        }
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
