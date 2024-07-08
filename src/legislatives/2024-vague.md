---
title: la vague
---

# la vague
## visualiser la résilience des sortant·es

## inspiration

https://x.com/jburnmurdoch/status/1809192067991531578



## preuve de concept

Chaque carré représente une circonscription gagnée lors des élections législatives de 2022.
Chaque graphique représente ensuite les différentes grandes familles politiques : la gauche, plus ou moins unie depuis 2022 ; le camp présidentielle qui était alors majoritaire ; la droite ; et enfin l'extrême droite et ses alliés.

Les carrés sont ensuite regroupés et empilé en fonction de la marge lors de l'élection précédente.

La marge permet d'avoir une approximation de la solidité du vote d'un·e député·e en calculant la différence entre son score au premier tour avec l'autre candidat·e ayant fait le plus grand score.
Pourquoi pas juste l'écart entre la première position et la seconde ?
Parce que la personne élue peut avoir été seconde puis avoir profiter d'un report de voix favorable.
Sa marge est alors négative.
On peut interpréter cela comme une fragilité locale de l'élection.


```js
Plot.legend({
	type: 'categorical',
	color:{
		domain: [
			"circonscription ne changeant pas de nuance",
			"circonscription passant au NFP",
			"circonscription passant à Ensemble",
			"circonscription passant à Les Républicains",
			"circonscription passant à LR-RN",
			"circonscription passant au Rassemblement nationale",
		],
		range: [
			'#bbb',
			lg.nuances_colors['NFP'],
			lg.nuances_colors['ENS'],
			lg.nuances_colors['LR'],
			lg.nuances_colors['UXD'],
			lg.nuances_colors['RN'],
		]
	}
})
```

```js echo
Plot.plot({
  width,
  aspectRatio: 1,
  x: {
	  label: "marge",
	  tickFormat: d => `${d} %`
  },
  y: {
	grid: true,
  },
  fy:{
	  domain: ['NFP', 'ENS', 'LR', 'RN']
  },
  color: {
	  legend:true
  },
  marks: [
	Plot.dot(
	  changes_2022_2024,
	  Plot.stackY2({
		x: d => parseInt(d.lg2022.margin),
		y: 1,
		r: 5,
		fy: d => d.lg2022.winner.group,
		href: d => `/legislatives/circonscription#${d.circonscription}`,
		symbol: 'square',
		order : d => order(d),
		fill,
	  })
	),
	Plot.ruleY([0]),
	Plot.axisX({ facetAnchor: null, tickFormat: d => `${d} %` })
  ]
})
```
## toutes les circonscriptions

```js
Plot.plot({
  width,
  aspectRatio: 1,
  x: {
	  label: "marge",
	  tickFormat: d => `${d} %`
  },
  y: {
	grid: true,
  },
  fy:{
	  domain: ['NFP', 'ENS', 'LR', 'RN']
  },
  color: {
	  legend:true
  },
  marks: [
	Plot.dot(
	  changes_2022_2024,
	  Plot.stackY2({
		x: d => parseInt(d.lg2022.margin),
		y: 1,
		r: 5,
		href: d => `/legislatives/circonscription#${d.circonscription}`,
		symbol: 'square',
		order : d => order(d),
		fill,
	  })
	),
	Plot.ruleY([0]),
	Plot.axisX({ facetAnchor: null, tickFormat: d => `${d} %` })
  ]
})
```


<details>

Tentative avec `Plot.cell()` pas encore satisfaisante.

```js
Plot.legend({
	type: 'categorical',
	color:{
		domain: [
			"circonscription ne changeant pas de nuance",
			"circonscription passant au NFP",
			"circonscription passant à Ensemble",
			"circonscription passant à Les Républicains",
			"circonscription passant à LR-RN",
			"circonscription passant au Rassemblement nationale",
		],
		range: [
			'#bbb',
			lg.nuances_colors['NFP'],
			lg.nuances_colors['ENS'],
			lg.nuances_colors['LR'],
			lg.nuances_colors['UXD'],
			lg.nuances_colors['RN'],
		]
	}
})
```

```js echo
Plot.plot({
  width,
  aspectRatio: 1,
  x: {
	  label: "marge",
	  //tickFormat: d => `${d} %`
  },
  y: {
	axis: false,
	reverse: true
  },
  fy:{
	  domain: ['NFP', 'ENS', 'LR', 'RN']
  },
  color: {
	  legend:true
  },
  marks: [
	Plot.cell(
	  changes_2022_2024,
	  Plot.stackY2({
		x: d => parseInt(d.lg2022.margin),
		y: 1,
		fy: d => d.lg2022.winner.group,
		href: d => `/legislatives/circonscription#${d.circonscription}`,
		symbol: 'square',
		order : d => order(d),
		fill,
	  })
	),
	Plot.ruleY([0]),
	Plot.axisX({ facetAnchor: null, })
  ]
})
```

</details>

## variation en scatterplot

L'idée était de voir s'il était facile d'avoir une représentation avec des cercles.
Dans Observable Plot, il n'y a pas de façon simble de les disperser pour éviter les superpositions.
C'est donc pas très utilisable ou lisible mais peut servir de base pour d'autres explorations.
En utilisant d3 par exemple.

Il y a petit côté [Hans Rosling](https://www.gapminder.org/) intéressant.

```js
Plot.plot({
	width,
	aspectRatio: 1,
    x: {
		label: "marge en 2022",
		tickFormat: d => `${d} %`,
		grid: true,
	},
	y: {
		label: "marge en 2024",
	  	tickFormat: d => `${d} %`,
	  	grid: true,
	},
    fy:{
		  domain: ['NFP', 'ENS', 'LR', 'RN']
	},
	marks: [
		Plot.dot(
			changes_2022_2024,
			{
				href: d => `/legislatives/circonscription#${d.circonscription}`,
				x: d => d.lg2022.margin,
				y: d => d.lg2024.margin,
				r: 8,
				fy: d => d.lg2022.winner.group,
				opacity: 0.8,
				fill,
				stroke: 'white',
				sort: d => order(d, -1),
			}
		),
		Plot.axisX({ facetAnchor: null, tickFormat: d => `${d} %` })
	]
})
```

## données

```js
import * as lg from '../components/legislatives.js'
```

```js echo
const lg2022_t1 = (await lg.fetch_votes(2022, 1)).rename({
	RapportExprime: 'RapportExprimes',
	RapportInscrit: 'RapportInscrits'
}).objects()
const lg2022_t2 = (await lg.fetch_votes(2022, 2)).rename({
	RapportExprime: 'RapportExprimes',
	RapportInscrit: 'RapportInscrits'
}).objects()
const lg2024_t1 = (await lg.fetch_votes(2024, 1)).objects()
const lg2024_t2 = (await lg.fetch_votes(2024, 2)).objects()
```

```js echo
const groups = {
	NUP: 'NFP',
	UG: 'NFP',
	UDI: 'ENS',
	HOR: 'ENS',
	//UXD: 'RN'
}

const group_colors = lg.nuances_colors
```

```js echo
const lg2022_margins = (
	d3
	.rollups(
		lg2022_t1,
		d => margin(d, lg2022_t2),
		d => d.CodCirc2
	)
)

//display(lg2022_margins)
```

```js
const lg2024_winners = (
	d3
	.rollup(
		lg2024_t2,
		d => {
			let winner = d3.greatest(structuredClone(d), d=>d.NbVoix)
			
			if (winner != undefined){
				winner.group = (winner.CodNuaCand in groups)
					? groups[winner.CodNuaCand]
					: winner.CodNuaCand
			}
			
			return {
				winner
			}
		},
		d => d.CodCirc2
	)
)

// display(lg2024_winners)
// display([...lg2024_winners.keys()])
```

```js echo
const changes_2022_2024 = (
	lg2022_margins
	.map(d => {
		const lg2024 = structuredClone(lg2024_winners).get(d[0])
		let change = false
		
		if (lg2024 != undefined){
			if (lg2024.winner != undefined) change = d[1].winner.group != lg2024.winner.group
			lg2024.margin = margin(lg2024_t1.filter(c => c.CodCirc2 == d[0]), lg2024_t2).margin
		}
			
		return {
			circonscription: d[0],
			lg2022: d[1],
			lg2024,
			change
		}
	})
)

display(changes_2022_2024)
```

## fonctions

```js
const order = (d, reverse=1) => (
	d.change
		? d.lg2024.winner.group in group_colors
			? reverse * Object.keys(group_colors).indexOf(d.lg2024.winner.group)
			: reverse * 100
		: reverse * 1000
)
```

```js
const fill = (d) => (
	d.change
		? d.lg2024.winner.group in group_colors
			? group_colors[d.lg2024.winner.group]
			: '#666'
		: '#bbb'
)
```

### calcul de la marge

```js echo
const margin = (data, t2) => {
	const circonscription_code = data.CodCirc2

	const candidats = d3.sort(structuredClone(data), d => d.NbVoix).reverse()
	let winner = undefined
	let margin = undefined

	if (candidats.map(d=>d.Elu).includes('oui')){
		winner = candidats.find(d => d.Elu == "oui")
	} else {
		const winner_t2 = (
			//t2.find(d => (d.CodCirc2 == candidats[0].CodCirc2) && (d.Elu == "oui"))
			d3.greatest(
				t2.filter(d => d.CodCirc2 == candidats[0].CodCirc2),
				d => d.NbVoix
			)
		)
		
		winner = candidats.find(d => d.NumPanneauCand == winner_t2.NumPanneauCand)
	}

	winner.group = (winner.CodNua in groups)? groups[winner.CodNua] : winner.CodNua
	margin = winner.RapportExprimes - d3.greatest(candidats.filter(d=>d.NumPanneauCand != winner.NumPanneauCand)).RapportExprimes


	return {
		winner,
		margin
	}
}
```