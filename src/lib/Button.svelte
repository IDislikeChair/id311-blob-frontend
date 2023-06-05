<script>
  import '@fortawesome/fontawesome-free/css/all.css';
  export let icon = '';
</script>

<button on:click> <i class={icon} /></button>

<!-- on:click -> propagate up -->
<style>
  button {
    border-radius: 20%;
    border: none;
    color: white;
    background-color: rgb(142, 151, 160);
    padding: 6px 8px;
    font-size: 3rem;
    cursor: pointer;
    width: 100px;
    height: 70px;
    margin-bottom: 30px;
  }
</style>
