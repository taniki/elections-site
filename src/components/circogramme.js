import * as d3 from "npm:d3";

export function circogramme(data, w=50, h=50){
	// const w = 50
	// const h = 50
	const default_size = 50
	const background = "#fff"
	
	const total = d3.sum(data.map(d => d.voices))
	
	const pos_x = d3.cumsum([0, ...data.map(d=> d.voices*default_size/total)])
	
	const svg = d3.create("svg")
		.attr("width", h)
		.attr("height", w)
		.attr("viewBox", [0, 0, default_size, default_size])
		
	const stripes = svg
		.selectAll('rect')
		.data(data)
		.enter()
			.append("rect")
			.attr('width', (d,i) => (d.voices / total) * default_size)
			.attr('height', default_size)
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
			.attr('x', (default_size-checkmark_w)/2)
			.attr('y', (default_size-checkmark_h)/2)
	}

	return svg
}