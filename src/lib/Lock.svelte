<script>
  import { fly, fade, blur, slide, scale } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import LockMobileP1 from './LockMobileP1.svelte';
  import LockMobileP2 from './LockMobileP2.svelte';
  import LockTV from './LockTV.svelte';
  import Button from './Button.svelte';

  export let socket;

  let displayMobile = 0;
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

<div>
  {#if displayMobile == 1}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: -50 }}>
      <LockMobileP1 {socket} />
    </div>
  {:else if displayMobile == 2}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: -50 }}>
      <LockMobileP2 {socket} />
    </div>
  {:else}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: 50 }}>
      <LockTV {socket} ballSize={50} />
    </div>
  {/if}
  <div class="buttons">
    <Button on:click={showMobileP1} icon="fa-regular fa-mobile" />
    <Button on:click={showMobileP2} icon="fa-regular fa-mobile" />
    <Button on:click={showTV} icon="fa-regular fa-tv" />
  </div>
</div>

<style>
  .buttons {
    margin-left: 30px;
  }
</style>
