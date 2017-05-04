$(document).ready(function(){

	// Marker styling

	function styling(drugType){
	    switch(drugType){
	        case "MARIJUANA":
		        console.log("switch")
		        return "rgba(74, 145, 48, 0.3)";
		        break;
	        case "PIMPING":
		        return "rgba(255, 0, 0, 0.3)";
		        break;
	        case "METH-AMPHETAMINE":
		        return "rgba(0, 0, 255, 0.3)";
		        break;
	        case "HEROIN":
		        return "rgba(100, 16, 16, 0.3)";
		        break;
	        case "HALLUCINOGENIC":
		        return "rgba(0, 0, 0, 0.3)"
		        break;
	        case "OPIATES":
		        return "rgba(72, 0, 32, 0.7)"
		        break;
	        default:
		        return "rgba(72, 0, 32, 0.3)";
	    }
	}
var svg = d3.select("#test").append('svg');

	var circle = svg.selectAll("d3.symbolCircle")
	.attr("class", "graf")
	// .attr()
    .data([32, 57, 293], function(d) { return d; });


circle.enter().append("circle")
    .attr("cy", 60)
    .attr("cx", function(d, i) { return i * 100 + 30; })
    .attr("r", function(d) { return Math.sqrt(d); })
    .style("fill", "red")
    // .update();

// circle.exit().remove();

	var map = new google.maps.Map(d3.select("#map").node(), {
		zoom: 13,
		center: {lat: 37.75, lng: -122.445}
	});

	console.log('map');

	// Dropdown and checkbox functions

	function marijuanaIsBadMkay(chosenOne){
		if (chosenOne === "drug=MARIJUANA")
			{$("#growing").removeClass( "hide" )}
		else
			{$("#growing").addClass( "hide" )}
	}

	function hookersBlow(hooker){
		if (hooker === "hookers=1"){
			$("#drug").val("COCAINE");
			$("input#dealers").prop('checked', true);
		} 
	}

	function areTheHookersOut(hooker){
		hookersBlow(hooker);
		$("#hookers").change(function(event){
			$("#drug").val("");
			$("input#dealers").prop('checked', false);
		});
	}

	$("#drugs").change(function(event) {
		event.preventDefault();

		var theChosenOne = $("#drug").serialize();
		var theSource = $("#dealers").serialize();
		var hookersNBlow = $("#hookers").serialize();
		var theGrowers = $("#growers").serialize();

		marijuanaIsBadMkay(theChosenOne);
		areTheHookersOut(hookersNBlow);


		var formData = theChosenOne + "&" + theSource + "&" + hookersNBlow + "&" + theGrowers
		// debugger;

		$.ajax({
			type: "GET",
			url: "locations",
			dataType: "json",
			data: formData,
			success: function(ajaxResults){
				console.log(ajaxResults);
				console.log(ajaxResults[0].description)


				var overlay = new google.maps.OverlayView();

				overlay.onAdd = function() {

					var layer = d3.select(this.getPanes().overlayMouseTarget)
								.append("div")
								.attr("class", "scores");

			      	overlay.onRemove = function() {
			        	d3.select(div).data(overlay).exit()
						.remove();
			        };


			        overlay.draw = function() {

			        	var projection = this.getProjection(),
			        		padding = 12;

						d3.selectAll("svg").data(d3.entries(ajaxResults)).exit().remove();

			            d3.selectAll("svg").attr("svg", "update");

			        	// var marker = layer.selectAll("svg")
			        	// 	.data(d3.entries(ajaxResults))
            //                 .exit().remove()

                        d3.select("marker").data(d3.entries(ajaxResults))
                            .exit().remove()

                        var marker = layer.selectAll("svg")
                        	.data(d3.entries(ajaxResults))
                            .each(transform) // update existing markers
                        	.enter().append("svg")
                            .each(transform)
                            .attr("class", "marker");

                        // Determines the drug type for styling
			            var firstObject = Object(ajaxResults[0]);
			            console.log(firstObject);
			            var drugType = (firstObject.description);
			            console.log(drugType);

			            marker.attr("circle", "update");

			            marker.append("circle")
			            		.attr("r", 4)
			            		.style("fill", function(d) {return styling(drugType)})
			            		.style({"stroke": "black", "stroke-width": 0.2})
			            		.attr("cx", padding)
			            		.attr("cy", padding)

			            function transform(d) {
				            d = new google.maps.LatLng(d.value["lat"], d.value["long"]);
				            d = projection.fromLatLngToDivPixel(d);
				            return d3.select(this)
				                .style("left", (d.x - padding) + "px")
				                .style("top", (d.y - padding) + "px");
			            }

			        };




				};	

            overlay.setMap(map);

			}
		})
	})
})

