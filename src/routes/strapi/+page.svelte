<script>
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	let possibleStudying;

	let getSchoolData = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/school?populate=*");
		let data = await res.json();
		console.log(data);
		return data;
	};

	let getData = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/students?populate=*");
		let data = await res.json();
		console.log(data);
    saveSubjects();
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


	// console.log(possibleStudying);

	let sortMode = "default";
	let modes = ["default", "descending", "ascending"];

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

	{#await getSchoolData()}
		<p>Loading...</p>
	{:then { data: { attributes: { name, motto, location: { country, city }, contact } } }}
		<div class="w-[50%] rounded-xl bg-blue-300 p-8 ">
			<p class="text-3xl">{name}</p>
			<p class="text-base italic">{motto}</p>
			<p class="text-base">We are located in {city} in {country}.</p>
			<span
				>Contact us at <a class="inline text-blue-700" href="mailto:{contact}">{contact}</a></span>
		</div>
	{/await}

	{#await getData()}
		<p>Loading...</p>
	{:then results}
		<div class="flex w-[50%] p-2 [&>*]:m-2">
			{#each dataSorter(filtered(Object.values(results.data), filterValue), sortMode) as { id, attributes: { first_name, last_name, age, studying, courses, teacher } }, i (id)}
				<div
					class="rounded-md bg-slate-300 p-2"
					animate:flip={{ delay: i * 50, duration: 1000, easing: quintOut }}>
					<p>
						{first_name}
						{last_name} ({age}), studying {studying}
					</p>
					<p>
						{first_name}'s courses are:
					</p>
					<ul class="list-disc pl-5">
						{#each courses as { name, yh_points }}
							<li>
								{name} ({yh_points})
							</li>
						{/each}
					</ul>
					{#if teacher.data}
						{@const {
							name: teacher_name,
							age: teacher_age,
							email: teacher_email,
						} = teacher.data.attributes}
						<p>
							{first_name}'s teacher is {teacher_name} ({teacher_age}) who can be contacted at
							<a class="inline text-blue-700" href="mailto:{teacher_email}">{teacher_email}</a>
						</p>
					{/if}
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
