<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../../stores';
  import { onMount } from 'svelte';
  import DebugGoToMission from '../DEBUG_go_to_mission.svelte';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  let session_id;
  let alive = [],
    dead_now = [],
    dead_prev = [];

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.emit('get_session_id');

    socket.on('post_session_id', (id) => {
      // console.log(id);
      session_id = id;
    });

    socket.on('broadcastPlayerStatus', (players) => {
      alive = [];
      dead_now = [];
      dead_prev = [];
      for (let player of players) {
        if (player['alive'] == 0) alive.push(player);
        else if (player['alive'] == 3) dead_now.push(player);
        else dead_prev.push(player);
      }
    });
  });

  let showCard = 0;
  const start = () => {
    showCard++;
    if (showCard == 2) socket.emit('on_next');
  };
</script>

<div class="postMissionThreeTVContainer">
  <div class="nextBtn" on:click={start} />
  {#if showCard == 0}
    <div class="resultCard" />
    <div class="results">
      <div class="alivePlayers">
        <div class="pTitle">Survivor</div>
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
              <div class="pImage" style="--height:{window.innerHeight};" />
              <div class="pName" />
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
              id={'player' + String(dead_now[0]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName">
              {dead_now[0]?.pName}
            </div>
          </div>
        </div>
        <div class="pRow">
          <div class="player">
            <div
              class="pImage_eliminated"
              id={'player' + String(dead_prev[0]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName_eliminated">
              {dead_prev[0]?.pName}
            </div>
          </div>
          <div class="player">
            <div
              class="pImage_eliminated"
              id={'player' + String(dead_prev[1]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName_eliminated">
              {dead_prev[1]?.pName}
            </div>
          </div>
          <div class="player">
            <div
              class="pImage_eliminated"
              id={'player' + String(dead_prev[2]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName_eliminated">
              {dead_prev[2]?.pName}
            </div>
          </div>
          <div class="player">
            <div
              class="pImage_eliminated"
              id={'player' + String(dead_prev[3]?.pNum + 1)}
              style="--height:{window.innerHeight};"
            />
            <div class="pName_eliminated">
              {dead_prev[3]?.pName}
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
  .postMissionThreeTVContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission3_background.png');
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;

    position: absolute;
    z-index: -2;
  }
  .resultCard {
    background-image: url('../../images/level3/tv_results_card_blank.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 15 * 5);
    height: calc(1vw * 9 * 5);

    position: absolute;
    z-index: -1;
  }
  .narrCard {
    background-image: url('../../images/level3/tv_post_card.png');
    background-size: cover;
    background-position: center;
    width: calc(1vw * 15 * 5);
    height: calc(1vw * 9 * 5);

    position: absolute;
    z-index: -1;
  }
  .nextBtn {
    background-image: url('../../images/level3/tv_next.png');
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
    width: 12vw;
    height: calc(var(--height) * 0.2 * 1px);
    margin-left: 2vw;
    margin-right: 2vw;
  }
  .pName {
    font-size: 2.5vw;
  }

  .pImage_eliminated {
    width: 5vw;
    height: calc(var(--height) * 0.08 * 1px);
    margin-top: 3vh;
    margin-left: 1vw;
    margin-right: 1vw;
  }
  .pName_eliminated {
    font-size: 2vw;
  }
  .pRow {
    display: flex;
    flex-direction: row;
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
