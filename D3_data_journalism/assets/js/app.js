
/*
D3-challenge HW by martin hrbac
todo: publish on heroku 
*/

// IIFE
(function(){

	const plotElement = d3.select("#scatter");

	const axisText = {
		Poverty: ['In Poverty', '%'],
		Age: ['Age' ,'Median'],
		Income: ['Household Income', 'Median'],
		Obesity: ['Obesity', '%'],
		Smokes: ['Smokes', '%'],
		Healthcare: ['Lacks Healthcare', '%']
	};

	let svgWidth = 1024;
	let svgHeight = 650;

	let margin = {
	  top: 20,
	  right: 40,
	  bottom: 80,
	  left: 100
	};
	
	let width = svgWidth - margin.left - margin.right;
	let height = svgHeight - margin.top - margin.bottom;

	// SVG wrapper
	let svg = d3.select("body").select("svg");
	// clear svg is not empty
	if (!svg.empty()) { svg.remove(); }	
	svg = plotElement.append("svg").attr("width", svgWidth).attr("height", svgHeight);

	// Tooltip element
	var toolTip = d3.select("body").append("div").attr("class", "d3-tip");

	var chartGroup;  
	
	var xValue = 'Poverty';
	var yValue = 'Obesity';

	// Get data from file, store it in local variable, convert numerical values
	let stateData = {};
	
	d3.csv("assets/data/data.csv").then(function(data) {
		stateData.State = data.map( ds => ds.state );
		stateData.A2 = data.map( ds => ds.abbr );
		// Convert cast numerical values to numbers
		stateData.Id = data.map( ds => ds.id - 0 );
			// x Axis
		stateData.Poverty = data.map( ds => ds.poverty - 0 );
		stateData.Age = data.map( ds => ds.age - 0 );
		stateData.Income = data.map( ds => ds.income - 0 );
			// y Axis
		stateData.Obesity = data.map( ds => ds.obesity - 0 );
		stateData.Smokes = data.map( ds => ds.smokes - 0 );
		stateData.Healthcare = data.map( ds => ds.healthcare - 0 );
	    createPlot();
	});
	  
	function createPlot(){
		
		svg.selectAll("*").remove();
		
		let xValues = stateData[xValue];
		let yValues = stateData[yValue];
		
		// Chart
		chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Add axis
		let xExt = (d3.max(xValues) - d3.min(xValues)) * 0.05;
	    let xLinScale = d3.scaleLinear().domain([d3.min(xValues) - xExt, d3.max(xValues) + xExt]).range([0, width]);
		chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(xLinScale)); // axis at bottom
		
		let yExt = (d3.max(yValues) - d3.min(yValues)) * 0.05;
		let yLinScale = d3.scaleLinear().domain([d3.min(yValues) - yExt, d3.max(yValues) + yExt]).range([height, 0]);
		chartGroup.append("g").call(d3.axisLeft(yLinScale));

		xValues.forEach(function(v, i){
			let x = xLinScale(v);
			let y = yLinScale(yValues[i]);
			// Add circle
			chartGroup.append("circle").attr("cx", x).attr("cy", y).attr("r", "10").attr("idx", i).attr("fill", "lightblue").attr("opacity", ".5");
			// Add state label
			chartGroup.append("text").attr("class", "ignoreevents").attr("x", x).attr("y", y).style("text-anchor", "middle").attr("dy", "0.38em").attr("font-size", 10).text(stateData.A2[i]);
		});
		
		// xAxis label
		['Poverty', 'Age', 'Income'].forEach(function(item, idx){addLabelX(item, idx * 20);});
	
		// yAxis label
		['Healthcare', 'Smokes', 'Obesity'].forEach(function(item, idx){addLabelY(item, idx * 20);});
	   
	   // Tooltip
		chartGroup.selectAll("circle").on("mouseover", function(d, i) {
			let idx = d3.select(d3.event.target).attr("idx");
			toolTip.style("display", "block");
			toolTip.html(`<b>${stateData.State[idx]}</b><br/>${getValueValue(xValue, idx)}<br/>${getValueValue(yValue, idx)}`)
			  .style("left", d3.event.pageX + "px")
			  .style("top", d3.event.pageY + "px");
		}).on("mouseout", function() {
			  toolTip.style("display", "none");
		});
	}

	// function updatePlot(){
		// chartGroup.selectAll("circle").nodes().map(function(item){
			// console.log(item);
		// });
	// }

	function addLabelX(tag, offset){
		let lbl = chartGroup.append("text")
			.attr("transform", `translate(${width / 2}, ${height + margin.top + offset + 15})`)
			.attr("class", tag === xValue ? "active" : "inactive")
			.attr("cursor", "pointer")
			.attr("id", tag)
			.text(getValueText(tag));
	   	lbl.on("click", function() { 
			d3.selectAll('.active').classed('inactive', false);
			xValue = this.id;
			createPlot();
			//updatePlot();
		});
	}

	function addLabelY(tag, offset){
	    let lbl = chartGroup.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 0 - margin.left - offset + 55)
		  .attr("x", 0 - (height / 2))
		  .attr("dy", "1em")
		  .attr("class", tag === yValue ? "active" : "inactive")
		  .attr("cursor", "pointer")
		  .attr("id", tag)
		  .text(getValueText(tag));
		lbl.on("click", function() { 
			d3.selectAll('.active').classed('inactive', false);
			yValue = this.id;
			createPlot();
		});
	}

	const getValueText = tag => `${axisText[tag][0]} (${axisText[tag][1]})`;

	const getValueValue = (tag, idx) => `${axisText[tag][0]}: ${stateData[tag][idx]} ${axisText[tag][1]}`;
	
})();

