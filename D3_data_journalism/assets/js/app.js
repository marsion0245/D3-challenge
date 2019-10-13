
/*
D3-challenge HW by martin hrbac
todo: finish tooltip, finish click + select different values, cleanup header, publish on heroku 
*/

// IIFE
(function(){

	const plotElement = d3.select("#scatter");

	let svgWidth = 1024;
	let svgHeight = 650;

	let margin = {
	  top: 20,
	  right: 40,
	  bottom: 60,
	  left: 100
	};
	
	let width = svgWidth - margin.left - margin.right;
	let height = svgHeight - margin.top - margin.bottom;

	// SVG wrapper
	let svg = d3.select("body").select("svg");
	// clear svg is not empty
	if (!svg.empty()) {
		svg.remove();
	}	
	svg = plotElement.append("svg").attr("width", svgWidth).attr("height", svgHeight);

	let cityData = {};

	// Get data from file, store it in local variable, convert numerical values
	d3.csv("assets/data/data.csv").then(function(data) {
		cityData.State = data.map( ds => ds.state );
		cityData.A2 = data.map( ds => ds.abbr );
		// Convert cast numerical values to numbers
		cityData.Id = data.map( ds => ds.id - 0 );
			// x Axis
		cityData.Poverty = data.map( ds => ds.poverty - 0 );
		cityData.Age = data.map( ds => ds.age - 0 );
		cityData.Income = data.map( ds => ds.income - 0 );
			// y Axis
		cityData.Obesity = data.map( ds => ds.obesity - 0 );
		cityData.Smokes = data.map( ds => ds.smokes - 0 );
		cityData.Healthcare = data.map( ds => ds.healthcare - 0 );
	    createPlot('Poverty', 'Obesity');
	});

    // var toolTip = d3.tip()
      // .attr("class", "tooltip")
      // .offset([80, -60])
      // .html(function(d) {
        // return ("xxx") ; //(`${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);
      // });
	  
	function createPlot(xValue, yValue){
		
		svg.selectAll("*").remove();
		
		let xValues = cityData[xValue];
		let yValues = cityData[yValue];
		
		// Chart
		let chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

		// chartGroup.call(toolTip);

		// Add axis
	    let xLinScale = d3.scaleLinear().domain([d3.min(xValues), d3.max(xValues)]).range([0, width]);
		chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(xLinScale)); // axis at bottom
		
		let yLinScale = d3.scaleLinear().domain([d3.min(yValues), d3.max(yValues)]).range([height, 0]);
		chartGroup.append("g").call(d3.axisLeft(yLinScale));

		xValues.forEach(function(v, i){
			let x = xLinScale(v);
			let y = yLinScale(yValues[i]);
			 chartGroup.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r", "10")
			.attr("fill", "lightblue")
			.attr("opacity", ".5");

			let pointLabel = chartGroup.append("text")
				.attr("x", x)
				.attr("y", y)
				.style("text-anchor", "middle")
				.attr("dy", "0.38em")
				.attr("font-size", 10)
				.attr("id", cityData.A2[i])
				.text(cityData.A2[i]);
			
			// pointLabel.on("mouseover", function() { 
				// toolTip.show(data, this);
			// });			
		});
		
		// xAxis text
	   let xAxisText = chartGroup.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
       .attr("class", "active")
	   .attr("cursor", "pointer")
	   .attr("id", xValue)
       .text(getAxixText(xValue));

		xAxisText.on("click", function() { 
			d3.select('#' + this.id).classed('inactive', false);
			d3.select('#' + this.id).classed('active', true);
		});
	
		// yAxis text
	    let yAxisText = chartGroup.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 0 - margin.left + 55)
		  .attr("x", 0 - (height / 2))
		  .attr("dy", "1em")
		  .attr("class", "active")
		  .attr("cursor", "pointer")
		  .attr("id", yValue)
		  .text(getAxixText(yValue));
		  
		yAxisText.on("click", function() { 
			d3.select('#' + this.id).classed('inactive', false);
			d3.select('#' + this.id).classed('active', true);
			createPlot(xValue, this.id);
		});
		
		
	}

	function getAxixText(value){
		const axisText = {
			Poverty: 'In Powerty (%)',
			Age: 'Age (Median)',
			Income: 'Household Income (Median)',
			Obesity: 'Obese (%)',
			Smokes: 'Smokes (%)',
			Poverty: 'Lacks Healthcare(%)'
		};
		return axisText[value];
	};


})();

