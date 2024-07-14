---
title: circonscription
---

# détail pour la circonscription

```js
import * as lg from '../components/legislatives.js'

const code_circo = location.hash.substring(1)
const code_departement = code_circo.slice(0,2)
const num_circo = code_circo.slice(-2).padStart(3, "0")
const candidats_france = (await d3.csv("https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2024_t1_candidats.csv"))
const candidats = candidats_france.filter(circo => circo.CodCirc2 == code_circo)
```

- Département : ${code_departement}
- Numéro de circonscription : ${num_circo}

## 2024

### liste des candidats

```js
Inputs.table(candidats)
```

### premier tour

```js
const resultats_2024_t1 = (
	(await lg.fetch_votes(2024, 1))
	.filter(aq.escape(d=> d.CodCirc2 == code_circo))
)

const resultats_2024_t2 = (
	(await lg.fetch_votes(2024, 2))
	.filter(aq.escape(d=> d.CodCirc2 == code_circo))
	.objects()
)

const CodReg = resultats_2024_t1.get('CodReg')
const CodDpt = resultats_2024_t1.get('CodDept')
const CodCirc = resultats_2024_t1.get('CodCirc')
```

```js
const t1_resultats_url = `https://www.resultats-elections.interieur.gouv.fr/legislatives2024/ensemble_geographique/${CodReg}/${CodDpt}/${CodCirc}/index.html`
```

${html`<a href="${t1_resultats_url}">Résultats officiels</a>`}


```js
Inputs.table(resultats_2024_t1)
```

```js
const voix_plot = (resultats, couleurs, voix_t1) => {
	const threshold_qualification = (
		.125
		* d3.max(resultats.map(d => d.NbVoix))
		/ (d3.max(resultats.map(d => d.RapportInscrits)) / 100)
	)
	
	const threshold_elu = (
		.5
		* d3.max(resultats.map(d => d.NbVoix))
		/ (d3.max(resultats.map(d => d.RapportExprimes)) / 100)
	)
	
	const fill = (couleurs) ? d => couleurs[d.CodNuaCand] || couleurs['DEF'] : 'black'
	
	return Plot.plot({
		marginLeft: 150,
		marginRight: 50,
		x: {
			label: 'nombre de voix',
			grid: true,
			tickFormat: x => x.toLocaleString('fr')
		},
		y: {
			label: null,
		},
		marks: [
			Plot.rectX(
				resultats,
				{
					y: "NomPsn",
					x: "NbVoix",
					sort: {
						y: "-x"
					},
					fill
				}
			),
			(resultats[0].tour == 1) ? Plot.ruleX(
				[
					threshold_qualification,
					threshold_elu
				], {
				strokeDasharray: [2,1]
			}) : undefined,
			(resultats[0].tour == 1) ? Plot.text([
				['12,5 % des inscrits', threshold_qualification],
				['50,0 % des votants', threshold_elu],
			], {
				text: d => d[0],
				x: d => d[1],
				y: d=> d3.greatest(resultats, d=>d.NbVoix).NomPsn,
				lineAnchor: 'bottom',
				dy: -16
			}) : undefined,
			(voix_t1) ? Plot.tickX(
				voix_t1, {
					x: d => d[1],
					y: d => d[0],
					stroke: 'white',
					strokeDasharray: [2,1]
				}
			) : undefined
		]
	})
}

display(voix_plot((resultats_2024_t1).objects(), lg.nuances_colors_2024))
```

### second tour

```js
Inputs.table(resultats_2024_t2)
```

```js
voix_plot(
	resultats_2024_t2,
	lg.nuances_colors_2024,
	resultats_2024_t1
	.objects()
	.filter(d => d.Elu == "QUALIF T2")
	.map(d => [ d.NomPsn, d.NbVoix ])
)
```

## 2022

### premier tour

```js
const resultats_2022_t1 = (
	(await aq.loadCSV(
		`https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2022/t1/${code_departement}${num_circo}.csv`,
		{
			autoType:false,
			parse:{
				NbVoix: parseInt,
				RapportExprime: x => parseFloat(x.replace(',', '.')),
				RapportInscrit: x => parseFloat(x.replace(',', '.'))
			}
		}
	)).rename({
		RapportExprime: 'RapportExprimes',
		RapportInscrit: 'RapportInscrits',
	})
)
```

```js
Inputs.table(resultats_2022_t1.objects())
```

```js
voix_plot(resultats_2022_t1.objects())
```

### second tour

```js
const resultats_2022_t2 = (
	await d3.csv(`https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2022/t2/${code_departement}${num_circo}.csv`)
)
```

```js
Inputs.table(resultats_2022_t2)
```

```js
voix_plot(resultats_2022_t2)
```
