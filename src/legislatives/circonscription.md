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
```

```js
Inputs.table(resultats_2024_t1)
```

## 2022

### premier tour

```js
const resultats_2022_t1 = (
	await d3.csv(`https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2022/t1/${code_departement}${num_circo}.csv`)
)
```

```js
Inputs.table(resultats_2022_t1)
```

```js
Plot.plot({
	marginLeft: 100,
	marks: [
		Plot.rectX(resultats_2022_t1, {y: "NomPsn", x: "NbVoix"})
	]
})
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
Plot.plot({
	marginLeft: 100,
	marks: [
		Plot.rectX(resultats_2022_t2, {y: "NomPsn", x: "NbVoix"})
	]
})
```
