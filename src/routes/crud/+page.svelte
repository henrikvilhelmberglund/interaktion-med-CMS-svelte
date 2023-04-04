<script>
	import axios from "axios";
	let methods = ["GET", "POST", "PUT", "DELETE"];

	let myItems = [];

	let addName;
	let addPrice;
	let addItem = async () => {
		let res = await axios.post("http://127.0.0.1:1337/api/items", {
			data: {
				name: addName,
				price: addPrice,
			},
		});
		let data = res.data;
		console.log(data);
		return data;
	};

	let updateID;
	let updateName;
	let updatePrice;

	let updateItemAuth = async (id) => {
		let res = await axios.put(
			`http://127.0.0.1:1337/api/items/${id}`,
			{
				data: {
					name: updateName,
					price: updatePrice,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			}
		);
		let data = res.data;
		console.log(data);
		return data;
	};

	let updateItem = async (id) => {
		let res = await axios.put(`http://127.0.0.1:1337/api/items/${id}`, {
			data: {
				name: updateName,
				price: updatePrice,
			},
		});
		let data = res.data;
		console.log(data);
		return data;
	};

	let updateItemFetch = async (id) => {
		let res = await fetch(`http://127.0.0.1:1337/api/items/${id}`, {
			method: "PUT",
			body: JSON.stringify({
				data: {
					name: updateName,
					price: updatePrice,
				},
			}),
			headers: {
				// Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		let data = await res.json();
		console.log(data);
		return data;
	};

	let deleteID;
	let deleteItemFetch = async (id) => {
		let res = await fetch(`http://127.0.0.1:1337/api/items/${id}`, {
			method: "DELETE",
		});
		let data = await res.json();
		console.log(data);
		return data;
	};

	let deleteItem = async (id) => {
		let res = await axios.delete(`http://127.0.0.1:1337/api/items/${id}`);
		let data = res.data;
		console.log(data);
		return data;
	};

	let addItemFetch = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/items", {
			method: "POST",
			body: JSON.stringify({
				data: {
					name: "giraffe",
					price: 12000,
				},
			}),
			headers: {
				// Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});

		// let res = await axios.get("http://127.0.0.1:1337/api/items");

		let data = await res.json();
		// console.log(res);
		console.log(data);
		return data;
	};

	let getItems = async () => {
		// let res = await fetch("http://127.0.0.1:1337/api/items", {
		// headers: {
		// 	Authorization: `Bearer ${sessionStorage.getItem("token")}`,
		// },
		// });

		let res = await axios.get("http://127.0.0.1:1337/api/items");
		let data = res.data;
		// console.log(res);
		console.log(data.data);
		return data.data;
	};
	// getItems();
</script>

<main class="[&>*]:m-4">
	<h1 class="text-5xl">CRUD</h1>
	{#each methods as method}
		{#if method === "GET"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<button
					on:click={async () => {
						myItems = await getItems();
						console.log(myItems);
					}}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">Run GET (axios)</button>
				{#if myItems}
					{#each Object.values(myItems) as { attributes: { name, price } }}
						<p>{name} ({price} kr)</p>
					{/each}
				{/if}
			</div>
		{:else if method === "POST"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<input class="rounded border p-1" placeholder="name" type="text" bind:value={addName} />
				<input class="rounded border p-1" placeholder="price" type="number" bind:value={addPrice} />
				<button
					on:click={async () => addItemFetch()}
					class="rounded-md  bg-green-400  p-4 hover:bg-green-500">
					Run POST</button>
				<button
					on:click={async () => addItem()}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run POST (axios)</button>
			</div>
		{:else if method === "PUT"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<input class="rounded border p-1" placeholder="id" type="number" bind:value={updateID} />
				<input class="rounded border p-1" placeholder="name" type="text" bind:value={updateName} />
				<input
					class="rounded border p-1"
					placeholder="price"
					type="number"
					bind:value={updatePrice} />
				<button
					on:click={async () => updateItemAuth(updateID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run PUT (axios auth)</button>
				<button
					on:click={async () => updateItem(updateID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run PUT (axios)</button>
				<button
					on:click={async () => updateItemFetch(updateID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run PUT</button>
			</div>
		{:else if method === "DELETE"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<input class="rounded border p-1" type="number" bind:value={deleteID} />
				<button
					on:click={async () => deleteItem(deleteID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run DELETE (axios)</button>
				<button
					on:click={async () => deleteItemFetch(deleteID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run DELETE</button>
			</div>
		{/if}
	{/each}
</main>

<style>
</style>
