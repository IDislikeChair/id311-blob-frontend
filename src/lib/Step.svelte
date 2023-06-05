<script>
  import { fly, fade, blur, slide, scale } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import StepMobile from './StepMobile.svelte';
  import StepTV from './StepTV.svelte';
  import Button from './Button.svelte';

  export let socket;

  let displayMobile = true;
  function showMobile() {
    displayMobile = true;
  }
  function showTV() {
    displayMobile = false;
  }
</script>

<div>
  {#if displayMobile}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: -50 }}>
      <StepMobile {socket} />
    </div>
  {:else}
    <div in:fly={{ easing: cubicInOut, duration: 500, x: 50 }}>
      <StepTV {socket} ballSize={50} />
    </div>
  {/if}
  <div class="buttons">
    <Button on:click={showMobile} icon="fa-regular fa-mobile" />
    <Button on:click={showTV} icon="fa-regular fa-tv" />
  </div>
</div>

<style>
  .buttons {
    margin-top: 3rem;
    margin-left: 30px;
  }
</style>
