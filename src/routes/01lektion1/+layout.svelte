<script>
	import Nav from "$lib/Nav.svelte";
	let routes = ["/01"];
	let prefix = "/01lektion1";
</script>

<Nav {routes} {prefix} level={2} />
<slot />
