var custom_bubble_chart = (function(d3) {
	var width = 635,
	height = 800,
	layout_gravity = -0.01,
	damper = 0.1,
	nodes = [],
	vis, force, bubbles, radius_scale;

	var center = {x: width / 2, y: height / 3.4};

	var borough_centers = {
		"manhattan": {x: 2 * width / 7, y: height / 3.7},
		"brooklyn": {x: width / 2, y: height / 3.7},
		"bronx": {x: 2.3 * width / 3, y: height / 3.7},
		"staten_Island": {x: 0.7 * width / 2, y: height / 2.2},
		"queens": {x: 1.5 * width / 2, y: height / 2.2}
	};
	var race_centers = {
		"white": {x: 2 * width / 7, y: height / 3.7},
		"black": {x: width / 2, y: height / 3.7},
		"hispanic": {x: 2.3 * width / 3, y: height / 3.7},
		"asian": {x: 0.7 * width / 2, y: height / 2.5},
		"multiracial": {x: 1.5 * width / 2, y: height / 2.4}
	};
	var age_centers = {
		"Under5": {x: 2 * width / 7, y: height / 3.7},
		"5to17": {x: width / 2, y: height / 3.7},
		"18to34": {x: 2.3 * width / 3, y: height / 3.7},
		"35to44": {x: 2 * width / 7, y: height / 2.5},
		"45to64": {x: width / 2, y: height / 2.5},
		"65andolder": {x: 2.3 * width / 3, y: height / 2.5}
	};            
	var income_centers = {
		"extreme_poverty": {x: 2 * width / 7, y: height / 3.5},
		"below_poverty": {x: width / 2, y: height / 3.0},
		"near_poor": {x: 2.3 * width / 3, y: height / 3.5},
		"above_poor": {x: width / 2, y: height / 2.1 }
	};
	var disability_centers = {
		"Non_institutionalized": {x: 2 * width / 3 , y: height / 3.7},
		"Not_disabled": {x: width / 3.3, y: height / 3.7}
	};

	function custom_chart(data) {
		data.forEach(function(d){
			var node = {
				radius: 7,
				borough: d.borough,
				age: d.age,
				income: d.income,
				race: d.race,
				disability: d.disability,
				x: Math.random() * 900,
				y: Math.random() * 800
			};
			nodes.push(node);
		});

		vis = d3.select("#vis").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id", "svg_vis");

		bubbles = vis.selectAll("circle")
		.data(nodes);

		bubbles.enter().append("circle")
		.attr("r", 0)
		.attr("stroke-width", 1.3)
		.attr("id", "bubble");
		
		bubbles.transition().duration(2000).attr("r", function(d) { return d.radius; });
	}

	function charge(d) {
		return -Math.pow(d.radius, 2.0) / 9;
	} 

	function start() {
		force = d3.layout.force()
		.nodes(nodes)
		.size([width, height]);
	}

	function display_all() {
		force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			bubbles.each(move_to_center(e.alpha))
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("stroke", "#02496d")
			.attr("fill", "#1a709c");
		});
		force.start();
		hide_races();
		hide_ages();
		hide_boroughs();
		hide_incomes();
		hide_disabilities();
		d3.select("#view_selection").append("p")
		.text("Nearly 850,000 people lived in the coastal areas of New York City that were" +  
			" flooded by Hurricane Sandy's storm surge on Oct. 29 2012. Each bubble below represents 2,000 of those New Yorkers" +
			" - who encompass a broad cross-section of ages, races and income levels."+
			"  Click on the categories above to learn more about them.");
	}

	function move_to_center(alpha) {
		return function(d) {
			d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
			d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
		};
	}

	function display_race() {
		hide_ages();
		hide_boroughs();
		hide_incomes();
		hide_disabilities();

		force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			bubbles.each(move_to_race(e.alpha))
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("fill", "#7676a6")
			.attr("stroke", "#6366A6");
		});
		force.start();
		display_races_text();
	}

	function move_to_race(alpha) {
		return function(d) {
			var target = race_centers[d.race];
			d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 0.9;
			d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 0.9;
		};
	}

	function display_races_text() {
		var races_x = {"White": 120, "Black": width / 1.8, "Hispanic": width - 90, 
		"Asian": 200, "Multiracial non-Hispanic": width - 130};
		var races_y = { "White": height / 2.65, "Black": height / 2.65, "Hispanic": height / 2.65,
		"Asian": height / 1.7, "Multiracial non-Hispanic": height / 1.7 };
		var races_data = d3.keys(races_x); 
		var races = vis.selectAll(".races")
		.data(races_data);

		races.enter().append("text")
		.attr("class", "races")
		.attr("x", function(d) { return races_x[d]; })
		.attr("y", function(d){ return races_y[d]; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d; });

		d3.select("#view_selection").append("p")
		.text("The areas hit hardest by Sandy's floodwaters were populated by a higher percentage" +
			" of white residents than live in New York City overall (45.5% versus 33.3%). But in general," +
			" the storm impacted a racially diverse mix of New Yorkers. Within that group, roughly 22.3% were black," +
			" 20.6% were Hispanic, 9.4% were Asian and slightly more than 1.5% were multi-racial non-Hispanic.");
	}

	function display_age() {
		hide_races();
		hide_boroughs();
		hide_incomes();
		hide_disabilities();

		force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			bubbles.each(move_to_age(e.alpha))
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("fill", "#D4BE50")
			.attr("stroke", "#86820D");
		});
		force.start();
		display_ages_text();
	}

	function move_to_age(alpha) {
		return function(d) {
			var target = age_centers[d.age];
			d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 0.9;
			d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 0.9;
		};
	}

	function display_ages_text() {
		var ages_x = {"Under 5 years old": 120, "5 to 17 years": width / 2.0, "18 to 34 years": width - 90, 
		"35 to 44 years": 120, "45 to 64 years": width / 2, "65 and older": width - 90};
		var ages_y = {"Under 5 years old": height / 3.2, "5 to 17 years": height / 3.2, 
		"18 to 34 years": height / 3.1, "35 to 44 years": height / 1.8, "45 to 64 years": height / 1.8,
		"65 and older": height /1.8};
		var ages_data = d3.keys(ages_x);
		var ages = vis.selectAll(".ages")
		.data(ages_data);

		ages.enter().append("text")
		.attr("class", "ages")
		.attr("x", function(d) { return ages_x[d]; })
		.attr("y", function(d){ return ages_y[d]; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d;});

		d3.select("#view_selection").append("p")
		.text("The elderly (age 65 and older) made up 14.5% of those living inside Sandy's flood" +
			" zone. That is 2.4 percentage points higher than NYC's overall elderly population." +
			" Children under 5 years old made up about 5.7% of the group, while an additional 14.3" +
			" percent were between the ages of 5 and 17.");			
	}

	function display_borough() {
		hide_races();
		hide_ages();
		hide_incomes();
		hide_disabilities();

		force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			bubbles.each(move_to_borough(e.alpha))
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("stroke", "#f44e3d")  
			.attr("fill", "#b1372a"); 
		});
		force.start();
		display_boroughs_text();
	}

	function move_to_borough(alpha) {
		return function(d) {
			var target = borough_centers[d.borough];
			d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 0.9;
			d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 0.9;
		};
	}

	function display_boroughs_text() {
		var boroughs_x = {"Manhattan": 120, "Brooklyn": width / 1.8, "Bronx": width - 90,
		"Queens": 200, "Staten Island": width-130};
		var boroughs_y = { "Manhattan": height / 2.65, "Brooklyn": height / 2.65, "Bronx": height / 2.65,
		"Queens": height / 1.7, "Staten Island": height / 1.7 };			
		var boroughs_data = d3.keys(boroughs_x);
		var boroughs = vis.selectAll(".boroughs")
		.data(boroughs_data);

		boroughs.enter().append("text")
		.attr("class", "boroughs")
		.attr("x", function(d) { return boroughs_x[d]; })
		.attr("y", function(d){ return boroughs_y[d]; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d;});

		d3.select("#view_selection").append("p")
		.text("The greatest number of people inside Sandy's flood zone lived in Brooklyn" +
			" (more than 300,000), but Staten Island - the least populated NYC borough - had the highest percentage of residents affected." +
			" About 16% of Staten Islanders (more than 75,000) lived inside the flooded area. On the lower end of the spectrum," +
			" the roughly 41,000 Bronx residents living inside the zone represented just 3% of that borough's residents.");
	}

	function display_income() {
		hide_races();
		hide_ages();
		hide_boroughs();
		hide_disabilities();

		force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			bubbles.each(move_to_income(e.alpha))
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("fill", "#638c54")
			.attr("stroke", "#75A664");
		});
		force.start();
		display_incomes_text();
	}

	function move_to_income(alpha) {
		return function(d) {
			var target = income_centers[d.income];
			d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 0.9;
			d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 0.9;
		};
	}

	function display_incomes_text() {
		var incomes_x = {"Living in Extreme Poverty": 120, "Below Poverty Line": width / 2.0, "Near Poor": width - 90,
		"Above the Poverty Line": width / 2.0};
		var incomes_y = {"Living in Extreme Poverty": height / 3.3, "Below Poverty Line": height / 3.3 , "Near Poor": height / 3.3,
		"Above the Poverty Line": height / 1.5};			
		var incomes_data = d3.keys(incomes_x);
		var incomes = vis.selectAll(".incomes")
		.data(incomes_data);

		incomes.enter().append("text")
		.attr("class", "incomes")
		.attr("x", function(d) { return incomes_x[d]; }  )
		.attr("y", function(d){ return incomes_y[d]; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d;});
		
		d3.selectAll("#view_selection").append("p")
		.text('Within the flooded area, poverty was slightly less widespread than it' +
			' is in New York City as a whole - 17.3% versus 19.1% were below the poverty line. But poor' +
			' New Yorkers still made up a significant portion of that group, and 7.3% were considered to be living in' +
			' "extreme poverty." An additional 4.7% of those living within the flood zone were considered "near poor."');			
	}

	function display_disability() {
		hide_races();
		hide_ages();
		hide_boroughs();
		hide_incomes();

		force.gravity(layout_gravity)
		.charge(charge)
		.friction(0.9)
		.on("tick", function(e) {
			bubbles.each(move_to_disability(e.alpha))
			.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("fill", "#478d7e")
			.attr("stroke", "#216758");
		});
		force.start();
		display_disability_text();
	}

	function move_to_disability(alpha) {
		return function(d, i) {
			var target = disability_centers[d.disability];
			d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 0.9; //
			d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 0.9;
		};
	}

	function display_disability_text() {
		var disabilities_x = {"Disabled, Not Institutionalized": 2 * width / 2.7, "Institutionalized or Not Disabled": width / 3.5};
		var disabilities_y = {"Disabled, Not Institutionalized": height / 2.3, "Institutionalized or Not Disabled": height / 2.3};			
		var disabilities_data = d3.keys(disabilities_x);
		var disabilities = vis.selectAll(".disabilities")
		.data(disabilities_data);

		disabilities.enter().append("text")
		.attr("class", "disabilities")
		.attr("x", function(d) { return disabilities_x[d]; }  )
		.attr("y", function(d){ return disabilities_y[d]; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d;});
		
		d3.selectAll("#view_selection").append("p")
		.text("People with disabilities, a particularly vulnerable population, were also heavily impacted by" +
		" the storm. More than 11% of people within the flooded area were disabled and not living in institutional" +
		" care. That is a roughly 1 percentage point higher than NYC's total population with disabilities who" +
		" are not in an institution.");			
	}
	
	function hide_incomes() {
		var incomes = vis.selectAll(".incomes").remove();
		d3.selectAll("p").remove();
	}
	function hide_ages(){
		var ages = vis.selectAll(".ages").remove();
		d3.selectAll("p").remove();
	}
	function hide_races(){
		var races = vis.selectAll(".races").remove();
		d3.selectAll("p").remove();
	}
	function hide_boroughs(){
		var boroughs = vis.selectAll(".boroughs").remove();
		d3.selectAll("p").remove();
	}
	function hide_income(){
		var income = vis.selectAll(".income").remove();
		d3.selectAll("p").remove();
	}
	function hide_disabilities(){
		var income = vis.selectAll(".disabilities").remove();
		d3.selectAll("p").remove();
	}

	var my_mod = {};
	my_mod.init = function (data) {
		custom_chart(data);
		start();
	};

	my_mod.display_all = display_all;
	my_mod.display_race = display_race;
	my_mod.display_age = display_age;
	my_mod.display_income = display_income;
	my_mod.display_borough = display_borough;
	my_mod.display_disability = display_disability;

	my_mod.toggle_view = function(view_type) {
		if (view_type == 'year') {
			display_year();
		} 
		else if (view_type == 'race'){
			display_race();
		}
		else if (view_type == 'age'){
			display_age();
		}
		else if (view_type == 'income'){
			display_income();
		}
		else if (view_type == 'borough'){
			display_borough();
		}
		else if (view_type == 'disability'){
			display_disability();
		}            
		else {
			display_all();
		}
	};
return my_mod;
})(d3);