<script>
	import { base } from "$app/paths";
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";
	import DOMPurify from "dompurify";
	import { marked } from "marked";
	import { fade } from "svelte/transition";

	let showEmployees = false;

	let API_BASE = "http://127.0.0.1:1337/api/dishes?populate=*";

	let getData = async () => {
		let res = await fetch(API_BASE);
		let data = await res.json();
		console.log(data);
		return data;
	};

	let getRestaurantData = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/restaurant?populate=*");
		let data = await res.json();
		console.log(data);
		return data;
	};

	let sorted = (array) => {
		let arrayCopy = [...array];
		arrayCopy.sort((a, b) =>
			a.attributes.categories.data[0].attributes.name.localeCompare(
				b.attributes.categories.data[0].attributes.name
			)
		);
		return arrayCopy;
	};

	let filter = (array, type) => {
		console.log(type);
		let filteredArray = array.filter((element) => {
			console.log(element.attributes.categories.data[0].attributes.name);
			return element.attributes.categories.data[0].attributes.name === type;
		});
		return filteredArray;
	};

	let cap = (string) => {
		return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}s`;
	};

	let allTypes = ["starter", "main", "dessert", "beverage"];
	let allTypeLinks = [...allTypes];
</script>

<main class="flex min-h-[95.9vh] flex-col bg-black [&>*]:m-4">
	{#await getRestaurantData()}
		<!-- <p>Loading restaurant data...</p> -->
	{:then value}
		<!-- {#each Object.entries(value.data) as [key, { name, address, latest_news, employees }]} -->
		<!-- {#if key === "attributes"} -->
		{@const { name, address, latest_news, employees } = value.data.attributes}
		<p class="font-rubik text-center text-6xl text-white">
			{name}
		</p>
		<p class="text-white">
			We are located in {address}.
		</p>
		<div class="nice-markdown">
			{@html DOMPurify.sanitize(marked.parse(latest_news))}
		</div>
		<div class="text-white">
			<button
				class="w-32 rounded-md bg-blue-800 p-1 hover:bg-blue-700"
				on:click={() => (showEmployees = !showEmployees)}>Show employees</button>
			{#each Object.values(employees.data) as { attributes: { first_name, last_name, employment_start, role } }}
				{#if showEmployees}
					<p class="text-2xl text-white">
						<span class="underline-green-500 underline-1 underline">{first_name} {last_name}</span>
						is our {role} who started to work for us on {employment_start}.
					</p>
				{/if}
			{/each}
		</div>
		<!-- {/if}	 -->
		<!-- {/each} -->
	{:catch error}
		{error}
	{/await}

	<nav class="flex gap-4">
		{#each ["all menu", ...allTypeLinks] as link}
			<button
				on:click={() => {
					if (link === "all menu") {
						API_BASE = "http://127.0.0.1:1337/api/dishes?populate=*";
						allTypes = ["starter", "main", "dessert", "beverage"];
					} else {
						API_BASE = `http://127.0.0.1:1337/api/dishes?populate=*&filters[categories][name][$eq]=${link}`;
						allTypes = [link];
					}
				}}
				class="font-arima rounded-md bg-slate-900 p-2 text-3xl text-blue-500 transition-all hover:text-blue-300"
				>{cap(link)}</button>
		{/each}
	</nav>

	{#key API_BASE}
		{#await getData()}
			<p>Loading...</p>
		{:then results}
			<div
				in:fade
				class="bg-hero-i-like-food-light/5 bg-dark-900 flex flex-1 flex-col p-2 [&>*]:m-px">
				{#each allTypes as type}
					<article class="space-y-2">
						<h2 class="font-arima py-6 text-left text-3xl text-white">{cap(type)}</h2>
						{#each filter(sorted(Object.values(results.data)), type) as { id, attributes: { name, price, categories, ingredients } }, i (id)}
							<div
								class="bg-hero-diagonal-stripes-light/1 font-arima flex-row justify-between rounded-md bg-slate-900 p-4 text-white"
								animate:flip={{ delay: i * 50, duration: 1000, easing: quintOut }}>
								<div>
									<p class="text-2xl">
										{name}
										<span class="text-base">
											{price}:-
										</span>
									</p>

									<ul class="list-none">
										{#each Object.values(categories.data) as { attributes: { name: categoryName } }}
											{#if categoryName !== type}
												<li
													class:nuts={categoryName === "contains nuts"}
													class:on-sale={categoryName === "on sale"}
													class:vegetarian={categoryName === "vegetarian"}>
													{categoryName}
												</li>
											{/if}
										{/each}
									</ul>
								</div>
								{#if ingredients}
									<div class="flex flex-row items-center gap-3">
										{#each ingredients as { name, quantity }}
                    <p class="bg-black/50 p-1 rounded-md">

											{quantity} {name}
                    </p>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</article>
				{/each}
			</div>
		{:catch error}
			<p>
				{error}
			</p>
		{/await}
	{/key}
</main>

<style>
	.nuts {
		@apply m-2 ml-0 inline-block rounded bg-amber-500 p-2 text-lg text-black;
	}
	.on-sale {
		@apply m-2 ml-0 inline-block rounded bg-pink-500 p-2 text-lg text-black;
	}
	.vegetarian {
		@apply m-2 ml-0 inline-block rounded bg-green-500 p-2 text-lg text-black;
	}

	.nice-markdown {
		@apply bg-hero-topography-light/5 border-1 rounded-xl bg-black p-2 text-white;
	}

	:global(.nice-markdown h3) {
		@apply text-3xl;
	}
	:global(.nice-markdown blockquote) {
		background: #111111;
		border-left: 10px solid #ccc;
		margin: 1.5em 10px;
		padding: 0.5em 10px;
		quotes: "\201C""\201D""\2018""\2019";
	}

	:global(.nice-markdown blockquote:before) {
		color: #ccc;
		content: open-quote;
		font-size: 4em;
		line-height: 0.1em;
		margin-right: 0.25em;
		vertical-align: -0.4em;
	}
	:global(.nice-markdown blockquote p) {
		display: inline;
	}
</style>
