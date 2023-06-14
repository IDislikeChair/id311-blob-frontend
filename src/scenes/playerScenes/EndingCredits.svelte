<script>
  const innerHeight = window.innerHeight;
</script>

<div class="endingCreditsContainer" style="--innerHeight:{innerHeight};">
  <div class="thankyou">Thank you !</div>
</div>

<style>
  .endingCreditsContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-image: url('../../images/phone_background.gif');
    background-size: cover;
    width: 100vw;
    height: calc(var(--innerHeight) * 1px);
  }

  .thankyou {
    font-size: 6vh;
    color: #ffffff;
    font-weight: bolder;
  }
</style>
