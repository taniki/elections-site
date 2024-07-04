---
title: Le front républicain
---

# le front républicain en 2024

```js
import * as lg from '../components/legislatives.js'
const resultats_t1 = (await lg.fetch_votes(2024, 1))
import { circogramme } from '../components/circogramme.js'

const familles = [ 'UG', 'ENS', 'LR', 'RN' ]
const ED = ['RN', 'UXD']

const elus_t1 = (
	resultats_t1
	.filter(d => d.Elu == "OUI")
	.groupby('CodNuaCand')
	.count()
)
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
const to_data = (candidats) => {
	return candidats.map(d => ({
		party: d.CodNuaCand,
		voices: d.NbVoix,
		color: lg.nuances_colors[d.CodNuaCand]
	}))
}

familles.forEach(f => {
	const t1 = resultats_t1
		.filter(d => d.Elu == "OUI")
		.filter(aq.escape(d => d.CodNuaCand == f))
		.objects()

	const h = html`<tr><td>${f} (${t1.length})</td><td>${to_data(t1).map(d=> html`${circogramme([d], 24, 24).node()} `)}</td></tr>`
	
	display(h)
})
```

## les circonscriptions où le front républicain est en tête dans la circonscription

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
	d3
	.rollups(
		resultats_t1
		.orderby(aq.desc('NbVoix'))
		//.filter(d=>d.Elu == "QUALIF T2")
		.objects(),
		d => d,
		d => d.CodCirc2
	)
	.filter(d=>!d[1].map(c=>c.Elu).includes('OUI'))
)

function cg_list(l, pos=0, disp=10){
	const data = (d) => (opts.includes('circogramme'))? to_data(d[1]) : [to_data(d[1])[pos]]

	return d3.sort(l, d=> d[0]).map(d=> html`<a href="/legislatives/circonscription#${d[0]}">${circogramme(data(d).slice(0,disp), 24, 24).node()}</a> `)
}
```

```js
familles.filter(f => !ED.includes(f)).forEach(f => {
	const t1 = qualif_t1.filter(d => d3.greatest(d[1], d=> d.NbVoix).CodNuaCand == f)
	
	const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1)}</td></tr>`
	
	display(h)
})
```
```js
const t1_rnpos1 = (
	d3
	.rollups(
		resultats_t1
		//.filter(d=>d.Elu == "QUALIF T2")
		.objects(),
		d => d3.sort(d, x=>x.NbVoix).reverse(),
		d => d.CodCirc2
	)
	.filter(d => ED.includes(d3.greatest(d[1], d=> d.NbVoix).CodNuaCand))
)
```

</div>
</div>

## circonscriptions perdues d'avance

<div class="grid grid-cols-2">
<div>

On considère que les circonscriptions fonts plus que le second et le troisième sont perdues d'avance.
Il y en a ${t1_rnpos1_sup.length} en tout.

</div>
<div>

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
</div>

## circonscriptions où le RN peut être vaincu

### RN < second et troisième

<div class="grid grid-cols-2">
<div>

Imaginons un scénario où tous les partis politiques ainsi que la population joue le jeu d'un front républicain fort.
Toutes les personnes qui auraient voter pour le candidat en troisième position vote pour le second quelque soit le camp.
Le but est simple minimiser le nombre de sièges du RN et de ses alliés à l'Assemblée nationale.

</div>
<div>

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
familles.filter(f => (f != "RN" && f != "UXD")).forEach(f => {
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

### RN < second + (troisième / 2)

<div class="grid grid-cols-2">
<div>



</div>
<div>

```js
const t1_rnpos1_inf_bis = (
	t1_rnpos1
	.filter(d=>{
		const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
		return (candidats[0].NbVoix < candidats[1].NbVoix + ((candidats.length > 2) ? candidats[2].NbVoix : 0) * .5)
	})
)
```

```js
familles.filter(f => (f != "RN" && f != "UXD")).forEach(f => {
	const t1 = t1_rnpos1_inf_bis.filter(d => {
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
const pct_report = view(Inputs.range([0,1], { value: 0.5, label: 'pourcentage de report de la troisième vers la seconde'}))
```

```js
const sim = (t1, pct) => (
	t1
	.map(d => {
		const sim = structuredClone(d)
		const candidats = (
			d3
			.sort(sim[1], d=> d.NbVoix)
			.filter(d=>!ED.includes(d))
			.reverse()
		)
		
		candidats[1].NbVoix = candidats[1].NbVoix + candidats[2].NbVoix * pct
		candidats[2].NbVoix = candidats[2].NbVoix - candidats[2].NbVoix * pct
		return sim
	})
)

const t2_sim = sim(t1_rnpos1, pct_report)
```

```js
familles.forEach(f => {
	const t1 = t2_sim.filter(d => {
		const candidats = d3.sort(d[1], d=> d.NbVoix).reverse()
		return candidats[0].CodNuaCand == f
	})
	
	const h = html`<tr><td>${f} (${t1.length})</td><td>${cg_list(t1,0,3)}</td></tr>`
	
	display(h)
})
```
