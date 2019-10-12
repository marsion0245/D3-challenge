
/*
D3-challenge HW by martin hrbac
*/

// IIFE
(function(){

	d3.csv("/data/cities.csv").then(function(data) {
	  console.log(data[0]);
	});
	
	

})();

