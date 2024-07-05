---
title: la vague
---

# la vague brune
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


<div class="caution">

Cette visualisation utilise pour l'instant les résultats du premier tour des législatives de 2022 mais le but c'est d'utiliser les résultats du second tour.

</div>


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
	  lg2022_margins,
	  Plot.stackY2({
		x: d => d[1].margin,
		y: 1,
		fy: d => d[1].winner.group,
		href: d => `/legislatives/circonscription#${d[0]}`,
		symbol: 'square',
		order: d => {
			const lg2024_winner =lg2024_winners.get(d[1].winner.CodCirc2).winner
			const sameGroup = d[1].winner.group != lg2024_winner.group
			
			const o = (lg2024_winner.group in group_colors) ? Object.keys(group_colors).indexOf(lg2024_winner.group) : 100

			return (sameGroup) ? o : 1000
		},
		fill: d => {
			const lg2024_winner =lg2024_winners.get(d[1].winner.CodCirc2).winner
			const sameGroup = d[1].winner.group != lg2024_winner.group
			
			return (sameGroup) ? ((lg2024_winner.group in group_colors) ? group_colors[lg2024_winners.get(d[1].winner.CodCirc2).winner.group] : '#666') : '#bbb'
		}
	  })
	),
	Plot.ruleY([0]),
	Plot.axisX({ facetAnchor: null, tickFormat: d => `${d} %` })
  ]
})
```

## données

```js
import * as lg from '../components/legislatives.js'
```

```js echo
const lg2022_t1 = (await lg.fetch_votes(2022, 1)).objects()
const lg2022_t2 = (await lg.fetch_votes(2022, 2)).objects()
const lg2024_t1 = (await lg.fetch_votes(2024, 1)).objects()
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
		margin,
		d => d.CodCirc2
	)
)

//display(lg2022_margins)
```

```js
const lg2024_winners = (
	d3
	.rollup(
		lg2024_t1,
		d => {
			let winner = d3.greatest(structuredClone(d), d=>d.NbVoix)
			
			winner.group = (winner.CodNuaCand in groups) ? groups[winner.CodNuaCand] : winner.CodNuaCand
			
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

## fonctions

### calcul de la marge

```js echo
const margin = (data) => {
	const circonscription_code = data.CodCirc2

	const candidats = d3.sort(structuredClone(data), d => d.NbVoix).reverse()
	let winner = undefined
	let margin = undefined

	if (candidats.map(d=>d.Elu).includes('oui')){
		winner = candidats.find(d => d.Elu == "oui")
	} else {
		const winner_t2 = (
			lg2022_t2.find(d => (d.CodCirc2 == candidats[0].CodCirc2) && (d.Elu == "oui"))
		)
		
		winner = candidats.find(d => d.NumPanneauCand == winner_t2.NumPanneauCand)
		winner['group'] = (winner.CodNua in groups)? groups[winner.CodNua] : winner.CodNua

		margin = parseInt(winner.RapportExprime - d3.greatest(candidats.filter(d=>d.NumPanneauCand != winner.NumPanneauCand)).RapportExprime)
	}

	return {
		winner,
		margin
	}
}
```