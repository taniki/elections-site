---
title: Le front républicain
---

# le front républicain en 2024

```js
import * as lg from '../components/legislatives.js'
import { circogramme } from '../components/circogramme.js'
```

```js
const opts = view(
	Inputs.checkbox(
		['circogramme'],
		{
			value: ['circogramme'],
			label: 'afficher sous forme de '
		}
	)
)
```

## circonscriptions où le/la candidate a été élu·es dès le premier tour

```js
const t1_direct = (
	resultats_t1
	.filter(d => d[1].map(c => c.Elu).includes("OUI"))
)

// display(t1_direct)

familles.forEach(f => {
	const t1 = (
		t1_direct
		.filter(d => {
			const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
			return candidats[0].CodNuaCand == f
		})
	)
	
	if (t1.length > 0){
		const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1)}</td></tr>`
		display(h)
	}
})
```

## les circonscriptions où le front républicain est en tête

<div class="grid grid-cols-2">
<div>

Elles sont ${qualif_t1.filter(d=> !ED.includes(d3.greatest(d[1]).CodNuaCand)).length}.
C'est une bonne base.
Elles peuvent certaintement basculer d'Ensemble vers le Nouveau Front Populaire, ou l'inverse.
C'est important mais on peut mettre ce détail de côté pour l'instant.

</div>
<div>

```js
const qualif_t1 = (
	resultats_t1
	.filter(d=>!d[1].map(c=>c.Elu).includes('OUI'))
)

//display(qualif_t1.length + t1_direct.length)
//display(qualif_t1)
```

```js
const t1_rnpos1_not =  (
	qualif_t1
	.filter(d => !ED.includes(d3.greatest(d[1], d=> d.NbVoix).CodNuaCand))
)

//display(t1_rnpos1_not)

familles.forEach(f => {
	const t1 = (
		t1_rnpos1_not
		.filter(d => {
			const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
			return candidats[0].CodNuaCand == f
		})
	)
	
	if (t1.length > 0){
		const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1)}</td></tr>`
		display(h)
	}
})
```

</div>
</div>

## circonscriptions où le RN et ses alliés est en tête

```js
const t1_rnpos1 = (
	qualif_t1
	.filter(d => ED.includes(d3.greatest(d[1], d=> d.NbVoix).CodNuaCand))
)

// display(t1_rnpos1)

familles.forEach(f => {
	const t1 = (
		t1_rnpos1
		.filter(d => {
			const candidats = d[1] //d3.sort(d[1], d=> d.NbVoix).reverse()
			return candidats[0].CodNuaCand == f
		})
	)
	
	if (t1.length > 0){
		const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1)}</td></tr>`
		display(h)
	}})
```

<div class="grid grid-cols-2">
<div>


### circonscriptions perdues d'avance


On considère que les circonscriptions fonts plus que le second et le troisième sont perdues d'avance.
Il y en a ${t1_rnpos1_sup.length} en tout.

```js
const t1_rnpos1_sup = (
	t1_rnpos1
	.filter(d=>{
		const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
		return (candidats[0].NbVoix > d3.sum(candidats.slice(1,3), d=>d.NbVoix))
	})
)
```

```js
familles.forEach(f => {
	const t1 = t1_rnpos1_sup.filter(d => {
		const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
		return candidats[0].CodNuaCand == f
	})
	
	const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1,0)}</td></tr>`
	
	display(h)
})
```
</div>
<div>


### circonscriptions où le RN peut être vaincu

#### RN < second et troisième

Imaginons un scénario où tous les partis politiques ainsi que la population joue le jeu d'un front républicain fort.
Toutes les personnes qui auraient voter pour le candidat en troisième position vote pour le second quelque soit le camp.
Le but est simple minimiser le nombre de sièges du RN et de ses alliés à l'Assemblée nationale.


```js
const t1_rnpos1_inf = (
	t1_rnpos1
	.filter(d=>{
		const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
		return (candidats[0].NbVoix < d3.sum(candidats.slice(1,3), d=>d.NbVoix))
	})
)
```

```js
familles.filter(f => !ED.includes(f)).forEach(f => {
	const t1 = t1_rnpos1_inf.filter(d => {
		const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
		return candidats[1].CodNuaCand == f
	})
	
	const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1,1)}</td></tr>`
	
	display(h)
})
```

</div>
</div>

## version interactive

Une simulation relativement claquée de ce qui se passerait pour les circonscriptions où le RN est en tête et qu'un certain pourcentage (`pct_report`) des votes de la personne en troisième position se reportait sur la seconde.

```js
const pct_report = view(
	Inputs
	.range(
		[0,1],
		{
			value: 0.5, label: 'pourcentage de report de la troisième vers la seconde',
			step: 0.01
		}
	)
)
```

```js
const sim = (t1, pct) => (
	t1
	.map(d => {
		let sim = structuredClone(d)
		const candidats = (
			d3
			.sort(sim[1], d=> d.NbVoix)
			.filter(d=>!ED.includes(d))
			.reverse()
		)
		
		candidats[1].NbVoix = candidats[1].NbVoix + candidats[2].NbVoix * pct
		candidats[2].NbVoix = candidats[2].NbVoix - candidats[2].NbVoix * pct
		
		//sim = d3.sort(sim, d=>d.NbVoix).reverse()
		
		return sim
	})
)

const t2_sim = sim(t1_rnpos1, pct_report)
```

### composition finale

```js
const composition_sim = (
	d3
	.merge([
		t1_direct,
		qualif_t1
			.filter(d => !ED.includes(d3.greatest(d[1], c => c.NbVoix).CodNuaCand)),
		t2_sim
	])
)

// display(composition_sim)
```

```js
let message = ''

const winner = (c) => d3.greatest(c, x => x.NbVoix)

const sim_winners = (
	d3
	.rollups(
		composition_sim
		.map(d=>winner(d[1]).CodNuaCand),
		d => d.length,
		d => d
	)
)

if ( sim_winners.find(d=>d[0]=='RN')[1] >=  d3.max(sim_winners.filter(d=>d[0]!='RN'), d=>d[1])){
	message = 'Le Rassemblement National a la majorité'
} else {
	message = 'Le Rassemblement National n\'a pas la majorité'
}

// display(sim_winners)
// display(message)
```

<div class="card">

${message}

</div>


```js
familles.forEach(f => {
	const t1 = (
		composition_sim
		.filter(d => {
			const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
			return candidats[0].CodNuaCand == f
		})
	)
	
	const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1,0,3)}</td></tr>`
	
	display(h)
})
```

### effet sur les circonscriptions où l'extrême-droite est en tête

```js
familles.forEach(f => {
	const t1 = (
		t2_sim
		.filter(d => {
			const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
			return candidats[0].CodNuaCand == f
		})
	)
	
	const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1,0,3)}</td></tr>`
	
	display(h)
})
```

## évolution du nombre de sièges en fonction des reports de voix

```js
const sim2 = (pct)=>{
	const composition = (
		d3
		.merge([
			t1_direct,
			qualif_t1
				.filter(d => !ED.includes(d3.greatest(d[1], c => c.NbVoix).CodNuaCand)),
			sim(t1_rnpos1, pct)
		])
	)
	
	const winners = (
		d3
		.rollups(
			composition
			.map(d=>winner(d[1]).CodNuaCand),
			d => d.length,
			d => d
		)
	)
	
	return winners.map(w => ({nuance: w[0], sieges: w[1], pct}))
}

const sims = (
	d3
	.group(
		d3
		.merge(
			d3
			.range(0, 1.01, 0.01)
			.map(d=> sim2(d))
		),
		d=> d.nuance
	)
)
```

```js
Plot.plot({
	marginRight: 40,
	x: {
		label: 'pourcentage de reports de voix',
		percent: true,
		tickFormat: x => `${x} %`
	},
	y: {
		label: 'sièges',
		nice: true
	},
	color: {
		domain: Object.keys(lg.nuances_colors),
		range: Object.values(lg.nuances_colors)
	},
	marks: [
		...(
			familles.map(f => {
				return Plot.line(
					sims.get(f),
					{
						x: 'pct',
						y: 'sieges',
						stroke: 'nuance'
					}
				)
			})
		),
		...(
			familles.map(f => {
				return Plot.text(
					d3.filter(sims.get(f), d=> d.pct == 1),
					{
						x	 : 'pct',
						y	 : 'sieges',
						text : 'nuance',
						textAnchor: 'start',
						dx   : 4
					}
				)
			})
		),
		Plot.ruleX(
			[0.36],
			{
				strokeDasharray: [3,1],
				stroke: '#aaa'
			}
		),
		Plot.text(
			['point de bascule où le RN n\'est plus majoritaire'],
			{
				y: 300,
				x: 0.36,
				dy: -8
			}
		),
		Plot.ruleY(
			[289],
			{
				strokeDasharray: [3,1],
				stroke: '#aaa'
			}
		),
		Plot.text(
			['majorité absolue'],
			{
				y: 289,
				x: 1,
				dy: -8,
				textAnchor: 'end'
			}
		),
	]
})
```

## données

WIP

```js
const familles = [ 'UG', 'ENS', 'LR', 'RN', 'UXD' ]
const ED = ['RN', 'UXD']
```

```js
const resultats_t1 = (
	d3
	.rollups(
		(await lg.fetch_votes(2024, 1)).objects(),
		d => d3.sort(d, d=>d.NbVoix).reverse(),
		d => d.CodCirc2
	)
)
```

## fonctions

WIP

```js
const to_data = (candidats) => {
	return d3.sort(candidats,d=>d.NbVoix).reverse().map(d => ({
		party: d.CodNuaCand,
		voices: d.NbVoix,
		color: lg.nuances_colors[d.CodNuaCand]
	}))
}
```

```js
function cg_list(l, pos=0, disp=undefined){
	const data = (d) => (opts.includes('circogramme'))? to_data(d[1]).slice(0,(disp)?disp:l.length) : [to_data(d[1])[pos]]

	return (
		d3
		.sort(l, d=> d3.max(d[1], d=>d.NbVoix)).reverse()
		.map(d=> html`<a href="/legislatives/circonscription#${d[0]}">${circogramme(data(d), 24, 24).node()}</a> `)
	)
}
```