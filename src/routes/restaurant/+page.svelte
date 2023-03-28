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

</script>

<main class="[&>*]:m-4">
	<h1 class="text-2xl">Restaurant Ankademin</h1>

	{#await getData()}
		<p>Loading...</p>
	{:then results}
		<div class="flex w-[50%] p-2 [&>*]:m-2">
			{#each sorted(Object.values(results.data)) as { id, attributes: { name, price, categories } }, i (id)}
				<div
					class="rounded-md bg-slate-300 p-2"
					animate:flip={{ delay: i * 50, duration: 1000, easing: quintOut }}>
					<p>
						{name}
					</p>
					<p>
						{price}
					</p>
					<ul class="list-disc pl-5">
						{#each Object.values(categories.data) as { attributes: { name: categoryName } }}
							<li>
								{categoryName}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	{:catch error}
		<p>
			{error}
		</p>
	{/await}
</main>

<style>
</style>
