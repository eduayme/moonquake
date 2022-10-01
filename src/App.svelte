<script>
	import { onMount } from 'svelte';
	import { createScene, animate } from "./scene";

	let src = 'assets/logo.svg';
	let el;
	let rotating = true;

	function toggle() {
		console.log("toggle")
		rotating = !rotating;
		animate(rotating)
	}

	onMount(() => {
	    createScene(el)
	});
</script>

<img src={src} alt="Moonquake" class="logo" />

<button class="animation-btn" on:click={toggle}>
	{#if rotating}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 3.33337H4.66667C4.29848 3.33337 4 3.63185 4 4.00004V12C4 12.3682 4.29848 12.6667 4.66667 12.6667H6C6.36819 12.6667 6.66667 12.3682 6.66667 12V4.00004C6.66667 3.63185 6.36819 3.33337 6 3.33337Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M11.3333 3.33337H10C9.63181 3.33337 9.33333 3.63185 9.33333 4.00004V12C9.33333 12.3682 9.63181 12.6667 10 12.6667H11.3333C11.7015 12.6667 12 12.3682 12 12V4.00004C12 3.63185 11.7015 3.33337 11.3333 3.33337Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Pause rotation
	{:else}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4.66663 2.66663V13.3333L13.3333 7.99996L4.66663 2.66663Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Start rotation
	{/if}
</button>

<canvas bind:this={el}></canvas>