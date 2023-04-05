<script>
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";
	import axios from "axios";
	import LoginRegister from "$lib/LoginRegister.svelte";

	let myUser = {};
	let showLoginPopup = false;
	let petName;
	let files;
	let addedImage;

	$: {
		if (myUser.hasOwnProperty("user")) {
			showLoginPopup = true;
			console.log(myUser);
			myPets = getPets();
			setTimeout(() => {
				showLoginPopup = false;
			}, 1500);
		}
	}

	const addPet = async () => {
		// Ladda upp bild

		let finalImage;

		let imgFile = files[0];
		let formData = new FormData();
		formData.append("files", imgFile);

		try {
			finalImage = await axios.post("http://127.0.0.1:1337/api/upload", formData, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			});

			// addedImage = finalImage.

			// Skapa pet

			let response = await axios.post(
				"http://127.0.0.1:1337/api/pets?populate=deep,2",
				{
					data: {
						name: petName,
						user: myUser.user.id,
						image: finalImage.data[0].id,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					},
				}
			);

			// console.log(response.data.data.attributes);
			let newPet = response.data.data.attributes;
			// console.log("new pet", newPet)
			myPets = [...myPets, newPet];
			petName = "";
		} catch (e) {
			console.error(e);
			throw e.request;
		}
		console.log(finalImage);
		addedImage = finalImage.data[0].url;
	};

	const getPets = () => {
		console.log("user pets", myUser.user.pets);
		return myUser.user.pets;
	};
	let myPets = [];
</script>

<main class="flex flex-col items-center [&>*]:m-4">
	<h1 class="text-4xl">Strapi pets</h1>
	<button
		on:click={() => {
			sessionStorage.removeItem("token");
			location.reload();
		}}
		class="absolute right-4 rounded bg-blue-400 p-2 hover:bg-blue-300">Clear token</button>
	{#if !myUser.hasOwnProperty("user")}
		<p class="rounded-lg border-4 border-red-500 p-2">You must be logged in to see the pets.</p>
		<LoginRegister bind:myUser />
	{:else}
		<p>You are logged in as {myUser.user?.username} :)</p>
		{#each myPets as { name, image }}
			<div class="self-start rounded-lg bg-slate-300 p-2">
				<p class="mb-2 self-center rounded-lg bg-white p-2">{name}</p>
				<img class="h-72" src="http://127.0.0.1:1337{image.url ?? addedImage}" alt="" />
			</div>
		{/each}

		<input type="text" bind:value={petName} placeholder="Pet name" />
		<input type="file" bind:files />
		<button
			on:click={async () => await addPet()}
			class="rounded-lg bg-green-500 p-2 hover:bg-green-400">
			Add pet</button>
	{/if}
	{#if myUser.hasOwnProperty("user") && showLoginPopup}
		<div
			id="login-popup"
			class="z-100 absolute mt-4 rounded-lg bg-green-500 p-4"
			transition:fly={{ y: 20 }}>
			<p>Successfully logged in as {myUser.user?.username}!</p>
		</div>
	{/if}
</main>

<style>
</style>
