<script>
    import { cities } from './stores';
    import { sortCities } from './util.js';

    export let onSave = () => {};
    export let maxCities = 20;

    let selecting = true;
    let selectedCities = [];
    let saved = false;

    $: selecting = selectedCities.length < maxCities;

    function selectCity(city) {
        selectedCities = selectedCities.concat(city);
    }

    function deselectCity(city) {
        const idx = selectedCities.indexOf(city);
        if (idx > -1) {
            selectedCities.splice(idx, 1);
        }
        selectedCities = selectedCities; //for reactivity
    }

    function saveSelection() {
        console.log(selectedCities);

        selecting = false;
        saved = true;
        onSave(selectedCities);
    }
</script>

<section>
    {#if selecting}
        <div>
            {#each $cities.sort(sortCities) as city}
                <button
                    on:click={() => {
                        selectCity(city);
                    }}
                    class={city.color}>{city.name}</button
                >
            {/each}
        </div>
    {/if}

    {#if selectedCities.length}
        <ul>
            {#each selectedCities.sort(sortCities) as selectedCity}
                <li class={selectedCity.color}>
                    <span>{selectedCity.name}</span>
                    <button on:click={deselectCity(selectedCity)}>X</button>
                </li>
            {/each}
        </ul>
    {/if}

    {#if !saved}
        <button on:click={saveSelection}>Save selection</button>
    {/if}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
    }

    button {
        margin-top: 15px;
    }

    div button {
        width: 30%;
        height: 3em;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        border: none;
        border-radius: 0;
        margin: 2px;
        font-weight: normal;
    }

    li {
        display: flex;
    }

    li span {
        flex-grow: 1;
        align-self: center;
    }
</style>
