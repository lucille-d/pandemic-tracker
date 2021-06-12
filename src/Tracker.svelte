<script>
    import CitySelector from './CitySelector.svelte';
    import ReorderableList from './ReorderableList.svelte';

    import {
        numberDrawn,
        numberOfPlayers,
        numberOfPlayerCards,
        players,
        currentPlayer,
        playerStacks,
        currentStack,
        numberOfStacks,
        playerStacksAmounts,
        currentDraw,
        infectionDeck,
        epidemicProbability,
        drawLog,
    } from './stores.js';

    export let hidden = false;
    let turnInProgress = true;

    let isCard1Epidemic = false;
    let isCard2Epidemic = false;
    let epidemic1Resolved = false;
    let epidemic2Resolved = false;

    let newContaminatedCities = [];

    // $: console.log($playerStacks);
    $: console.log($currentDraw);
    $: console.log($infectionDeck);

    function endTurn() {
        if ((isCard1Epidemic && !epidemic1Resolved) || (isCard2Epidemic && !epidemic2Resolved)) {
            window.alert(
                'You have an unresolved epidemic, please save your city selection or uncheck the box before finishing the turn.'
            );
            return;
        }

        console.log('end turn');

        drawCard(isCard1Epidemic);
        drawCard(isCard2Epidemic);
        $currentPlayer = ($currentPlayer + 1) % $numberOfPlayers;

        isCard1Epidemic = false;
        isCard2Epidemic = false;
        turnInProgress = false;
        setTimeout(() => {
            turnInProgress = true;
        });

        newContaminatedCities.forEach((c) => drawCity(c, false));
        $drawLog = [...$drawLog, 'Infection in ̈́' + newContaminatedCities.map((c) => c.name).join(', ')];
        $drawLog = [...$drawLog, '=========='];

        $drawLog = [...$drawLog, $players[$currentPlayer] + "'s turn"];

        newContaminatedCities = [];
        epidemic1Resolved = false;
        epidemic2Resolved = false;
    }

    function drawCard(isEpidemic = false) {
        console.log('DRAW card');

        $playerStacks[$currentStack] = $playerStacks[$currentStack].concat(isEpidemic ? 'E' : '|');

        if ($playerStacks[$currentStack].length === $playerStacksAmounts[$currentStack]) {
            if ($currentStack < $numberOfStacks - 1) {
                $currentStack++;
            } else {
                console.log('NO MORE CARDS');
            }
        }

        $numberDrawn++;
    }

    function drawCity(city, isEpidemic = false) {
        console.log('DRAWING CITY ', city.name);

        $currentDraw = [...$currentDraw, city];

        if (isEpidemic) {
            const lastDraw = $infectionDeck[0]; //initial deck
            const cityIndex = lastDraw.findIndex((c) => c.name === city.name);
            console.log('city found at ' + cityIndex);
            $infectionDeck[0].splice(cityIndex, 1);
        } else {
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
        }

        $infectionDeck = $infectionDeck; //for reactivity
        console.log($currentDraw, $infectionDeck);
    }

    function resolveEpidemic(city) {
        $drawLog = [...$drawLog, 'Epidemic in ̈́' + city.name];

        // draw from bottom of deck
        drawCity(city, true);

        $infectionDeck = [...$infectionDeck, Array.from($currentDraw)];
        $currentDraw = [];
    }
</script>

<section id="tracker" class:hidden>
    <h1>Tracker</h1>
    <p>Epidemic probability: <b> {$epidemicProbability} %</b></p>

    <p>It´s <b> {$players[$currentPlayer]}</b>'s turn.</p>

    {#if turnInProgress}
        <ul>
            <li>
                <input type="checkbox" name="action1" id="action1" />
                <label for="action1"> Action 1</label>
            </li>
            <li>
                <input type="checkbox" name="action2" id="action2" />
                <label for="action2"> Action 2</label>
            </li>
            <li>
                <input type="checkbox" name="action3" id="action3" />
                <label for="action3"> Action 3</label>
            </li>
            <li>
                <input type="checkbox" name="action4" id="action4" />
                <label for="action4"> Action 4</label>
            </li>
            <li>
                <input type="checkbox" name="draw" id="draw" />
                <label for="draw">Draw 2 player cards</label>
                <div class="action-detail">
                    <ul>
                        <li>
                            <label for="c1-epi">Card 1 Epidemic?</label><input
                                type="checkbox"
                                name="c1-epi"
                                id="c1-epi"
                                bind:checked={isCard1Epidemic}
                            />
                            {#if isCard1Epidemic}
                                <CitySelector
                                    onSave={(selectedCities) => {
                                        resolveEpidemic(selectedCities[0]);
                                        epidemic1Resolved = true;
                                    }}
                                    maxCities={1}
                                />
                            {/if}
                        </li>
                        <li>
                            <label for="c2-epi">Card 2 Epidemic?</label><input
                                type="checkbox"
                                name="c2-epi"
                                id="c2-epi"
                                bind:checked={isCard2Epidemic}
                            />
                            {#if isCard2Epidemic}
                                <CitySelector
                                    onSave={(selectedCities) => {
                                        resolveEpidemic(selectedCities[0]);
                                        epidemic2Resolved = true;
                                    }}
                                    maxCities={1}
                                />
                            {/if}
                        </li>
                    </ul>
                </div>
            </li>
            <li>
                <input type="checkbox" name="infect" id="infect" />
                <label for="infect">Infect cities</label>
                <div class="action-detail">
                    <CitySelector
                        onSave={(selectedCities) => {
                            newContaminatedCities = selectedCities;
                        }}
                    />
                </div>
            </li>
        </ul>
    {/if}

    <button
        disabled={$numberDrawn >= $numberOfPlayerCards}
        on:click={() => {
            endTurn();
        }}>End turn</button
    >

    <!-- <ReorderableList /> -->
</section>

<style>
    .action-detail {
        display: none;
    }

    input[type='checkbox']:checked ~ .action-detail {
        display: block;
    }

    section {
        padding: 5px;
    }

    ul {
        list-style: none;
    }

    li {
        min-height: 30px;
        padding: 5px 0;
    }

    label {
        display: inline;
    }
</style>
