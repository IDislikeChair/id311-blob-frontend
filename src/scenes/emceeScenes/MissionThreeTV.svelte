<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';
  import P5 from 'p5-svelte';

  import background from '../../images/mission3_background.png';
  import player1 from '../../images/sprites/player1.gif';
  import player2 from '../../images/sprites/player2.gif';
  import player3 from '../../images/sprites/player3.gif';
  import player4 from '../../images/sprites/player4.gif';
  import player5 from '../../images/sprites/player5.gif';
  import player6 from '../../images/sprites/player6.gif';
  DebugGoToMission;

  const margin = 0;
  const width = window.innerWidth - margin,
    height = window.innerHeight - margin;
  const playerSize = width / 3.5;
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

    // socket.on('broadcastPlayerStatus', (stepCount) => {
    //   for (let socketID of Object.keys(stepCount)) {
    //     steps[stepCount[socketID].pName] = stepCount[socketID].steps;
    //   }
    // });
  });

  let alive = [];
  let targets = {};

  socket.on('broadcastState', (new_targets) => {
    if (Array.isArray(new_targets)) return;
    targets = new_targets;
    if (alive.length == 0)
      alive = Object.keys(targets).map((str) => Number(str));
    // console.log('broadcastState mission3', new_targets);
  });

  onDestroy(() => {
    // socket.off('broadcastPlayerStatus');
    socket.off('broadcastState');
  });

  const images = {};
  const sketch = (p5) => {
    p5.preload = function () {
      images['background'] = p5.loadImage(background);

      images['player1'] = p5.loadImage(player1);
      images['player2'] = p5.loadImage(player2);
      images['player3'] = p5.loadImage(player3);
      images['player4'] = p5.loadImage(player4);
      images['player5'] = p5.loadImage(player5);
      images['player6'] = p5.loadImage(player6);
    };

    p5.setup = function () {
      p5.createCanvas(width, height);
    };

    p5.draw = function () {
      p5.clear();
      if (alive.length == 0) return;

      const halfScreen = p5.createGraphics(width / 2, height);
      halfScreen.fill('rgba(0,0,0,0.85)');
      halfScreen.rect(0, 0, width / 2, height);

      const mask = p5.createGraphics(width / 2, height);
      mask.background(0);
      mask.erase();
      mask.noStroke();
      mask.ellipse(
        (mask.width / 100) * targets[alive[0]]['x'],
        (mask.height / 100) * targets[alive[0]]['y'],
        mask.width / 5,
        mask.width / 5
      );

      const halfImage = halfScreen.get();
      const maskImg = mask.get();

      halfImage.mask(maskImg);

      p5.image(halfImage, 0, 0);

      const halfScreen2 = p5.createGraphics(width / 2, height);
      halfScreen2.fill('rgba(0,0,0,0.85)');
      halfScreen2.rect(0, 0, width / 2, height);

      const mask2 = p5.createGraphics(width / 2, height);
      mask2.background(0);
      mask2.erase();
      mask2.noStroke();
      mask2.ellipse(
        (mask2.width / 100) * targets[alive[1]]['x'],
        (mask2.height / 100) * targets[alive[1]]['y'],
        mask2.width / 5,
        mask2.width / 5
      );

      const halfImage2 = halfScreen2.get();
      const maskImg2 = mask2.get();

      halfImage2.mask(maskImg2);

      p5.image(halfImage2, width / 2, 0);
    };
  };
</script>

<div class="missionThreeTVContainer">
  <div>
    <div
      class="P1"
      id={'player' + (alive[1] + 1)}
      style="--width:{window.innerWidth};"
    />
  </div>
  <div>
    <div
      class="P2"
      id={'player' + (alive[0] + 1)}
      style="--width:{window.innerWidth};"
    />
  </div>
  <div class="lights">
    <P5 {sketch} />
  </div>
</div>

<style>
  .missionThreeTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    z-index: 0;
    background-image: url('../../images/mission3_background.png');
    background-size: cover;
    width: 100vw;
    height: 100vh;
  }
  .lights {
    z-index: 100;
  }

  .P1 {
    width: calc(var(--width) * 0.35 * 1px);
    height: calc(var(--width) * 0.35 * 1px);

    position: absolute;
    left: calc(var(--width) * 0.08 * 1px);
    top: calc(var(--width) * 0.1 * 1px);
    z-index: 1;
  }
  .P2 {
    width: calc(var(--width) * 0.35 * 1px);
    height: calc(var(--width) * 0.35 * 1px);

    position: absolute;
    left: calc(var(--width) * 0.58 * 1px);
    top: calc(var(--width) * 0.1 * 1px);
    z-index: 1;
  }

  #player1 {
    background-image: url('../../images/sprites/player1.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player2 {
    background-image: url('../../images/sprites/player2.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player3 {
    background-image: url('../../images/sprites/player3.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player4 {
    background-image: url('../../images/sprites/player4.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player5 {
    background-image: url('../../images/sprites/player5.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
  #player6 {
    background-image: url('../../images/sprites/player6.gif');
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
