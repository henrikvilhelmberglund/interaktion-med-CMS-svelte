<script>
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	let getData = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/dishes?populate=*");
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
		return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;
	};

	let allTypes = ["starter", "main", "dessert", "beverage"];
</script>

<svelte:head />

<main class="flex flex-col bg-black [&>*]:m-4">
	<h1 class="font-rubik text-center text-6xl text-white">Restaurant Ankademin</h1>

	{#await getData()}
		<p>Loading...</p>
	{:then results}
		<div class="bg-hero-i-like-food-light/5 bg-dark-900  flex flex-1 p-2 [&>*]:m-px">
			{#each allTypes as type}
				<h2 class="font-arima py-6 text-left text-3xl text-white">{cap(type)}</h2>
				{#each filter(sorted(Object.values(results.data)), type) as { id, attributes: { name, price, categories } }, i (id)}
					<div
						class="bg-hero-diagonal-stripes-light/1 font-arima rounded-md bg-slate-900 p-2 text-white"
						animate:flip={{ delay: i * 50, duration: 1000, easing: quintOut }}>
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
				{/each}
			{/each}
		</div>
	{:catch error}
		<p>
			{error}
		</p>
	{/await}
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
</style>
