import { writable } from 'svelte/store';

export const SOCKET = writable(null);
export const ROLE = writable(-1);
export const PLAYER_NUMBER = writable(-1);

export const PLAYER_NAMES = writable([
  'Player 1',
  'Player 2',
  'Player 3',
  'Player 4',
  'Player 5',
  'Player 6',
]);
