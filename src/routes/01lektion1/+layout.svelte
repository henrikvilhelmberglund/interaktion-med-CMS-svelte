<script>
	import Nav from "$lib/Nav.svelte";
	let routes = ["/01", "/what-is-cms"];
	let prefix = "/01lektion1";
</script>

<Nav {routes} {prefix} level={2} />
<slot />
