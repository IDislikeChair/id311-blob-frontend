<script>
  import { SOCKET } from '../../stores';
  import { onMount } from 'svelte';
  import level_end from '../../sounds/level_end.mp3';
  import narration from '../../sounds/L1_Post.mp3';

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let alive = [];
  let dead = [];

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('broadcastPlayerStatus', (players) => {
      alive = [];
      dead = [];
      for (let player of players) {
        if (player['alive'] == 0) alive.push(player);
        else dead.push(player);
      }
    });
  });

  let showCard = 0;
  let audio;
  const start = () => {
    showCard++;
    if (showCard == 1) audio.play();
    if (showCard == 2) socket.emit('on_next');
  };
</script>

<audio src={level_end} autoplay />
<audio src={narration} bind:this={audio} />

<div class="postMissionOneTVContainer">
  <div class="nextBtn" on:click={start} />
  {#if showCard == 0}
    <div class="resultCard" />
    <div class="results">
      <div class="alivePlayers">
        <div class="pTitle">Survivors</div>
        <div class="flexUnit">
          <div class="pColumn">
            <div class="player">
              <div
                class="pImage"
                id={'player' + String(alive[0]?.pNum + 1)}
                style="--height:{window.innerHeight};"
              />
              <div class="pName">
                {alive[0]?.pName}
              </div>
            </div>
            <div class="player">
              <div
                class="pImage"
                id={'player' + String(alive[1]?.pNum + 1)}
                style="--height:{window.innerHeight};"
              />
              <div class="pName">
                {alive[1]?.pName}
              </div>
            </div>
          </div>

          <div class="pColumn">
            <div class="player">
              <div
                class="pImage"
                id={'player' + String(alive[2]?.pNum + 1)}
                style="--height:{window.innerHeight};"
              />
              <div class="pName">
                {alive[2]?.pName}
              </div>
            </div>
            <div class="player">
              <div
                class="pImage"
                id={'player' + String(alive[3]?.pNum + 1)}
                style="--height:{window.innerHeight};"
              />
              <div class="pName">
                {alive[3]?.pName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="deadPlayers">
        <div class="pTitle">Eliminated</div>

        <div class="pColumn">
          <div class="player">
            <div
              class="pImage"
              id={'player' + String(dead[0]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName">
              {dead[0]?.pName}
            </div>
          </div>
          <div class="player">
            <div
              class="pImage"
              id={'player' + String(dead[1]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName">
              {dead[1]?.pName}
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="narrCard" />
  {/if}
  <!-- <svelte:component this={DebugGoToMission} /> -->
</div>

<style>
  .postMissionOneTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission1_background.png');
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;

    position: absolute;
    z-index: -2;
  }
  .resultCard {
    background-image: url('../../images/level1/tv_results_card_blank.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 15 * 5);
    height: calc(1vw * 9 * 5);

    position: absolute;
    z-index: -1;
  }
  .narrCard {
    background-image: url('../../images/level1/tv_post_card.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 15 * 5);
    height: calc(1vw * 9 * 5);

    position: absolute;
    z-index: -1;
  }
  .nextBtn {
    background-image: url('../../images/level1/tv_next.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 6 * 4);
    height: calc(1vw * 1.5 * 4);

    position: fixed;
    right: calc(1vw * 5 * 16 / 25);
    bottom: calc(1vw * 5 * 9 / 25);
  }

  .results {
    display: flex;
    text-align: center;
    margin-bottom: 2vw;
  }
  .pTitle {
    font-size: 5vw;
    margin-bottom: 2vw;
  }
  .flexUnit {
    display: flex;
  }
  .alivePlayers {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-right: 5vw;
  }
  .deadPlayers {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-left: 5vw;
  }

  .pImage {
    width: 10vw;
    height: calc(var(--height) * 0.15 * 1px);
    margin-left: 2vw;
    margin-right: 2vw;

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .pName {
    font-size: 2.5vw;
  }
  #player1 {
    background-image: url('../../images/sprites/player1.gif');
  }
  #player2 {
    background-image: url('../../images/sprites/player2.gif');
  }
  #player3 {
    background-image: url('../../images/sprites/player3.gif');
  }
  #player4 {
    background-image: url('../../images/sprites/player4.gif');
  }
  #player5 {
    background-image: url('../../images/sprites/player5.gif');
  }
  #player6 {
    background-image: url('../../images/sprites/player6.gif');
  }
</style>
