import { sveltekit } from "@sveltejs/kit/vite";
import UnoCSS from "unocss/vite";
import presetUno from "@unocss/preset-uno";
import presetWebFonts from "@unocss/preset-web-fonts";
import presetIcons from "@unocss/preset-icons";
import transformerDirectives from "@unocss/transformer-directives";
import { presetHeroPatterns } from "@julr/unocss-preset-heropatterns";
import { presetForms } from '@julr/unocss-preset-forms'
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetHeroPatterns(),
        presetUno(),
        presetForms(),
				presetWebFonts({
					provider: "google", // default provider
					fonts: {
						// these will extend the default theme
						sans: "Roboto",
						mono: ["Fira Code", "Fira Mono:400,700"],
						// custom ones
						lobster: "Lobster",
						lato: [
							{
								name: "Lato",
								weights: ["400", "700"],
								italic: true,
							},
							{
								name: "sans-serif",
								provider: "none",
							},
						],
						rubik: "Rubik Vinyl",
						arima: "Arima",
					},
				}),
				presetIcons({
					extraProperties: {
						display: "inline-block",
						"vertical-align": "middle",
						// ...
					},
				}),
			],
			mode: "svelte-scoped",
			transformers: [transformerDirectives()],
		}),
		sveltekit(),
	],
});
