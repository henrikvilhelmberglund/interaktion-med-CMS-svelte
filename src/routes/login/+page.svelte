<script>
	import LoginRegister from "$lib/LoginRegister.svelte";
	let myUser = {};
	let allUsers;

	// authorization
	async function getUsers() {
		let res = await fetch("http://127.0.0.1:1337/api/users", {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});

		let data = await res.json();
		console.log(data);
		return data;
	}
</script>

<main class="[&>*]:m-4">
	<LoginRegister bind:myUser />

	{#if myUser && myUser.hasOwnProperty("user")}
		<h2 class="text-xl">Succesfully logged in! Welcome, {myUser.user.username}!</h2>
		<button
			on:click={async () => (allUsers = await getUsers())}
			class="rounded bg-blue-400 p-2 hover:bg-blue-300">Hämta alla användare</button>
		<button
			on:click={() => {
				sessionStorage.removeItem("token");
				location.reload();
			}}
			class="rounded bg-blue-400 p-2 hover:bg-blue-300">Clear token</button>

		{#if allUsers}
			{#each Object.values(allUsers) as user}
				<div class="[&>*]:m-0">
					{#each Object.entries(user) as [key, value]}
						<p>{key}: {value}</p>
					{/each}
				</div>
			{/each}
		{/if}
	{/if}
</main>

<style>
</style>
