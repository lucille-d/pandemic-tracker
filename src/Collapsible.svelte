<script>
    import { slide } from 'svelte/transition';

    export let title = 'title';

    let expanded = true;
</script>

<article>
    <h2 on:click={() => (expanded = !expanded)}>
        {title} <span>{expanded ? '^' : 'v'} </span>
    </h2>
    {#if expanded}
        <div class:open={expanded} transition:slide>
            <slot />
        </div>
    {/if}
</article>
