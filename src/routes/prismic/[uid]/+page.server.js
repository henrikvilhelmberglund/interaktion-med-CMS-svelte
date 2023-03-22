export const prerender = false;

import createClient from "$lib/prismicio";
import * as prismicH from "@prismicio/helpers";

const client = createClient();
// const prismicQuery = client.getByUID("homepage", "homepage");
// const prismicQuery = client.getSingle("homepage");

export async function load({ fetch, request, params }) {
	// const myUID = params; // Update for the UID of your homepage
	console.log(params);
	const client = createClient({ fetch, request });
	const document = await client.getByUID("blog_post", params.uid);

	if (document) {
		return { document };
	}

	// error(404, "Not found");
}
