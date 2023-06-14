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
  import EndingCreditsTv from './scenes/emceeScenes/EndingCreditsTV.svelte';

  let socket;
  let status = 'NONE';
  let currentScene;

  let role;
  ROLE.subscribe((value) => {
    role = value;
  });

  currentScene = JoinWindow;

  onMount(async () => {
    const backend = 'https://blob-backend.herokuapp.com';
    // const backend = 'http://192.168.0.2:3000'; // For local dev
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
      switch (msg.missionId) {
        case 1:
          switch (role) {
            case 0:
              currentScene = PreMissionOneTv;
              break;
            case 1:
              currentScene = PreMissionOne;
              break;
          }
          break;
        case 2:
          switch (role) {
            case 0:
              currentScene = PreMissionTwoTv;
              break;
            case 1:
              currentScene = PreMissionTwo;
              break;
          }
          break;
        case 3:
          switch (role) {
            case 0:
              currentScene = PreMissionThreeTv;
              break;
            case 1:
              currentScene = PreMissionThree;
              break;
          }
          break;
      }
    });

    socket.on('start_mission', (msg) => {
      console.log('start_mission', msg);
      switch (msg.missionId) {
        case 1:
          switch (role) {
            case 0:
              currentScene = MissionOneTv;
              break;
            case 1:
              currentScene = MissionOne;
              break;
          }
          break;
        case 2:
          switch (role) {
            case 0:
              currentScene = MissionTwoTv;
              break;
            case 1:
              currentScene = MissionTwo;
              break;
          }
          break;
        case 3:
          switch (role) {
            case 0:
              currentScene = MissionThreeTv;
              break;
            case 1:
              currentScene = MissionThree;
              break;
          }
          break;
      }
    });

    socket.on('start_post_mission', (msg) => {
      console.log('start_post_mission', msg);
      switch (msg.missionId) {
        case 1:
          switch (role) {
            case 0:
              currentScene = PostMissionOneTv;
              break;
            case 1:
              currentScene = PostMissionOne;
              break;
          }
          break;
        case 2:
          switch (role) {
            case 0:
              currentScene = PostMissionTwoTv;
              break;
            case 1:
              currentScene = PostMissionTwo;
              break;
          }
          break;
        case 3:
          switch (role) {
            case 0:
              currentScene = PostMissionThreeTv;
              break;
            case 1:
              currentScene = PostMissionThree;
              break;
          }
          break;
      }
    });
  });

  function change_scene(event) {
    console.log(event);
    currentScene = event.detail.new_scene;
  }
</script>

<main>
  <!-- <h3>Server Connection: {status}</h3> -->
  <!-- <div> -->
  <!-- <Step {socket} /> -->
  <!-- <Lock {socket} /> -->
  <!-- </div> -->
  <svelte:component
    this={currentScene}
    on:changeScene={(e) => change_scene(e)}
  />
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  main {
    font-family: 'VT323', monospace;
    overflow: hidden;
  }
</style>
