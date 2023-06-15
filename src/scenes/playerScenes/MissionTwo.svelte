<script>
  import { SOCKET } from '../../stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import MissionTwoSolver from './MissionTwo/MissionTwoSolver.svelte';
  import MissionTwoGuider from './MissionTwo/MissionTwoGuider.svelte';

  const dispatch = createEventDispatcher();

  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  const innerHeight = window.innerHeight;

  $: onMount(async () => {
    while (!socket) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    socket.on('missionTwoRole', (roleNumber) => {
      switch (roleNumber) {
        case 0:
          dispatch('changeScene', { new_scene: MissionTwoSolver });
          break;
        case 1:
          dispatch('changeScene', { new_scene: MissionTwoGuider });
          break;
      }
    });
  });
</script>

<div class="stepClientContainer" style="--innerHeight:{innerHeight};">
  <div class="clientTitle">
    Let's watch<br /> other players'<br />fantastic play
  </div>
</div>

<style>
  .stepClientContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('../../images/mission2_background.png');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }
  .clientTitle {
    text-align: center;
    width: 70vw;
    font-size: 10vw;
    line-height: 10vw;

    margin-bottom: 5vh;
    color: #e9e9e9;
  }
</style>
