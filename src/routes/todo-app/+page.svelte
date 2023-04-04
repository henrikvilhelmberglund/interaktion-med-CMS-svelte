<script>
	// Skapa en egen todo-application med Strapi.

	// 1. Skapa en Collection type för todos i Strapi.
	// 2. Varje todo ska ha en titel, beskrivning samt en boolean för om den är utförd eller inte.
	// 3. Gör det möjligt för användaren att kunna skapa upp todos i din applikation.
	// 4. Kräv sedan att användaren loggar in för att kunna se alla todos samt skapa nya samt redigera/ta bort todos .
	// 5. Varje todo ska ha en delete-knapp bredvid. Gör det möjligt för användaren att ta bort todos från API:et.
	// 6. Varje todo ska ha en redigera-knapp knapp bredvid. När man klickar på den ska input-fält för att fylla i titel och beskrivning dyka upp, där användaren kan redigera dessa. Gör så att input-fälten är ifyllda med de nuvarande värdena.
	// TODO 7. Skapa funktionalitet för att utföra todos med ett knapptryck.
	// 8. Dela upp dina todos i en “Att göra”-lista samt en “Avklarade ärenden”-lista.

	import axios from "axios";
	import LoginRegister from "$lib/LoginRegister.svelte";
	import { fly, fade } from "svelte/transition";
	import { onMount } from "svelte";

	let myUser = {};

	let addModal = false;
	let todoTitle;
	let todoDescription;
	let todoDone;
	let todos = [];
	let edit = [];

	$: {
		if (myUser.hasOwnProperty("user")) setTodos();
	}

	async function setTodos() {
		todos = await getTodos();
	}

	function clickOutside(element) {
		document.querySelector("#focus-me").focus();
		function onClick(event) {
			if (!element.contains(event.target)) {
				console.log("clicked outside of modal - closing!");
				addModal = false;
			}
		}
		document.body.addEventListener("click", onClick);
		return {
			update(newCallbackFunction) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener("click", onClick);
			},
		};
	}

	function clearInputs() {
		todoTitle = "";
		todoDescription = "";
		todoDone = false;
	}

	const sendRequest = async (method, url, data = null) => {
		try {
			const headers = {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			};
			const response = await axios({
				method,
				url,
				headers,
				data,
			});
			return response.data.data;
		} catch (e) {
			console.error(e);
			throw e.request;
		}
	};

	const getTodos = async () => {
		const data = await sendRequest("GET", "http://127.0.0.1:1337/api/todos");
		return data;
	};

	const addTodo = async () => {
		const requestData = {
			data: {
				title: todoTitle,
				description: todoDescription,
				done: todoDone,
			},
		};

		const newTodo = await sendRequest("POST", "http://127.0.0.1:1337/api/todos", requestData);
		addModal = false;
		clearInputs();
		todos = [...todos, newTodo];

		return newTodo;
	};

	let updateTodo = async (id) => {
		const requestData = {
			data: {
				title: todoTitle,
				description: todoDescription,
				done: todoDone,
			},
		};

		const updatedTodo = await sendRequest(
			"PUT",
			`http://127.0.0.1:1337/api/todos/${id}`,
			requestData
		);
		let updatedTodos = todos.map((todo) => {
			if (todo.id === updatedTodo.id) {
				return updatedTodo;
			} else {
				return todo;
			}
		});
		todos = updatedTodos;
		edit[id] = false;
		clearInputs();
		return updatedTodo;
	};

	let deleteTodo = async (id) => {
		const deleteTodo = await sendRequest("DELETE", `http://127.0.0.1:1337/api/todos/${id}`);
		todos = todos.filter((todo) => todo.id !== id);
		return deleteTodo;
	};
</script>

<main class="flex flex-col items-center [&>*]:m-4">
	<div class="flex w-full flex-row items-center justify-between">
		<h1 class="mx-auto text-5xl">My TODOs</h1>

		<button
			on:click={() => {
				sessionStorage.removeItem("token");
				location.reload();
			}}
			class="absolute right-4 rounded bg-blue-400 p-2 hover:bg-blue-300">Clear token</button>
	</div>

	{#if todos.length > 0}
		<div class="border-1 h-[600px] overflow-auto rounded-md border-green-500 p-2 [&>*]:m-2">
			{#each Object.values(todos) as { id, attributes: { title, description, done } }}
				<div
					transition:fly={{ y: 30 }}
					class:bg-green-200={done}
					class="flex max-w-[600px] flex-row justify-between rounded-lg bg-blue-200 p-4">
					{#if !edit[id]}
						<div class="flex-col">
							<h2 class="p-1 text-2xl">{title}</h2>
							<p class="p-1">{description}</p>
							<input
								type="checkbox"
								class="h-6 w-6 self-start"
								checked={done}
								disabled
								name=""
								id="" />
						</div>
						<div class="flex w-20 flex-row items-start justify-end [&>*]:m-2">
							<button
								on:click={async () => {
									edit = [];
									todoTitle = title;
									todoDescription = description;
									todoDone = done;
									edit[id] = true;
								}}
								class="p-4">✏</button>
							<button on:click={async () => deleteTodo(id)} class="p-4">❌</button>
						</div>
					{:else}
						<div class="flex-col">
							<textarea
								on:input={() => {
									event.target.style.height = event.target.scrollHeight + "px";
								}}
								class="h-[40px] p-1 text-2xl"
								bind:value={todoTitle} />
							<!-- <h2 class="text-2xl">{title}</h2> -->
							<textarea
								cols="54"
								on:input={() => {
									event.target.style.height = event.target.scrollHeight + "px";
								}}
								class="h-[40px] p-1 "
								bind:value={todoDescription} />

							<input
								type="checkbox"
								class="h-6 w-6 self-start"
								bind:checked={todoDone}
								name=""
								id="" />
						</div>
						<div class="flex w-20 flex-row items-start justify-end [&>*]:m-2">
							<button
								on:click={async () => {
									if (done === todoDone && title === todoTitle && description === todoDescription) {
										edit[id] = false;
										todoTitle = "";
										todoDescription = "";
										todoDone = false;
										return;
									}
									updateTodo(id);
								}}
								class="p-4">✅</button>

							<button on:click={async () => deleteTodo(id)} class="p-4">❌</button>
						</div>
					{/if}
				</div>
			{/each}

			<!-- <p>Error! {error.status}</p> -->
		</div>
	{/if}
	{#if !myUser.hasOwnProperty("user")}
		<p class="rounded-lg border-4 border-red-500 p-2">You must be logged in to see the TODOs.</p>
		<LoginRegister bind:myUser />
	{:else}
		{#if !addModal}
			<div in:fly={{ y: 20 }} class="flex items-center justify-center">
				<button
					on:click={() => {
						event.stopPropagation();
						addModal = true;
					}}
					class="w-14 rounded-full border-4 border-solid border-blue-500 font-sans text-5xl text-blue-500 hover:border-blue-900 hover:bg-blue-900 hover:text-white">
					+</button>
			</div>
		{/if}
		{#if addModal}
			<div in:fade class="fixed inset-0 !m-0 bg-white " />
			<form
				in:fly={{ y: 20 }}
				use:clickOutside
				class="border-1 fixed top-[40%] left-[50%] mx-auto flex w-[30%] translate-y-[-50%]  translate-x-[-50%] flex-col rounded-md border-green-500 p-2 [&>*]:m-2">
				<input
					id="focus-me"
					class="rounded border p-1"
					placeholder="title"
					type="text"
					bind:value={todoTitle} />
				<input
					class="rounded border p-1"
					placeholder="description"
					type="text"
					bind:value={todoDescription} />
				<input
					class="rounded border p-1"
					bind:value={todoDescription}
					bind:checked={todoDone}
					type="checkbox" />

				<button
					on:click={async () => {
						addTodo();
					}}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Add TODO</button>
			</form>
		{/if}
	{/if}
</main>

<style>
	:global(body) {
		overflow: overlay;
	}
</style>
