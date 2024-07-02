---
title: circogramme
---


# circogramme

```js
import * as lg from '../components/legislatives.js'
```

## idée de départ

https://mastodon.social/@nclm/112711526595213671

<iframe src="https://mastodon.social/@nclm/112711526595213671/embed" width="600" height="800" allowfullscreen="allowfullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"></iframe>

## élément de base

```js echo
function circogramme(data, w=50, h=50){
	// const w = 50
	// const h = 50
	const defaut_size = 50
	const background = "#fff"
	
	const total = d3.sum(data.map(d => d.voices))
	
	const pos_x = d3.cumsum([0, ...data.map(d=> d.voices*defaut_size/total)])
	
	const svg = d3.create("svg")
		.attr("width", h)
		.attr("height", w)
		.attr("viewBox", [0, 0, defaut_size, defaut_size])
		
	const stripes = svg
		.selectAll('rect')
		.data(data)
		.enter()
			.append("rect")
			.attr('width', (d,i) => (d.voices / total) * defaut_size)
			.attr('height', defaut_size)
			.attr('x', (d,i) => pos_x[i])
			.attr('y', 0)
			.attr('fill', (d,i)=> d.color)
	
	if (data.length == 1){
		const checkmark_w = 24
		const checkmark_h = 24

		const g = svg
			.append('g')
			.append('svg')
			.html(`<path clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/>`)
			.attr('fill', 'white')
			.attr('height', checkmark_w)
			.attr('width', checkmark_h)
			.attr('x', (defaut_size-checkmark_w)/2)
			.attr('y', (defaut_size-checkmark_h)/2)
	}

	return svg
}

const sample = [
	{party: 'RN', voices: 1000, color: '#001f3f'},
	{party: 'NFP', voices: 2000, color: '#ff4136'}
]

display(circogramme(sample, 100, 100).node())
display(circogramme(sample).node())
display(circogramme(sample,20, 20).node())

```

## small multiples

### taille par défaut

```js echo
const colors = lg.nuances_colors

const lg2024_t1_resultats = (
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

lg2024_t1_resultats.map(x=> display(html`${circogramme(x[1]).node()} `))
```

### en tout petit

```js
lg2024_t1_resultats.map(x=> display(html`${circogramme(x[1], 16, 16).node()} `))
```

## tableau par département

```js
const departements = (await d3.csv('https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2024_departements.csv'))
```

<table>

```js echo
(
	d3
	.groups(lg2024_t1_resultats, d => d[0].slice(0,2))
	.forEach(d => display(html`<tr><td style="text-align: right">${departements.find((dept) => dept.CodDpt == d[0]).LibDpt} (${d[0]})</td><td>${d[1].map(c => html`<a href="/legislatives/circonscription#${c[0]}">${circogramme(c[1], 16, 16).node()}</a> `)}</td></tr>`))
)
```

</table>


## cartocircogramme