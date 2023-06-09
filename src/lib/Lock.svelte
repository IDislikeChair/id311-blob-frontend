<script>
  import { onDestroy, onMount } from 'svelte';
  import { fly, fade, blur, slide, scale } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import LockMobileP1 from './LockMobileP1.svelte';
  import LockMobileP2 from './LockMobileP2.svelte';
  import Button from './Button.svelte';

  export let socket;

  let displayMobile = 1;
  function showMobileP1() {
    displayMobile = 1;
  }
  function showMobileP2() {
    displayMobile = 2;
  }
  function showTV() {
    displayMobile = 0;
  }
</script>

<div class="lockContainer">
  {#if displayMobile == 1}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: -50 }}>
      <LockMobileP1 {socket} />
    </div>
  {:else}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: -50 }}>
      <LockMobileP2 {socket} />
    </div>
  {/if}
  <div class="buttons">
    <Button on:click={showMobileP1} icon="fa-regular fa-mobile" />
    <Button on:click={showMobileP2} icon="fa-regular fa-mobile" />
  </div>
</div>

<style>
  .buttons {
    margin-top: 50px;
    margin-left: 30px;
  }
  .lockContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
