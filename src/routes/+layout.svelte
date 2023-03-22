<script>
	import Nav from "$lib/Nav.svelte";
	import "@unocss/reset/antfu.css";
	let routes = ["01lektion1", "prismic"];
	let prefix = "/";
</script>

<Nav {routes} {prefix} level={1} />
<slot />

<style uno:preflights uno:safelist global></style>
