<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import box_open from '../../assets/box_open.png';
  import box_closed from '../../assets/box_closed.png';
  import player1 from '../../assets/player1.png';
  import player2 from '../../assets/player2.png';
  import player3 from '../../assets/player3.png';
  import player4 from '../../assets/player4.png';
  import player5 from '../../assets/player5.png';
  import player6 from '../../assets/player6.png';
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

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastPlayerStatus', (players) => {
      for (let socketID of Object.keys(players)) {
        if (!players[socketID].alive) continue;
        if (tilts[players[socketID].pName]) {
          tilts[players[socketID].pName] += players[socketID].tilts;

          if (tilts[players[socketID].pName] < 0)
            tilts[players[socketID].pName] = 0;
          else if (tilts[players[socketID].pName] > width - 2 * playerSize)
            tilts[players[socketID].pName] = width - 2 * playerSize;
        } else {
          tilts[players[socketID].pName] = width / 2;
        }
      }
      //   console.log(tilts);
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

      const curPlayers = Object.keys(tilts).length;
      for (let i = 0; i < curPlayers; i++) {
        const pRatio = images['players'][i].height / images['players'][i].width;
        const pName = Object.keys(tilts)[i];

        p5.imageMode(p5.CORNER);
        p5.image(
          images['players'][i],
          tilts[pName],
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

    background-image: url('../../assets/mission2_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
