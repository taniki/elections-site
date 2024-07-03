---
title: cartogramme des résultats du premier des élections législatives 2024
---

# cartogramme des résultats du premier des élections législatives 2024

Tentative d'utilisation des [circogrammes](/legislatives/circogramme) dans un contexte cartographique.
L'intention est de s'éloigner des effets d'optique provoqués par la représentation des territoires sous forme de surfaces.
Un effet secondaire est de redonner de la visibilité à la diversité des seconds et aux troisièmes en évitant ainsi le côté *winner takes all* même si c’est le résultat final.

```js
import * as lg from '../components/legislatives.js'
import { circogramme } from '../components/circogramme.js'

//const resultats = (await lg.fetch_votes(2024, 1))
const departements_pos = (
	(await d3.csv('https://docs.google.com/spreadsheets/d/1-bJ-huxDuxPRFyO9jlCSjZg20RTBPFkIqzDlhYpw3Bc/gviz/tq?tqx=out:csv&sheet=départements'))
	.map(d => ({
			...d,
			x: parseInt(d.x),
			y: parseInt(d.y) + 4,
			w: parseInt(d.w)
		})
	)
)

const colors = lg.nuances_colors

const resultats = (
	d3
	// there is a lot of non sense around. still learning arquero
	.groups(
		(
			(await lg.fetch_votes(2024, 1))
			.filter(aq.escape(d=> ["OUI", "QUALIF T2"].includes(d.Elu)))
			.orderby(aq.desc('NbVoix'))
		),
		d => d.CodCirc2,
		d => ({
			party: d.CodNuaCand,
			voices: d.NbVoix,
			color: (d.CodNuaCand in colors) ? colors[d.CodNuaCand] : '#aaa'
		})
	)
	.sort((a,b) => a[0].localeCompare(b[0]))
	.map((x) => ([ x[0],  x[1].map(d => d[0])]))
)

// display(departements_pos)
// display(resultats)
```

```js echo
const width = 1600
const height= 1600

const square_size = 23
const gutter = 2

const doc = (new DOMParser).parseFromString((await FileAttachment('../assets/carte-uniquement.svg').text()), "image/svg+xml")
const fond = d3.select(doc.documentElement).remove()

const main = (
	d3
	.create('svg')
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [0, 0, width, height])
	.attr("style", "max-width: 100%; height: auto;")
)

const plot_fond = () => main.node().appendChild(fond.node())

const plot_departements = () => {
	const departements = (
		main
		.selectAll(".departement")
		.data(departements_pos)
		.enter()
			.append('g')
				.attr("class", "departement")
				.attr("id", d => `departement-${d.CodDpt}`)
	)
	
	departements
		.append('rect')
		.attr("class", "placeholder")
		.attr('width', d => d.w * square_size - gutter)
		.attr('height', d => d.w * square_size - gutter)
		.attr('x', d => d.x * square_size)
		.attr('y', d => d.y * square_size)
		.attr('stroke', 'black')
		.attr('fill', 'transparent')
	
	departements
		.append('text')
		.attr("class", "title")
		.attr('x', d => d.x * square_size)
		.attr('y', d => d.y * square_size)
		.attr('dx', 1)
		.attr('dy', -5)
		.text(d => d.LibDpt)
		
	departements
		.append(d => {
			const departement_resultat = (
				resultats
				.filter(c => c[0].slice(0, 2) == d.CodDpt)
			)

			//display(departement_resultat)

			const g = d3
				.create('g')
			
			// const circoncriptions = g
			// 	.selectAll('.circonscription')
			// 	.data(departement_resultat)
			// 	.enter()
			// 		.append('g')
			// 		.attr('class', 'circonscription')
			// 		.attr('id', c => `circonscription-${c[0]}`)
			// 		.append('rect')
			// 			.attr('fill', 'red')
			// 			.attr('width', square_size)
			// 			.attr('height', square_size)
			// 			.attr('x', c => d.x * square_size)
			// 			.attr('y', c => d.y * square_size)
						
					// .append((c,i) => {
					// 	const x = ((i % d.w) + d.x) * square_size
					// 	const y = (d.y + Math.floor(i/d.w)) * square_size
					// 	
					// 	return (
					// 		circogramme(c[1], square_size, square_size)
					// 			.attr('width', square_size)
					// 			.attr('height', square_size)
					// 			.attr('x', x)
					// 			.attr('y', y)
					// 			.node()
					// 	)
					// })
			//display(g)
			return g.node()
		})
}

plot_fond()
plot_departements()

const circonscriptions = (
	main
	.selectAll('.circonscription')
	.data(resultats)
	.enter()
		.append('g:a')
		.attr('class', 'circonscription')
		.attr("xlink:href", d => `/legislatives/circonscription#${d[0]}`)
		.append((circo,i) =>{
			const departement = departements_pos.find(d => d.CodDpt == circo[0].slice(0,2))
			const j = (
				resultats
				.filter(d=>d[0].slice(0,2) == circo[0].slice(0,2))
				.map(d => d[0])
				.indexOf(circo[0])
			)
			const x = ((j % departement.w) + departement.x) * square_size
			const y = (departement.y + Math.floor(j/departement.w)) * square_size
			
			return (
				circogramme(circo[1], square_size-gutter, square_size-gutter)
				.attr('transform', `translate(${x} ${y})`)
				.node()
			)
		})
)

display(main.node())
```

