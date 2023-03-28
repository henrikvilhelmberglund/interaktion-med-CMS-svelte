<script>
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	let possibleStudying;
	let getData = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/students");
		let data = await res.json();
		console.log(data);
		return data;
	};
	let subjectsPromise = getData();
	async function saveSubjects() {
		let subjects = await subjectsPromise;
		// Do something with subjects here

		subjects = subjects.data.map((person) => person.attributes.studying);
		subjects = [...new Set(subjects)];
		// possibleStudying = subjects;
		possibleStudying = subjects;
		return subjects;
	}

	function filtered(array, mode) {
		if (mode === "Any") {
			return array;
		}
		return array.filter((person) => person.attributes.studying === mode);
	}

	saveSubjects();

	// console.log(possibleStudying);

	let sortMode = "default";
	let modes = ["default", "descending", "ascending"];
	console.log(possibleStudying);

	function dataSorter(array, mode) {
		if (mode === "default") {
			return array;
		}
		if (mode === "descending") {
			console.log(array);
			let newArray = array;
			newArray.sort((a, b) => b.attributes.age - a.attributes.age);
			return newArray;
		}
		if (mode === "ascending") {
			let newArray = array;
			newArray.sort((a, b) => a.attributes.age - b.attributes.age);
			return newArray;
		}
	}
	let filterValue;
</script>

<main class="[&>*]:m-4">
	<h1 class="text-2xl">Strapi-frontend!</h1>
	{#each modes as mode}
		<button on:click={() => (sortMode = mode)} class="rounded bg-blue-400 p-1">{mode}</button>
	{/each}
	<select bind:value={filterValue} name="studying" id="studying">
		<option value="Any">Any</option>
		{#each possibleStudying || "" as subject}
			<option value={subject}>{subject}</option>
		{/each}
	</select>

	{#await getData()}
		<p>Loading...</p>
	{:then results}
		<div class="flex p-2 [&>*]:m-2 w-[50%]" >
			{#each dataSorter(filtered(Object.values(results.data), filterValue), sortMode) as { id, attributes: { first_name, last_name, age, studying } }, i (id)}
				<p
					animate:flip={{ delay: i * 50, duration: 1000, easing: quintOut }}
					class="rounded-md bg-slate-300 p-2">
					{first_name}
					{last_name} ({age}), studying {studying}
				</p>
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
