<script>
</script>

<main class="flex flex-col gap-12 p-4">
	<div>
		<p class="text-2xl">Single types</p>
		<p>Kan bara ha en</p>
		<p>Använder singular för att accessa i API</p>
		<p>Kan vara information om ett företag i single type</p>
		<p>Kan vara information om specifika sidor på webbplatsen t.ex startpage</p>
	</div>
	<div>
		<p class="text-2xl">Components</p>
		<p>
			Inte content type egentligen, för att kunna få informationen: kasta in parameter i request
		</p>
		<p>t.ex http://localhost:1337/api/students?populate=*</p>
	</div>
	<div>
		<p class="text-2xl">Relations</p>
		<p>kan välja vilken typ (en till flera, flera till en etc)</p>
		<p>kan använda data? för att se om data är valid istället för att få error</p>
	</div>
</main>

<style>
</style>
