<script>
    import Collapsible from './Collapsible.svelte';

    import { sortCities } from './util.js';

    import {
        numberDrawn,
        playerStacksAmounts,
        playerStacks,
        currentStack,
        numberOfPlayerCards,
        currentDraw,
        infectionDeck,
        excludedCities,
        epidemicProbability,
        drawLog,
    } from './stores.js';

    export let hidden = false;

    let safeTurns = 0;

    $: $numberDrawn | ($epidemicProbability = updateEpidemicProbability()) | (safeTurns = getNumberOfSafeTurns());

    function updateEpidemicProbability() {
        console.log('updateEpidemicProbability, curr stack', $currentStack);

        if ($playerStacks[$currentStack].includes('E')) {
            if ($playerStacks[$currentStack].length < $playerStacksAmounts[$currentStack] - 1) {
                // 2 nore to draw
                return 0;
            } else {
                // just one to draw, check next stack
                return Math.round((1 / $playerStacksAmounts[$currentStack + 1]) * 10000) / 100;
            }
        }
        return Math.min(
            Math.round((2 / ($playerStacksAmounts[$currentStack] - $playerStacks[$currentStack].length)) * 10000) / 100,
            100
        );
    }

    function getNumberOfSafeTurns() {
        if (!$playerStacks[$currentStack].includes('E')) return 0;
        return Math.floor(($playerStacksAmounts[$currentStack] - $playerStacks[$currentStack].length) / 2);
    }

    function removeCityFromDiscard(cardIndex, cityName) {
        if (window.confirm('Are you sure you want to remove ' + cityName + ' from the game?')) {
            console.log('removeCityFromDiscard', cardIndex);

            $currentDraw.splice(cardIndex, 1);
            $currentDraw = $currentDraw;
        }
    }

    function excludeCity(cardIndex, cityName) {
        if (window.confirm('Are you sure you want to inoculate ' + cityName + ' (Box 6)?')) {
            console.log('removeCityFromDiscard', cardIndex);

            const excluded = $currentDraw.splice(cardIndex, 1);
            $currentDraw = $currentDraw;
            $excludedCities = $excludedCities.concat(excluded);
        }
    }
</script>

<section id="deck" class:hidden>
    <h1>Decks</h1>
    <p>Epidemic probability: <b> {$epidemicProbability} %</b></p>
    {#if safeTurns > 0}<p>Safe turns: <b>{safeTurns}</b></p>{/if}

    <Collapsible title={'Player Deck'}>
        <p>Status: <b> {$numberDrawn} / {$numberOfPlayerCards}</b></p>
        {#each $playerStacks as stack, i}
            <p>
                {#each stack as cardMarker}
                    {cardMarker}
                {/each}

                {#if i == $currentStack}
                    {$playerStacks[i].length}/{$playerStacksAmounts[i]}
                {/if}
            </p>
        {/each}
    </Collapsible>

    <Collapsible title={'Infection Discard (' + $currentDraw.length + ')'}>
        <ul class="faded">
            {#each $currentDraw.sort(sortCities) as d, i}
                <li class={d.color}>
                    <span>{d.name}</span>
                    <button on:click={() => excludeCity(i, d.name)}>&#9763</button>
                    <button on:click={() => removeCityFromDiscard(i, d.name)}>X</button>
                </li>
            {/each}
        </ul>
    </Collapsible>

    <Collapsible title={'Infection Deck'}>
        {#each [...$infectionDeck].reverse() as deckLayer}
            {deckLayer.length}
            <ul>
                {#each deckLayer.sort(sortCities) as c}
                    <li class={c.color}>{c.name}</li>
                {/each}
            </ul>
        {/each}
    </Collapsible>

    <Collapsible title={'Game log'}>
        {#each $drawLog as line}
            <p>{line}</p>
        {/each}
    </Collapsible>
</section>

<style>
    section {
        padding: 5px;
    }

    ul {
        list-style: none;
    }

    li {
        padding: 5px;
        margin-bottom: 2px;
    }

    button {
        font-size: 20px;
        height: 100%;
    }
</style>
