<script>
  import { PLAYER_NAMES, SOCKET } from '../../stores';
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import P5 from 'p5-svelte';
  import game_start from '../../sounds/game_start.mp3';

  import boat from '../../images/boat.png';
  import player1 from '../../images/sprites/player1_back.gif';
  import player2 from '../../images/sprites/player2_back.gif';
  import player3 from '../../images/sprites/player3_back.gif';
  import player4 from '../../images/sprites/player4_back.gif';
  import player5 from '../../images/sprites/player5_back.gif';
  import player6 from '../../images/sprites/player6_back.gif';

  const margin = 10;
  const width = window.innerWidth - margin;
  const height = window.innerHeight - margin;
  const playerSize = width / 16;
  const boatSize = playerSize * 2.5;
  const stepAmount = height / 200;

  let stepCounts = [];
  const reachedPlayers = [];

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastStepCounts', (newStepCounts) => {
      stepCounts = newStepCounts;
    });
  });

  onDestroy(() => {
    socket.off('broadcastStepCounts');
  });

  const images = {};
  const sketch = (p5) => {
    let boatRatio, lineYPos;

    p5.preload = function () {
      images['boat'] = p5.loadImage(boat);
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
        }
        socket.emit('playersReach', reachedPlayers);
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
          images['players'][player_number].size(playerSize, playerSize);
          images['players'][player_number].position(
            (width / 3) * (Math.floor(rank / 2) + 1) +
              (coeffe * playerSize) / 1.5 -
              playerSize / 2.5,
            boatSize * boatRatio * 0.45
          );

          p5.noStroke();
          p5.fill('#000000');
          p5.text(
            pName,
            (width / 3) * (Math.floor(rank / 2) + 1) +
              (coeffe * playerSize) / 1.5 +
              playerSize / 15,
            boatSize * boatRatio * 0.75 - playerSize / 2.5
          );
        } else {
          p5.imageMode(p5.CENTER);

          images['players'][player_number].size(playerSize, playerSize);
          images['players'][player_number].position(
            (width / 7) * (player_number + 1) - playerSize / 2,
            height -
              playerSize * 1.5 -
              (stepCounts[player_number] ?? 0) * stepAmount
          );

          p5.noStroke();
          p5.fill('#000000');
          p5.text(
            pName,
            (width / 7) * (player_number + 1),
            height -
              playerSize * 1.6 -
              (stepCounts[player_number] ?? 0) * stepAmount
          );
        }
      }
    };
  };
</script>

<audio src={game_start} autoplay />

<div class="missionOneTVContainer">
  <P5 {sketch} />
  <button
    on:click={() => {
      socket.emit('on_next');
    }}
  />
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
