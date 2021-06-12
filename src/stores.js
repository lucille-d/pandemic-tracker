import { writable } from 'svelte-persistent-store/dist/local';
import { initialInfectionDeckCities, initialExcludedCities } from "./util.js";

/***  PLAYERS ****/
export const numberOfPlayers = writable("numberOfPlayers", 3); //not dynamic yet
export const players = writable("players", ["Ky Nam", "Amélie", "Lucille"]);
export const currentPlayer = writable("currentPlayer", 0);

/***  PLAYER CARDS ****/
export const numberOfStacks = writable("numberOfStacks", 9);
export const playerStacksAmounts = writable("playerStacksAmounts", [9, 9, 8, 8, 8, 8, 8, 8, 8]);
export const playerStacks = writable("playerStacks", [[]]);
export const currentStack = writable("currentStack", 0);
export const numberDrawn = writable("numberDrawn", 0);
export const epidemicProbability = writable("epidemicProbability", 0);//calculated
export const numberOfPlayerCards = writable("numberOfPlayerCards", 0);//calculated

/***  INFECTION DECK ****/
export const cities = writable("cities", initialInfectionDeckCities);
export const infectionDeck = writable("infectionDeck", [[]]);
export const currentDraw = writable("currentDraw", []);
export const excludedCities = writable("excludedCities", initialExcludedCities);
export const drawLog = writable("drawLog", []);