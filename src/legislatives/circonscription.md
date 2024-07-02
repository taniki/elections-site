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
const voix_plot = (resultats) => Plot.plot({
	marginLeft: 150,
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
				}
			}
		),
	]
})

display(voix_plot(resultats_2024_t1))
```

## 2022

### premier tour

```js
const resultats_2022_t1 = (
	await d3.csv(
		`https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2022/t1/${code_departement}${num_circo}.csv`,
		{
			autoType:false,
			parse:{
				NbVoix: parseInt
			}
		}
	)
)
```

```js
Inputs.table(resultats_2022_t1, { sort: "NbVoix" })
```

```js
voix_plot(resultats_2022_t1)
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
