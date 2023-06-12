<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NAMES, SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import { get } from 'svelte/store';
  import P5 from 'p5-svelte';

  import boat from '../../images/boat.png';
  import player1 from '../../images/player1.png';
  import player2 from '../../images/player2.png';
  import player3 from '../../images/player3.png';
  import player4 from '../../images/player4.png';
  import player5 from '../../images/player5.png';
  import player6 from '../../images/player6.png';
  DebugGoToMission;

  // Rendering-related
  const margin = 10;
  const width = window.innerWidth - margin;
  const height = window.innerHeight - margin;
  const playerSize = width / 16,
    boatSize = playerSize * 2.5;
  const stepAmount = height / 100;

  //  Logic-related
  /**
   * @type {number[]}
   */
  let stepCounts = [];
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

    socket.on('broadcastStepCounts', (new_player_step_counts) => {
      console.log(new_player_step_counts);
      stepCounts = new_player_step_counts;
    });
  });

  onDestroy(() => {
    socket.off('broadcastPlayerStatus');
  });

  console.log(stepCounts);

  const images = {};
  const sketch = (p5) => {
    let newFont, boatRatio, lineYPos;

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

      for (let player_number = 0; player_number < 6; player_number++) {
        if (reachedPlayers.includes(player_number)) continue;
        if (
          height - playerSize - stepCounts[player_number] * stepAmount <=
          playerSize * 2.5 * boatRatio + playerSize
        ) {
          reachedPlayers.push(player_number);
          socket.emit('playersReach', reachedPlayers);
        }
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

      for (let player_number = 0; player_number < 6; player_number++) {
        const pRatio =
          images['players'][player_number].height /
          images['players'][player_number].width;
        p5.textFont('Courier New');
        p5.textSize(playerSize / 3.5);
        p5.textAlign(p5.CENTER);
        p5.textStyle(p5.BOLD);
        const pName = get(PLAYER_NAMES)[player_number];

        if (reachedPlayers.includes(player_number)) {
          let coeffe = -1,
            rank = reachedPlayers.indexOf(player_number);
          if (rank % 2) coeffe = 1;
          p5.imageMode(p5.CENTER);
          p5.image(
            images['players'][player_number],
            (width / 3) * (Math.floor(rank / 2) + 1) +
              (coeffe * playerSize) / 1.8,
            boatSize * boatRatio * 0.75,
            playerSize,
            playerSize * pRatio
          );

          p5.noStroke();
          p5.fill('#000000');
          p5.text(
            pName,
            (width / 3) * (Math.floor(rank / 2) + 1) +
              (coeffe * playerSize) / 1.8,
            boatSize * boatRatio * 0.75 - playerSize / 2.5
          );
        } else {
          p5.imageMode(p5.CENTER);
          p5.image(
            images['players'][player_number],
            (width / 7) * (player_number + 1),
            height - playerSize - (stepCounts[player_number] ?? 0) * stepAmount,
            playerSize,
            playerSize * pRatio
          );

          p5.noStroke();
          p5.fill('#000000');
          p5.text(
            pName,
            (width / 7) * (player_number + 1),
            height -
              playerSize -
              (stepCounts[player_number] ?? 0) * stepAmount -
              playerSize / 2.5
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

    background-image: url('../../images/mission1_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
