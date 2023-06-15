<script>
  import { onMount } from 'svelte';
  import P5 from 'p5-svelte';

  import background from '../../images/ending_background.png';
  import credits from '../../images/credits.png';
  import thankyou from '../../images/thank_you.png';
  import player1 from '../../images/sprites/player1_side.gif';
  import player2 from '../../images/sprites/player2_side.gif';
  import player3 from '../../images/sprites/player3_side.gif';
  import player4 from '../../images/sprites/player4_side.gif';
  import player5 from '../../images/sprites/player5_side.gif';
  import player6 from '../../images/sprites/player6_side.gif';

  $: onMount(async () => {});

  // Rendering-related
  const width = window.innerWidth;
  const height = window.innerHeight;
  const playerSize = width / 16;
  const scrollSpeed = width / 1600,
    movementSpeed = width / 1800;

  const sketch = (p5) => {
    const images = {};
    p5.preload = function () {
      images['background'] = p5.loadImage(background);
      images['credits'] = p5.loadImage(credits);
      images['thankyou'] = p5.loadImage(thankyou);

      images['players'] = [];
      images['players'].push(p5.loadImage(player1));
      images['players'].push(p5.loadImage(player2));
      images['players'].push(p5.loadImage(player3));
      images['players'].push(p5.loadImage(player4));
      images['players'].push(p5.loadImage(player5));
      images['players'].push(p5.loadImage(player6));
    };

    let xPosForBg, xPosForPlayers;
    let creditsRatio, thankRatio;
    p5.setup = function () {
      p5.createCanvas(width, height);
      xPosForBg = 0;
      xPosForPlayers = -(width / 2) - playerSize;

      creditsRatio = images['credits'].height / images['credits'].width;
      thankRatio = images['thankyou'].height / images['thankyou'].width;
    };

    p5.draw = function () {
      p5.clear();
      p5.noStroke();

      p5.imageMode(p5.CORNER);
      p5.image(images['background'], xPosForBg, 0, width * 7, height);
      xPosForBg -= scrollSpeed;
      if (xPosForBg < -width * 6) xPosForBg = 0;

      for (let player_number = 0; player_number < 6; player_number++) {
        const order = 6 - player_number - 1;
        const xPos = (width / 12) * (player_number + 1) + xPosForPlayers;

        const rand = 1200;
        let dy = Math.abs(xPos + rand) % 50;
        if (Math.floor(Math.abs(xPos + rand) / 50) % 2) {
          dy = 50 - (Math.abs(xPos + rand) % 50);
        }
        const yPos = height * 0.75 + dy;

        p5.image(images['players'][order], xPos, yPos, playerSize, playerSize);
      }
      xPosForPlayers += movementSpeed;
      if (xPosForPlayers > width) xPosForPlayers = -(width / 2) - playerSize;

      p5.image(
        images['thankyou'],
        width * 0.5,
        height * 0.2,
        width * 0.4,
        width * 0.4 * thankRatio
      );
      p5.image(
        images['credits'],
        width * 0.1,
        height * 0.1,
        width * 0.2,
        width * 0.2 * creditsRatio
      );
    };
  };
</script>

<div class="endingCreditsTVContainer">
  <P5 {sketch} />
</div>

<style>
  .endingCreditsTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
