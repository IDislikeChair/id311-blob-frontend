<script>
  import { Socket } from 'socket.io-client';
  import { SOCKET } from '../stores';

  /** @type {Socket} */
  let socket;
  SOCKET.subscribe((value) => {
    socket = value;
  });

  const go_to_pre_mission = (id) => {
    socket.emit('DEBUG_go_to_pre_mission', id);
  };
  const reset_players = () => {
    socket.emit('reset_players');
  };
</script>

<div class="card">
  <div class="card-body">
    <p class="card-title">DEBUG</p>
    <button on:click={() => go_to_pre_mission(1)}> go to Pre Mission 1 </button>
    <button on:click={() => go_to_pre_mission(2)}> go to Pre Mission 2 </button>
    <button on:click={() => go_to_pre_mission(3)}> go to Pre Mission 3 </button>
    <button on:click={() => reset_players()}>
      Reset all players connection
    </button>
  </div>
</div>
