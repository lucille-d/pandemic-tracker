<script>
    export let editable = false; //todo if true, inputs instead of strings
    export let items = ['toto', 'titi', 'tata'];

    let draggedItem = null;

    function handleDragStart(ev, item) {
        console.log('handleDragStart', ev, item);
        draggedItem = item;
        // Add the target element's id to the data transfer object
        ev.dataTransfer.effectAllowed = 'move';
        // ev.dataTransfer.setData("text", ev.target.innerHTML);
    }

    function handleDragOver(ev) {
        ev.preventDefault();
    }

    function handleDrop(ev, index1, index2) {
        ev.preventDefault();
        moveItemBetweenIndexes(draggedItem, index1, index2);
    }

    function moveItemBetweenIndexes(item, index1, index2) {
        const currentIndex = items.indexOf(item);
        if (currentIndex === index1 || currentIndex === index2) return;

        items.splice(currentIndex, 1);

        items = items.slice(0, index2).concat(item).concat(items.slice(index2));
    }

    //todo this works, all that remains is style => show drop zones only when dragging, even more when hovering them; handle touch events, make draggable obvious; text inputs
</script>

<ul>
    <div on:drop={(ev) => handleDrop(ev, 0, 0)} on:dragover={handleDragOver}>0,0</div>
    {#each items as item, i}
        <li draggable="true" on:dragstart={(ev) => handleDragStart(ev, item)}>
            {#if editable}
                <input type="text" bind:value={item} />
            {:else}
                <p>{item}</p>
            {/if}
        </li>
        <div on:drop={(ev) => handleDrop(ev, i, i + 1)} on:dragover={handleDragOver}>
            {i},{i + 1}
        </div>
    {/each}
</ul>

<style>
    div {
        height: 20px;
        background: grey;
    }
</style>
