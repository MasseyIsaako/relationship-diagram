var width = 1200,
	height = 700;

var circleWidth = 20;

var url = "js/data/top10.json";

d3.json(url, function(DataFromJSON){
	var tracks = DataFromJSON.feed.results;
	var nodes = [];
	nodes.push({
		"id": 0,
		"name": "iTunes Top " + tracks.length,
		"type": "Parent"
	});

	for (var i = 0; i < tracks.length; i++) {
		nodes.push({
			"id": tracks[i].artistId,
			"name": tracks[i].artistName,
			"type": "artists",
			"targets": [0]
		});

		var genres = tracks[i].genres;
		for (var j = 0; j < genres.length; j++) {
			check(genres[j], tracks[i].artistId);
		}
	}

	function check(genre, artistId){
		var currentNode;
		var found = nodes.some(function(singleNode){
			currentNode = singleNode;
			return singleNode.name === genre.name;
		});

		if(!found){
			nodes.push({
				"id": genre.genreId,
				"name": genre.name,
				"type": "genre",
				"targets": [artistId]
			})
		} else {
			currentNode.targets.push(artistId)
		}
	}

	var Links = [];

	for (var i = 0; i < nodes.length; i++) {
		if(nodes[i].targets !== undefined){
			for (var j = 0; j < nodes[i].targets.length; j++) {
				Links.push({
					source: nodes[i].id,
					targets: nodes[i].targets[j]
				})
			}
		}
	};
	// console.log(Links)
var svg = d3.select("#canvas")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("background-color", "#2C3E50")

var simulation = d3.forceSimulation()
	.force("charge", d3.forceManyBody().strength(-50))
	.force("link", d3.forceLink().id(function(data){
		return data.id
	}))
	.force("center", d3.forceCenter(width / 2, height / 2))

		runSim();

		function runSim(){
			link = svg.selectAll(".link")
				.data(Links, function(data){
					return data.targets.id;
				})

			link.enter()
				.append("line")
				.classed("link", true)

			node = svg.selectAll(".node")
				.data(nodes, function(data){
					return data;
				})

			node = node.enter()
				.append("g")
				.classed("node", true)

			node.append("circle")
				.attr("r", function(data, i){
					if(i === 0){
						return circleWidth * 3;
					} else if(data.type === "artists") {
						return circleWidth * 2;
					} else{
						return circleWidth * 3;
					}
				})
				.attr("fill", function(data, i){
					if(i === 0){
						return "#F4B350";
					} else if(data.type === "artists") {
						return "#E67E22";
					} else{
						return "#E87E04";
					}
				})


				node.append("text")
					.attr("dy", 10)
					.text(function(data){
						return data.name;
					})

				simulation
					.nodes(nodes)
					.on("tick", ticked)

				// simulation.force("link")
				// 	.links(Links)
		}



		function ticked(){
			link
				.attr("x1", function(data){return data.source.x; })
				.attr("y1", function(data){return data.source.y; })
				.attr("x2", function(data){return data.target.x; })
				.attr("y2", function(data){return data.target.y; })

			node
				.attr("transform", function(data){
					return "translate(" + data.x + ", " + data.y + ")";
				})
		}

		console.log(nodes);

})