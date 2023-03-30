<script>
	import Prism from "prismjs";
	let example = `
  let res = await fetch("http://127.0.0.1:1337/api/auth/local", {
			method: "POST",
			body: JSON.stringify({ identifier: "testy@testy.se", password: "Test1234" },
			headers: {
				"Content-type": "application/json",
        },
      })`;
	const html = Prism.highlight(example, Prism.languages.javascript, "javascript");
</script>

<main class="[&>*]:m-4">
	<p class="text-xl">Autentiserade requests</p>
	<p>Requests som bara inlogga användare kan göra</p>
	<p>Lägger till User i Strapi med typ Authenticated</p>
	<p>Lösenord visas inte i Strapi så får komma ihåg</p>
	<p>Själva requestet är POST för man vill skicka med info</p>
	<p>Identifier kan vara email eller username</p>
	<pre class="bg-slate-800">
  <code>
    
    {@html html}
  </code>
</pre>

	<p class="text-xl">Session storage</p>
	<p>Sparas i browser (local storage också)</p>
	<p>Session storage: Töms när vi stänger browsern (en session)</p>
	<p>
		Local storage: Stannar när vi stänger browsern (töms när man väljer att tömma eller efter tid)
	</p>
</main>

<style>
</style>
