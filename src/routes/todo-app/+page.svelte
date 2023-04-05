<script>
	// Skapa en egen todo-application med Strapi.

	// 1. Skapa en Collection type för todos i Strapi.
	// 2. Varje todo ska ha en titel, beskrivning samt en boolean för om den är utförd eller inte.
	// 3. Gör det möjligt för användaren att kunna skapa upp todos i din applikation.
	// 4. Kräv sedan att användaren loggar in för att kunna se alla todos samt skapa nya samt redigera/ta bort todos .
	// 5. Varje todo ska ha en delete-knapp bredvid. Gör det möjligt för användaren att ta bort todos från API:et.
	// 6. Varje todo ska ha en redigera-knapp knapp bredvid. När man klickar på den ska input-fält för att fylla i titel och beskrivning dyka upp, där användaren kan redigera dessa. Gör så att input-fälten är ifyllda med de nuvarande värdena.
	// 7. Skapa funktionalitet för att utföra todos med ett knapptryck.
	// 8. Dela upp dina todos i en “Att göra”-lista samt en “Avklarade ärenden”-lista.

	import { fly, fade } from "svelte/transition";
	import LoginRegister from "$lib/LoginRegister.svelte";
	import TodoList from "$lib/TodoList.svelte";
	import { sendRequest } from "$lib/api";

	let showLoginPopup = false;
	let myUser = {};
	let addModal = false;
	let todos = [];
	let todoTitle;
	let todoDescription;
	let todoDone;
	$: {
		if (myUser.hasOwnProperty("user")) {
			setTodos();
			showLoginPopup = true;
			setTimeout(() => {
				showLoginPopup = false;
			}, 1500);
		}
	}

	async function setTodos() {
		todos = await getTodos();
	}

	let deleteTodo = async (id) => {
		const deleteTodo = await sendRequest("DELETE", `http://127.0.0.1:1337/api/todos/${id}`);
		todos = todos.filter((todo) => todo.id !== id);
		return deleteTodo;
	};

	function updateTodoList(updatedTodo) {
		const index = todos.findIndex((todo) => todo.id === updatedTodo.id);
		todos[index] = updatedTodo;
		todos = [...todos]; // Trigger reactivity
	}

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

	export function clearInputs() {
		todoTitle = "";
		todoDescription = "";
		todoDone = false;
	}
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
		
			
				<TodoList {todos} {deleteTodo} {updateTodoList} done={false} />
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
	:global(body) {
		overflow: overlay;
	}
</style>
