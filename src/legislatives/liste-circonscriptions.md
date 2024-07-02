---
theme: dashboard
title: liste des circonscriptions
toc: false
---

# liste des circonscriptions

```js
const circo_flat = await d3.csv('https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2024_circonscriptions.csv')

const dept_circo = await d3.group(circo_flat, d => d.CodCirc2.slice(0,2))
const inscrits_2022 = await d3.csv('https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg2022_inscrits.csv')
```

```js
// Plot.plot({
//   padding: 0,
//   color: {
//     type: "linear",
//     scheme: "reds",
//     domain: [0, d3.max(inscrits_2022.map( x => parseInt(x.inscrits)))]
//   },
//   fy: {tickFormat: ""},
//   marks: [
//     Plot.cell(
//       circo_flat,
//       {
//         x:    d => parseInt(d.CodCirElec.slice(-2)),
//         y:    d => d.CodDpt,
//         fill: d => parseInt(inscrits_2022.find(x => x.CodCirc2 == d.CodDpt+"0"+d.CodCirElec.slice(-2)).inscrits),
//         inset: 0.5,
//         href: d => `/legislatives/circonscription#${d.CodDpt}0${d.CodCirElec.slice(-2)}`,
//       }
//     ),
//     Plot.text(
//       circo_flat,
//       {
//         x:    d => parseInt(d.CodCirElec.slice(-2)),
//         y:    d => d.CodDpt,
//         text: d => d.CodCirElec.slice(-2),
//         href: d => `/legislatives/circonscription#${d.CodDpt}0${d.CodCirElec.slice(-2)}`,
//       }
//     )
//   ]
// })

```

```js
const rows = Array.from(dept_circo.keys()).sort().map(dept => {
  return html`<tr><td>${dept}<td><td>${ dept_circo.get(dept).map(c => {
    return html`<a href="/legislatives/circonscription#${dept}0${c.CodCirElec.slice(-2)}">${c.CodCirElec.slice(-2)}</a> `
  })}</td</tr>`
})
```


```js
html`<table>${rows}</table>`
```