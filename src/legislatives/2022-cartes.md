---
title: cartes des élections législatives ayant eu lieu en 2022
---

# Les cartes des élections législatives de 2022

```js
import * as legislatives from '../components/legislatives.js'
```

```js
//données
const resultats = (
	(await legislatives.fetch_votes(2022, 2))
	.transform(
		legislatives.votes_to_resultats
	)
	.concat(
		(await legislatives.fetch_votes(2022, 1))
		.filter(d=> d.Elu == "oui")
	)
)

const fond = await d3.json('https://raw.githubusercontent.com/taniki/legislatives-2024/main/sources/fond_circonscriptions_legislatives.geojson', { autoType: false })
```



```js
const fond_arr = (
	aq
	.from(fond.features.map(f => {
		const geometry = f.geometry
		const CodCirc2 = String(f.properties.code_cinq).padStart(5,'0')
		
		return {
			CodCirc2,
			geometry
		}
	}))
	.join(
		resultats
	)
)

//display(Inputs.table(fond_arr.filter(aq.escape(d => d.CodNua in nuance_color))))
```

```js
// Plot.geo(fond_arr, {
// 	geometry: 'geometry'
// }).plot({
// 	width: 400,
// 	height: 400
// })
```

## composition à l'issue du second tour

```js
const find_nuance_tete = (code_cinq) => (
	resultats
	.filter(aq.escape(d => d.CodCirc2 == code_cinq))
	.slice(0,1)
	.get('CodNua')
)

const nuance_color = {
	'NUP': '#bb1840',
	'ENS': '#ffeb00',
	'LR': '#0066cc',
	'RN': '#0d378a'
}
```

```js
Plot.plot({
	width: 600*4,
	height: 600,
	color: {
		legend: true,
		domain: Object.keys(nuance_color),
		range: Object.values(nuance_color)
	},
	x: {
		axis: null
	},
	y: {
		axis: null
	},
	fx: {
		domain: Object.keys(nuance_color)
	},
	marks: [
		Plot.geo(
			fond_arr,
			{
				geometry: 'geometry',
				strokeOpacity: 0.2
			}
		),
		Plot.geo(
			fond_arr.filter(aq.escape(d => d.CodNua in nuance_color)),
			{
				geometry : 'geometry',
				fill	 : 'CodNua',
				fx 		 : 'CodNua',
				title	 : d => console.log(`${d.NomPsn} ${d.PrenomPsn} (${d.LibNua})`),
				tip  	 : true
			}
		)
	]
})
```