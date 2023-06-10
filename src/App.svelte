<script>
  import { onMount } from 'svelte';
  import io from 'socket.io-client';
  import { ROLE, SOCKET } from './stores';
  import JoinWindow from './scenes/JoinWindow.svelte';
  import PreMissionOne from './scenes/playerScenes/PreMissionOne.svelte';
  import PreMissionOneTv from './scenes/emceeScenes/PreMissionOneTV.svelte';
  import PreMissionTwo from './scenes/playerScenes/PreMissionTwo.svelte';
  import PreMissionTwoTv from './scenes/emceeScenes/PreMissionTwoTV.svelte';
  import PreMissionThree from './scenes/playerScenes/PreMissionThree.svelte';
  import PreMissionThreeTv from './scenes/emceeScenes/PreMissionThreeTV.svelte';

  import MissionOne from './scenes/playerScenes/MissionOne.svelte';
  import MissionOneTv from './scenes/emceeScenes/MissionOneTV.svelte';
  import MissionTwo from './scenes/playerScenes/MissionTwo.svelte';
  import MissionTwoTv from './scenes/emceeScenes/MissionTwoTV.svelte';
  import MissionThree from './scenes/playerScenes/MissionThree.svelte';
  import MissionThreeTv from './scenes/emceeScenes/MissionThreeTV.svelte';

  import PostMissionOne from './scenes/playerScenes/PostMissionOne.svelte';
  import PostMissionOneTv from './scenes/emceeScenes/PostMissionOneTV.svelte';
  import PostMissionTwo from './scenes/playerScenes/PostMissionTwo.svelte';
  import PostMissionTwoTv from './scenes/emceeScenes/PostMissionTwoTV.svelte';
  import PostMissionThree from './scenes/playerScenes/PostMissionThree.svelte';
  import PostMissionThreeTv from './scenes/emceeScenes/PostMissionThreeTV.svelte';

  import Lock from './lib/Lock.svelte';

  let socket;
  let status = 'NONE';
  let current_scene;

  let role;
  ROLE.subscribe((value) => {
    role = value;
  });

  current_scene = JoinWindow;

  onMount(async () => {
    // const backend = 'https://blob-backend.herokuapp.com';
    const backend = 'http://192.168.0.2:3000'; // For local dev
    socket = io(backend);

    SOCKET.set(socket);

    socket.on('connect', () => {
      //   console.log('connected to socket', backend);
      status = 'CONNECTED';
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('message', (message) => {
      console.log(message);
    });

    socket.on('start_pre_mission', (msg) => {
      console.log('start_pre_mission', msg);
      switch (msg.mission_id) {
        case 1:
          switch (role) {
            case 0:
              current_scene = PreMissionOneTv;
              break;
            case 1:
              current_scene = PreMissionOne;
              break;
          }
          break;
        case 2:
          switch (role) {
            case 0:
              current_scene = PreMissionTwoTv;
              break;
            case 1:
              current_scene = PreMissionTwo;
              break;
          }
          break;
        case 3:
          switch (role) {
            case 0:
              current_scene = PreMissionThreeTv;
              break;
            case 1:
              current_scene = PreMissionThree;
              break;
          }
          break;
      }
    });

    socket.on('start_mission', (msg) => {
      console.log('start_mission', msg);
      switch (msg.mission_id) {
        case 1:
          switch (role) {
            case 0:
              current_scene = MissionOneTv;
              break;
            case 1:
              current_scene = MissionOne;
              break;
          }
          break;
        case 2:
          switch (role) {
            case 0:
              current_scene = MissionTwoTv;
              break;
            case 1:
              current_scene = MissionTwo;
              break;
          }
          break;
        case 3:
          switch (role) {
            case 0:
              current_scene = MissionThreeTv;
              break;
            case 1:
              current_scene = MissionThree;
              break;
          }
          break;
      }
    });

    socket.on('start_post_mission', (msg) => {
      console.log('start_post_mission', msg);
      switch (msg.mission_id) {
        case 1:
          switch (role) {
            case 0:
              current_scene = PostMissionOneTv;
              break;
            case 1:
              current_scene = PostMissionOne;
              break;
          }
          break;
        case 2:
          switch (role) {
            case 0:
              current_scene = PostMissionTwoTv;
              break;
            case 1:
              current_scene = PostMissionTwo;
              break;
          }
          break;
        case 3:
          switch (role) {
            case 0:
              current_scene = PostMissionThreeTv;
              break;
            case 1:
              current_scene = PostMissionThree;
              break;
          }
          break;
      }
    });
  });

  function change_scene(event) {
    console.log(event);
    current_scene = event.detail.new_scene;
  }
</script>

<main>
  <!-- <h3>Server Connection: {status}</h3> -->
  <!-- <div> -->
  <!-- <Step {socket} /> -->
  <!-- <Lock {socket} /> -->
  <!-- </div> -->
  <svelte:component
    this={current_scene}
    on:changeScene={(e) => change_scene(e)}
  />
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  main {
    font-family: 'VT323', monospace;
  }
</style>
