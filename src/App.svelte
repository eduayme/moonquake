<script>
	import { onMount } from 'svelte';
	import { createScene, animate } from "./scene";

	let src = 'assets/logo.svg';
	let el;
	let rotating = true;
	let cheese = false;
	$: legend = [
		{ index: 0, name: "Superficial", color: "#fb5000", display: true, opacity: 1},
		{ index: 1, name: "Meteorite", color: "#1db3e6", display: true, opacity: 1},
		{ index: 2, name: "Deep", color: "#82b431", display: true, opacity: 1},
		{ index: 3, name: "Artificial", color: "#c20100", display: true, opacity: 1}
	]
	$: toDisplay = legend.filter((x) => { return x.display; });
	$: toDisplayIndexes = toDisplay.map(x => x.index);
	$: moonquakeToDisplay = 0;
	$: moonquakes = []

	function loadData() {
		fetch("public/data.json")
			.then((response) => response.json())
			.then((data) => {
				const colors = [0xfb5000, 0x1db3e6, 0x82b431, 0xc20100];
				moonquakes = data;
			})
			.catch((error) => console.log(error));
	}

	function toggleRotate() {
		rotating = !rotating;
		animate(rotating)
	}

	function toggleCheese() {
		cheese = !cheese;
		createScene(el, cheese, toDisplayIndexes)
		loadData()
	}

	function toggleDisplay(item) {
		item.display = !item.display
		item.opacity = item.display ? 1 : 0.5
		legend = legend
		toDisplay = legend.filter((x) => { return x.display; });
		toDisplayIndexes = toDisplay.map(x => x.index);
		createScene(el, cheese, toDisplayIndexes)
		loadData()
	}
	function actionToDisplay(plus) {
		moonquakeToDisplay += plus;

		const lastPos = moonquakes.length-1
		if (moonquakeToDisplay < 0) {
		    moonquakeToDisplay = lastPos
		} else if (moonquakeToDisplay > lastPos) {
		    moonquakeToDisplay = 0
		}
	}

	onMount(() => {
	    createScene(el, cheese, toDisplayIndexes)
		loadData()
	});
</script>

<img src={src} alt="Moonquake" class="logo" />

<button class="animation-btn" on:click={toggleRotate}>
	{#if rotating}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 3.33337H4.66667C4.29848 3.33337 4 3.63185 4 4.00004V12C4 12.3682 4.29848 12.6667 4.66667 12.6667H6C6.36819 12.6667 6.66667 12.3682 6.66667 12V4.00004C6.66667 3.63185 6.36819 3.33337 6 3.33337Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M11.3333 3.33337H10C9.63181 3.33337 9.33333 3.63185 9.33333 4.00004V12C9.33333 12.3682 9.63181 12.6667 10 12.6667H11.3333C11.7015 12.6667 12 12.3682 12 12V4.00004C12 3.63185 11.7015 3.33337 11.3333 3.33337Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Pause
	{:else}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4.66663 2.66663V13.3333L13.3333 7.99996L4.66663 2.66663Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Rotate
	{/if}
</button>

<button class="animation-btn" style="top:80px" on:click={toggleCheese}>
	{#if cheese}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.00002 2.00013C8.08802 2.00013 8.17535 2.00013 8.26202 2.00013C7.40558 2.79594 6.85508 3.86669 6.70621 5.02628C6.55734 6.18586 6.81952 7.36095 7.44717 8.34728C8.07483 9.33362 9.02826 10.0688 10.1418 10.4251C11.2552 10.7814 12.4584 10.7362 13.542 10.2975C13.1252 11.3005 12.4439 12.1715 11.5708 12.8176C10.6977 13.4638 9.66565 13.8608 8.58462 13.9664C7.5036 14.072 6.41419 13.8821 5.43261 13.4171C4.45103 12.952 3.61409 12.2293 3.01108 11.3259C2.40806 10.4225 2.06158 9.37232 2.00861 8.28744C1.95563 7.20257 2.19814 6.12366 2.71026 5.16581C3.22239 4.20795 3.98492 3.40708 4.91653 2.84862C5.84813 2.29016 6.91385 1.99506 8.00002 1.9948V2.00013Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Moon
	{:else}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M14 5.99996V8.33329C13.6464 8.33329 13.3072 8.47377 13.0572 8.72382C12.8071 8.97387 12.6667 9.313 12.6667 9.66663C12.6667 10.0202 12.8071 10.3594 13.0572 10.6094C13.3072 10.8595 13.6464 11 14 11V13.3333L3.01267 13.3386C2.37333 12.248 2 10.936 2 9.52466C2 7.76933 2.57667 6.16866 3.52533 4.95533C4.57133 3.61866 6.06867 2.752 7.74333 2.672L14 5.99996ZM14 5.99996H2.852M10 8.66663V8.67329M5.33333 8.66663V8.67329M7.33333 10.6666V10.6733" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		Cheese
	{/if}
</button>

<div class="legend" style="top:60px">
	{#each legend as item}
		<div class="legend-item" on:click={() => toggleDisplay(item)} style="opacity: {item.opacity}">
			<div class="legend-color" style="background-color: {item.color}"></div>
			<div class="legend-name">{ item.name }</div>
		</div>
	{/each}
</div>

{#if moonquakes.length > 0}
<div class="info">
	<div class="info-content">
		<div class="info-action" on:click={() => actionToDisplay(-1)}>
			<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.33337 20H31.6667M8.33337 20L18.3334 30M8.33337 20L18.3334 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		<div class="info-card" on:click={() => activeMeteorit(moonquakeToDisplay)}>
			<h3>Moonquake #{moonquakeToDisplay+1}</h3>
			<div class="info-card-details" >
				<p>{ new Date(
					moonquakes[moonquakeToDisplay]["Date_YYYYMMDD"].toString().substring(0, 4),
					moonquakes[moonquakeToDisplay]["Date_YYYYMMDD"].toString().substring(4, 6),
					moonquakes[moonquakeToDisplay]["Date_YYYYMMDD"].toString().substring(6, 8)
				  ).toLocaleDateString("en-US", {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})
				}</p>
				<p>Amplitude: <span>{ moonquakes[moonquakeToDisplay]["Amplitude"] }</span></p>
				<p>Type: <span>{ legend.find(e => e.index == moonquakes[moonquakeToDisplay]["Class"]).name }</span></p>
				<p>Duration: <span>{ moonquakes[moonquakeToDisplay]["duration"] } min</span></p>
			</div>
		</div>
		<div class="info-action" on:click={() => actionToDisplay(+1)}>
			<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.33337 20H31.6667M31.6667 20L21.6667 30M31.6667 20L21.6667 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
	</div>
</div>
{/if}

<canvas bind:this={el}></canvas>