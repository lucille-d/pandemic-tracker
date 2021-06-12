<script>
	import Setup from './Setup.svelte';
	import Tracker from './Tracker.svelte';
	import Deck from './Deck.svelte';

	let currentSection = 'tracker';
</script>

<div>
	<main>
		<Setup hidden={currentSection != 'setup'} />
		<Tracker hidden={currentSection != 'tracker'} />
		<Deck hidden={currentSection != 'deck'} />
	</main>
	<nav>
		<ul>
			<li>
				<button id="to-setup" on:click={() => (currentSection = 'setup')}>Set-up</button>
			</li>
			<li>
				<button id="to-tracker" on:click={() => (currentSection = 'tracker')}>Tracker</button>
			</li>
			<li>
				<button id="to-deck" on:click={() => (currentSection = 'deck')}>Decks</button>
			</li>
		</ul>
	</nav>
</div>

<style>
	div {
		height: 100vh;
		width: 100vw;
		margin: 0;
		display: flex;
		flex-direction: column;
		font-family: Arial, Helvetica, sans-serif;
	}

	main {
		background-color: #181e2f; /* dark blue*/
		flex-grow: 1;
		padding-top: 50px;
		padding-bottom: 65px;
		color: white;
	}

	nav {
		background-color: #5b1319; /* dark red */
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		color: white;
	}

	nav ul {
		padding: 0;
		margin: 0;
		list-style: none;
		display: flex;
	}

	nav li {
		width: 100%;
		border-right: 1px solid gray;
	}

	nav li:last-of-type {
		border: none;
	}

	nav button {
		padding: 0;
		margin: 0;
		border: 0;
		background: none;
		width: 100%;
		height: 60px;
		font-size: 1.2em;
	}

	:global(.hidden) {
		display: none;
	}
</style>
