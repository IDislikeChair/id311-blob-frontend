<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import boat from '../../../docs/assets/boat.png';
  import player1 from '../../../docs/assets/player1.png';
  import player2 from '../../../docs/assets/player2.png';
  import player3 from '../../../docs/assets/player3.png';
  import player4 from '../../../docs/assets/player4.png';
  import player5 from '../../../docs/assets/player5.png';
  import player6 from '../../../docs/assets/player6.png';
  DebugGoToMission;

  const margin = 10;
  const width = window.innerWidth - margin,
    height = window.innerHeight - margin;
  const playerSize = width / 16,
    boatSize = playerSize * 2.5;
  const stepAmout = height / 100;
  const steps = {};
  const reachedPlayers = [];

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastStepCount', (stepCount) => {
      for (let socketID of Object.keys(stepCount)) {
        steps[stepCount[socketID].pName] = stepCount[socketID].steps;
      }
    });
  });

  onDestroy(() => {
    socket.off('broadcastStepCount');
  });

  console.log(steps);

  const images = {};
  const sketch = (p5) => {
    let bgRatio, boatRatio, lineYPos;

    p5.preload = function () {
      images['boat'] = p5.loadImage(boat);
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

      boatRatio = images['boat'].height / images['boat'].width;
      lineYPos = playerSize * 2.5 * boatRatio + playerSize;
    };

    p5.draw = function () {
      p5.clear();
      p5.noStroke();

      for (let player of Object.keys(steps)) {
        if (reachedPlayers.includes(player)) continue;
        if (
          height - playerSize - steps[player] * stepAmout <=
          playerSize * 2.5 * boatRatio + playerSize
        )
          reachedPlayers.push(player);
      }

      p5.imageMode(p5.CENTER);

      for (let i = 0; i < 2; i++) {
        p5.image(
          images['boat'],
          (width / 3) * (i + 1),
          boatSize * boatRatio,
          boatSize,
          boatSize * boatRatio
        );
      }

      p5.stroke('#DD6363');
      p5.strokeWeight(height / 100);
      p5.drawingContext.setLineDash([width / 100, width / 70]);
      p5.line(0, lineYPos, width, lineYPos);

      const curPlayers = Object.keys(steps).length;
      for (let i = 0; i < curPlayers; i++) {
        const pRatio = images['players'][i].height / images['players'][i].width;
        const pName = Object.keys(steps)[i];

        if (reachedPlayers.includes(pName)) {
          let coeffe = -1,
            rank = reachedPlayers.indexOf(pName);
          if (rank % 2) coeffe = 1;
          p5.imageMode(p5.CENTER);
          p5.image(
            images['players'][i],
            (width / 3) * (Math.floor(rank / 2) + 1) +
              (coeffe * playerSize) / 1.8,
            boatSize * boatRatio * 0.75,
            playerSize,
            playerSize * pRatio
          );
        } else {
          p5.imageMode(p5.CORNER);
          p5.image(
            images['players'][i],
            (width / (curPlayers + 1)) * (i + 1),
            height - playerSize - steps[pName] * stepAmout,
            playerSize,
            playerSize * pRatio
          );
        }
      }
    };
  };
</script>

<div class="missionOneTVContainer">
  <P5 {sketch} />
</div>

<style>
  .missionOneTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    /* margin-top: 4px; */

    background-image: url('../../../docs/assets/mission1_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
