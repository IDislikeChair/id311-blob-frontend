import { writable } from 'svelte/store';

export const SOCKET = writable(null);
export const ROLE = writable(-1);
export const PLAYER_NUMBER = writable(-1);
