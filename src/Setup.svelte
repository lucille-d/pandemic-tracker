<script>
    import { sortCities, initialInfectionDeckCities, initialExcludedCities } from './util.js';

    import Collapsible from './Collapsible.svelte';
    import CitySelector from './CitySelector.svelte';

    import {
        numberOfPlayers,
        players,
        numberOfStacks,
        currentStack,
        playerStacks,
        playerStacksAmounts,
        numberOfPlayerCards,
        cities,
        excludedCities,
        currentDraw,
        infectionDeck,
        numberDrawn,
        currentPlayer,
        drawLog,
    } from './stores.js';

    export let hidden = false;

    let newCityName = '';
    let newCityColor = 'black';
    let newCityNumber = 3;

    let initialCities = [];

    // $: console.log($players);
    // $: console.log($playerStacksAmounts);
    // $: console.log($cities);
    // $: console.log($numberOfPlayerCards);
    $: $numberOfPlayerCards = $playerStacksAmounts.reduce((sum, curr) => sum + curr);

    function addCity() {
        $cities = $cities.concat({
            name: newCityName,
            color: newCityColor,
            number: newCityNumber,
        });
    }

    function deleteCity(cityName) {
        if (window.confirm('Are you sure you want to delete ' + cityName + '?')) {
            const newCities = $cities.filter((c) => c.name != cityName);
            $cities = newCities;
        }
    }

    function restoreCity(cityName) {
        if (window.confirm('Are you sure you want to re-include ' + cityName + ' in the game?')) {
            const newCities = $excludedCities.filter((c) => c.name != cityName);
            $excludedCities = newCities;
        }
    }

    function setInitialCities(selectedCities) {
        initialCities = selectedCities;
    }

    function saveSetup() {
        // console.log('save setup');

        if ($infectionDeck[0].length == 0 && $currentDraw.length == 0) {
            // create copies of each card
            $cities.forEach((c) => {
                const numberOfExcludedCopies = $excludedCities.filter((ec) => ec.name === c.name).length;
                const cityCards = Array(c.number - numberOfExcludedCopies).fill(c);
                $infectionDeck[0] = $infectionDeck[0].concat(cityCards);
            });
        }

        $playerStacks = Array($numberOfStacks).fill([]);

        initialCities.forEach(drawCity);

        $drawLog = ['Initial contamination: \n ' + initialCities.map((c) => c.name).join(', ')];
        $drawLog = [...$drawLog, $players[$currentPlayer] + "'s turn"];

        initialCities = [];
    }

    //TODO this method is duplicated from Tracker...
    function drawCity(city) {
        // console.log("DRAWING INITAL CITY ", city.name);

        $currentDraw = [...$currentDraw, city];

        //remove from previous draws
        let lastDraw = $infectionDeck.pop();
        console.log('last draw: ', lastDraw);

        let cityIndex = lastDraw.findIndex((c) => c.name === city.name);
        console.log('city found at ' + cityIndex);

        //if not in last draw, possibly in previous (!! this is not a foolproof algorythm but will be enough for our purposes, we never draw more than 4 cards and the rotation is never that small)
        if (cityIndex == -1) {
            lastDraw = [...lastDraw, $infectionDeck.pop()];
            cityIndex = lastDraw.findIndex((c) => c.name === city.name);
        }

        if (lastDraw.length > 1) {
            lastDraw.splice(cityIndex, 1); //remove city from deck

            $infectionDeck = [...$infectionDeck, lastDraw];
        }

        $infectionDeck = $infectionDeck; //for reactivity
        console.log($currentDraw, $infectionDeck);
    }

    function resetGame() {
        initialCities = [];

        $currentStack = 0;
        $playerStacks = [[]];
        $numberDrawn = 0;
        $currentDraw = [];
        $currentPlayer = 0;
        $infectionDeck = [[]];
        $cities = initialInfectionDeckCities;
        $excludedCities = initialExcludedCities;
        $drawLog = [];

        saveSetup();
    }
</script>

<section id="setup" class:hidden>
    <h1>Set-up</h1>
    <button on:click={saveSetup}>Save setup</button>
    <button on:click={resetGame}>Reset &#8634</button>

    <Collapsible title={'Players'}>
        <p>
            Number of players: <input type="number" bind:value={$numberOfPlayers} />
        </p>
        <ul id="player-list">
            {#each [...Array($numberOfPlayers).keys()] as i}
                <li>
                    <input type="text" bind:value={$players[i]} />
                </li>
            {/each}
        </ul>
    </Collapsible>

    <Collapsible title={'Player Deck'}>
        <p>
            Number of stacks: <input type="number" bind:value={$numberOfStacks} />
        </p>

        <ul id="stacks">
            {#each [...Array($numberOfStacks).keys()] as i}
                <li>
                    <input type="number" bind:value={$playerStacksAmounts[i]} />
                </li>
            {/each}
        </ul>
    </Collapsible>

    <Collapsible title={'Initial infected cities'}>
        {#if !initialCities.length}
            <CitySelector maxCities={9} onSave={setInitialCities} />
        {:else}
            <ul>
                {#each initialCities.sort(sortCities) as initialCity}
                    <li class={initialCity.color}>{initialCity.name}</li>
                {/each}
            </ul>
        {/if}
    </Collapsible>

    <Collapsible title={'Cities (' + ($cities.reduce((acc, curr) => curr.number + acc, 0) + ')')}
        ><ul id="stacks">
            {#each $cities.sort(sortCities) as city}
                <li>
                    <span class={city.color}>{city.name} ({city.number})</span>
                    <button on:click={deleteCity(city.name)}>X</button>
                </li>
            {/each}
        </ul>

        <div>
            <input type="text" bind:value={newCityName} />
            <select name="color" id="" bind:value={newCityColor}>
                <option value="black">Black</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
            </select>
            <input type="number" bind:value={newCityNumber} />
            <button on:click={addCity}>+</button>
        </div>
    </Collapsible>

    <Collapsible
        title={'Excluded Cities [Box 6] (' + ($excludedCities.reduce((acc, curr) => curr.number + acc, 0) + ')')}
        ><ul id="stacks">
            {#each $excludedCities.sort(sortCities) as city}
                <li>
                    <span class={city.color}>{city.name}</span>
                    <button on:click={restoreCity(city.name)}>X</button>
                </li>
            {/each}
        </ul>
    </Collapsible>
</section>

<style>
    section {
        padding: 5px;
    }

    div {
        display: inline;
    }
</style>
