<script>
  import { Socket } from 'socket.io-client';
  import { PLAYER_NAMES, SOCKET } from '../../stores';
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
  import target from '../../images/level3/target.gif';
  import heart_healthy from '../../images/level2/heart_healthy.png';
  import heart_dead from '../../images/level2/heart_dead.png';
  import { get } from 'svelte/store';
  import name_font from '../../fonts/VT323-Regular.ttf';
  import game_start from '../../sounds/game_start.mp3';
  import shoot from '../../sounds/shoot.mp3';

  const margin = 0;
  const width = window.innerWidth - margin,
    height = window.innerHeight - margin;

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  const GAME_TICK_TIME = 16;
  const MOVE_RATE = (0.5 * GAME_TICK_TIME) / 200;

  // Proxy class
  class TargetDummy {
    /**
     * @param {number} victimNumber
     */
    constructor(victimNumber) {
      this.victimNumber = victimNumber;
      this.victimHealthPoint = 5;

      this.cursorPosition = { x: 50, y: 50 };
      this.cursorMomentum = { x: 0, y: 0 };

      this.targetPosition = { x: NaN, y: NaN };
    }
  }

  /** @type {Object.<number, TargetDummy>} */
  let targetDummies;

  /** @type {[number, number]} */
  let lives = [3, 3];

  /** @type {number[]} */
  let alive = [];

  const calc_movement_tick = () => {
    if (targetDummies == undefined) return;

    for (let targetDummy of Object.values(targetDummies)) {
      // recalculate position by target's momentum.
      targetDummy.cursorPosition.x += targetDummy.cursorMomentum.x * MOVE_RATE;
      targetDummy.cursorPosition.y += targetDummy.cursorMomentum.y * MOVE_RATE;

      // limit range to from 0 to 99.
      if (targetDummy.cursorPosition.x < 0) targetDummy.cursorPosition.x = 0;
      if (targetDummy.cursorPosition.x > 99) targetDummy.cursorPosition.x = 99;
      if (targetDummy.cursorPosition.y < 0) targetDummy.cursorPosition.y = 0;
      if (targetDummy.cursorPosition.y > 99) targetDummy.cursorPosition.y = 99;
    }
  };

  const calcMovementTickInterval = setInterval(
    calc_movement_tick,
    GAME_TICK_TIME
  );

  let shootAudio;
  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastMission3State', (newTargetDummies) => {
      //   console.log(newTargetDummies);

      if (alive.length === 0) {
        alive = Object.keys(newTargetDummies).map((key) => parseInt(key));
      }

      targetDummies = newTargetDummies;
      lives = [
        targetDummies[0].victimHealthPoint,
        targetDummies[1].victimHealthPoint,
      ];
    });

    socket.on('shotSuccess', (playerNum) => {
      if (alive.length === 0) return;

      shootAudio.play();
      const victimNumber = targetDummies[alive[playerNum]].victimNumber;

      const spriteId = 'player' + (victimNumber + 1);

      document.getElementById(spriteId).style.filter = 'invert(100%)';
      setTimeout(() => {
        document.getElementById(spriteId).style.filter = 'invert(0%)';
      }, 100);
    });
  });

  onDestroy(() => {
    socket.off('broadcastMission3State');
    clearInterval(calcMovementTickInterval);
  });

  const images = {};
  const frameBuffers = {};
  let nameFont;

  const sketch = (p5) => {
    const targetBoundaryWidth = 0.4 * width;
    const targetBoundaryHeight = targetBoundaryWidth;
    const targetBoundaryLeft = (width / 2 - targetBoundaryWidth) / 2;
    const targetBoundaryTop = 0.05 * width;

    const flashLightSize = 0.1 * width;

    p5.preload = function () {
      images['background'] = p5.loadImage(background);

      images['player1'] = p5.loadImage(player1);
      images['player2'] = p5.loadImage(player2);
      images['player3'] = p5.loadImage(player3);
      images['player4'] = p5.loadImage(player4);
      images['player5'] = p5.loadImage(player5);
      images['player6'] = p5.loadImage(player6);

      images['target'] = p5.loadImage(target);

      images['heart'] = {};
      images['heart']['healthy'] = p5.loadImage(heart_healthy);
      images['heart']['dead'] = p5.loadImage(heart_dead);

      nameFont = p5.loadFont(name_font);
    };

    p5.setup = function () {
      p5.createCanvas(width, height);

      const frameBuffersWidth = width / 2;
      const frameBuffersHeight = height;

      frameBuffers['shadowGraphicsLeft'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );
      frameBuffers['shadowGraphicsRight'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );

      frameBuffers['targetGraphicLeft'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );
      frameBuffers['targetGraphicRight'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );

      frameBuffers['negativeMaskLeft'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );
      frameBuffers['negativeMaskRight'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );
      frameBuffers['positiveMaskLeft'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );
      frameBuffers['positiveMaskRight'] = p5.createGraphics(
        frameBuffersWidth,
        frameBuffersHeight
      );
    };

    p5.draw = function () {
      p5.clear();
      frameBuffers.shadowGraphicsLeft.clear();
      frameBuffers.shadowGraphicsRight.clear();
      frameBuffers.targetGraphicLeft.clear();
      frameBuffers.targetGraphicRight.clear();
      frameBuffers.negativeMaskLeft.clear();
      frameBuffers.negativeMaskRight.clear();
      frameBuffers.positiveMaskLeft.clear();
      frameBuffers.positiveMaskRight.clear();

      if (alive.length == 0) return;

      frameBuffers.shadowGraphicsLeft.fill('rgba(0,0,0,0.85)');
      frameBuffers.shadowGraphicsLeft.rect(0, 0, width / 2, height);

      frameBuffers.negativeMaskLeft.background(0);
      frameBuffers.negativeMaskLeft.erase();
      frameBuffers.negativeMaskLeft.noStroke();
      frameBuffers.negativeMaskLeft.fill(0);
      frameBuffers.negativeMaskLeft.ellipse(
        (targetBoundaryWidth / 100) * targetDummies[alive[0]].cursorPosition.x +
          targetBoundaryLeft,
        (targetBoundaryHeight / 100) *
          targetDummies[alive[0]].cursorPosition.y +
          targetBoundaryTop,

        flashLightSize,
        flashLightSize
      );

      const shadowOverlayLeft = frameBuffers.shadowGraphicsLeft.get();
      const negativeMaskImgLeft = frameBuffers.negativeMaskLeft.get();
      shadowOverlayLeft.mask(negativeMaskImgLeft);
      p5.image(shadowOverlayLeft, 0, 0);

      frameBuffers.targetGraphicLeft.image(
        images['target'],
        (targetBoundaryWidth / 100) * targetDummies[alive[0]].targetPosition.x +
          targetBoundaryLeft -
          0.5 * flashLightSize,
        (targetBoundaryHeight / 100) *
          targetDummies[alive[0]].targetPosition.y +
          targetBoundaryTop -
          0.5 * flashLightSize,
        flashLightSize,
        flashLightSize
      );

      frameBuffers.positiveMaskLeft.background('rgba(0,0,0,0)');
      frameBuffers.positiveMaskLeft.fill(0);
      frameBuffers.positiveMaskLeft.noStroke();
      frameBuffers.positiveMaskLeft.ellipse(
        targetBoundaryLeft +
          (targetBoundaryWidth / 100) *
            targetDummies[alive[0]].cursorPosition.x,
        targetBoundaryTop +
          (targetBoundaryHeight / 100) *
            targetDummies[alive[0]].cursorPosition.y,
        flashLightSize,
        flashLightSize
      );

      const targetLeft = frameBuffers.targetGraphicLeft.get();
      const positiveMaskImgLeft = frameBuffers.positiveMaskLeft.get();

      targetLeft.mask(positiveMaskImgLeft);

      p5.image(targetLeft, 0, 0);

      frameBuffers.shadowGraphicsRight.fill('rgba(0,0,0,0.85)');
      frameBuffers.shadowGraphicsRight.rect(0, 0, width / 2, height);

      frameBuffers.negativeMaskRight.background(0);
      frameBuffers.negativeMaskRight.erase();
      frameBuffers.negativeMaskRight.noStroke();
      frameBuffers.negativeMaskRight.ellipse(
        (targetBoundaryWidth / 100) * targetDummies[alive[1]].cursorPosition.x +
          targetBoundaryLeft,
        (targetBoundaryHeight / 100) *
          targetDummies[alive[1]].cursorPosition.y +
          targetBoundaryTop,

        flashLightSize,
        flashLightSize
      );

      const shadowOverlayRight = frameBuffers.shadowGraphicsRight.get();
      const negativeMaskImgRight = frameBuffers.negativeMaskRight.get();

      shadowOverlayRight.mask(negativeMaskImgRight);

      p5.image(shadowOverlayRight, width / 2, 0);

      frameBuffers.targetGraphicRight.image(
        images['target'],
        (targetBoundaryWidth / 100) * targetDummies[alive[1]].targetPosition.x +
          targetBoundaryLeft -
          0.5 * flashLightSize,
        (targetBoundaryHeight / 100) *
          targetDummies[alive[1]].targetPosition.y +
          targetBoundaryTop -
          0.5 * flashLightSize,
        flashLightSize,
        flashLightSize
      );

      frameBuffers.positiveMaskRight.background('rgba(0,0,0,0)');
      frameBuffers.positiveMaskRight.fill(0);
      frameBuffers.positiveMaskRight.noStroke();
      frameBuffers.positiveMaskRight.ellipse(
        targetBoundaryLeft +
          (targetBoundaryWidth / 100) *
            targetDummies[alive[1]].cursorPosition.x,
        targetBoundaryTop +
          (targetBoundaryHeight / 100) *
            targetDummies[alive[1]].cursorPosition.y,
        flashLightSize,
        flashLightSize
      );

      const targetRight = frameBuffers.targetGraphicRight.get();
      const positiveMaskImgRight = frameBuffers.positiveMaskRight.get();

      targetRight.mask(positiveMaskImgRight);

      p5.image(targetRight, width / 2, 0);

      p5.noFill();
      p5.stroke(64);
      p5.strokeWeight(5);
      p5.rect(
        targetBoundaryLeft,
        targetBoundaryTop,
        targetBoundaryWidth,
        targetBoundaryHeight
      );
      p5.rect(
        targetBoundaryLeft + width / 2,
        targetBoundaryTop,
        targetBoundaryWidth,
        targetBoundaryHeight
      );

      for (let i = 0; i < 2; i++) {
        const liveCount = lives[i];

        for (let lifeNumber = 0; lifeNumber < liveCount; lifeNumber++) {
          p5.image(
            images.heart.healthy,
            (i * width) / 2 +
              0.5 * width -
              (3 - lifeNumber) * 0.04 * width -
              targetBoundaryLeft,
            1 * targetBoundaryTop + targetBoundaryHeight,
            0.05 * width,
            0.05 * width
          );
        }

        for (let lifeNumber = liveCount; lifeNumber < 3; lifeNumber++) {
          p5.image(
            images.heart.dead,
            (i * width) / 2 +
              0.5 * width -
              (3 - lifeNumber) * 0.04 * width -
              targetBoundaryLeft,
            1 * targetBoundaryTop + targetBoundaryHeight,
            0.05 * width,
            0.05 * width
          );
        }

        p5.noStroke();
        p5.fill(200);
        p5.textSize(60);
        p5.textFont(nameFont);
        p5.textAlign(p5.LEFT, p5.BOTTOM);
        p5.text(
          `${get(PLAYER_NAMES)[0]}'s screen`,
          targetBoundaryLeft,
          0.9 * targetBoundaryTop
        );
        p5.text(
          `${get(PLAYER_NAMES)[1]}'s screen`,
          0.5 * width + targetBoundaryLeft,
          0.9 * targetBoundaryTop
        );

        p5.fill(255);
        p5.textSize(48);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text(
          `${get(PLAYER_NAMES)[1]}'s HP`,
          targetBoundaryLeft,
          1.5 * targetBoundaryTop + targetBoundaryHeight
        );
        p5.text(
          `${get(PLAYER_NAMES)[0]}'s HP`,
          0.5 * width + targetBoundaryLeft,
          1.5 * targetBoundaryTop + targetBoundaryHeight
        );
      }
    };
  };
</script>

<audio src={game_start} autoplay />
<audio src={shoot} bind:this={shootAudio} />

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
  <button
    on:click={() => {
      socket.emit('on_next');
    }}
  />
</div>

<audio src={game_start} autoplay />
<audio src={shoot} bind:this={shootAudio} />

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
