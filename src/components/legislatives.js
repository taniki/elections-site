import * as Plot from "npm:@observablehq/plot";
import * as aq from "npm:arquero";

export function fetch_votes(annee, tour){
	return (
		aq
		.loadCSV(
			`https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg${annee}_t${tour}_resultats.csv`,
			{
				autoType:false,
				parse:{
					NbVoix: parseInt
				}
			}
		)
	)
}

export function fetch_candidats(annee, tour){
	return (
		aq
		.loadCSV(
			`https://raw.githubusercontent.com/taniki/legislatives-2024/main/lg${annee}_t${tour}_candidats.csv`,
			{
				autoType:false,
				parse:{
					NbVoix: parseInt
				}
			}
		)
	)
}

export function votes_to_resultats(votes){
	return (
		votes
		.orderby(aq.desc('NbVoix'))
		.groupby('CodCirc2')
		.rollup({
			NbVoix: d => aq.op.max(d.NbVoix)
		})
		.join(aq.from(votes))
	)
}

export function resultats_to_composition(cironscriptions){
	return (
		cironscriptions
		.groupby('CodNua')
		.rollup({
			sieges: d => aq.op.valid(d.NbVoix)
		})
	)
}

export function plot_composition_bar(composition){
	return Plot.plot({
		marks: [
			Plot.barX(
				composition,
				{
					y: 'CodNua',
					x: 'sieges'
				}
			),
			Plot.ruleX(
				[289],
				{
					stroke: "#bbb",
					strokeDasharray: [2,1]
				}
			)
		]
	})
}

export function composition_to_coalitions(composition){
	return (
		composition
		.cross(composition)
		.transform(
			table => (
				table
				.filter(d => d.CodNua_1 == d.CodNua_2)
				.derive({
					coalition: d => d.sieges_1
				})
				.concat(
					table
					.filter(d => d.CodNua_1 != d.CodNua_2)
					.derive({
						coalition: d => d.sieges_1 + d.sieges_2
					})
				)
	
			)
		)
		// .groupby('CodNua_1')
		// .pivot('CodNua_2', 'coalition')
	)
}

export function plot_coalitions(coalitions){
	return (
		Plot.plot({
			// color:{
			// 	domain: [0, 289],
			// 	scheme: 'RdYlGn'
			// },
			marks: [
				Plot.cell(
					coalitions,
					{
						x: 'CodNua_2',
						y: 'CodNua_1',
						fill : d => (d.coalition >= 289)? 'green' : 'white'
					}
				),
				Plot.text(
					coalitions,
					{
						x: 'CodNua_2',
						y: 'CodNua_1',
						text : 'coalition'
					}
				)
			]
		})
	)
}