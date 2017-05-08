$(document).ready(function() {
	var manufacture_url = "https://rcdelacruz-test.apigee.net/v1/manufacturing-services/"
	var business_url = "https://rcdelacruz-test.apigee.net/v1/business-layer-services/";

	//MANUFACTURE GRAPH
    loadManufactureData(manufacture_url)
    

    //BUSINESS GRAPH
    sendRequest(business_url+"data-chunk/116000000001", "GET", function(result){
    	var processedData = processData(result);
    	buildBusinessChart(processedData);
    });


});	

function loadManufactureData(url){;
	sendRequest(url+'niats', "GET", function(result){buildManufactureChart(result.testNiat, "niats");});
	sendRequest(url+'volumes', "GET", function(result){buildManufactureChart(result.testVolume, "volumes");});
	sendRequest(url+'gpiocfs', "GET", function(result){buildManufactureChart(result.testGpIocf, "gpiocfs");});
	sendRequest(url+'target-safety-stocks', "GET", function(result){buildManufactureChart(result.testTargetSafetyStock, "targetSafetyStocks");});
}
function sendRequest(url, method, callback){
	$.ajax({
         url: "./sendRequest.php?url="+url+"&method="+method,
         type: "GET",
         success: function(res) { 
         	var parsedData = $.parseJSON(res);
         	callback(parsedData);
         }
      });
}


function buildManufactureChart(data, type){
	for(var key in data){
		if(data[key].division == "Feeds(PH)") data[key].division = "FeedsPH";
		if(data[key].division == "Feeds(VN)") data[key].division = "FeedsVN";
		if(type == "niats"){
			$( "div."+data[key].division ).find("label.niats").html(data[key].niat);
			$( "div."+data[key].division ).find("label.niats-yr").html(data[key].year);
		}
		if(type == "volumes"){
			$( "div."+data[key].division ).find("label.volume").html(data[key].volume);
		}
		if(type == "gpiocfs"){
			$( "div."+data[key].division ).find("label.gp").html(data[key].gp);
			$( "div."+data[key].division ).find("label.gp-yr").html(data[key].year);
		}
		if(type == "targetSafetyStocks"){
			$( "div."+data[key].division ).find("label.minimum").html(data[key].minimum);
			$( "div."+data[key].division ).find("label.stock-on-hand").html(data[key].stockOnHand);
		}
	}
}


function buildBusinessChart(_data){
	var ctx = $("#myChart");

	var data = {
	    labels: _data.labels,
	    datasets: _data.datasets
	};

	var myBarChart = new Chart(ctx, {
	    type: 'bar',
	    data: data,
	    options: {
	        barValueSpacing: 20,
	        scales: {
	            yAxes: [{
	                ticks: {
	                    min: 0,
	                }
	            }]
	        }
	    }
	});
}


function processData(allText){
	var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }

    var labels = [];
	var datasets = [] ;

	for(var i = 0; i < lines.length; i++){
		var machine;
		var values =[];
		for(var j = 0; j < lines[i].length; j++){
			var index = lines[i][j].split(':');
			if( j == 0){
				machine = index[1];
				continue;
			}
			values.push(index[1]);
		}
		var dataset = {
			label : machine,
			backgroundColor: getRandomColor(),
			data: values
		};
		datasets.push(dataset);
	}

	for(var x = 1 ; x < lines[0].length; x++)
	{
		index = lines[0][x].split(':');
		labels.push(index[0]);
	}

	var processed = {
		labels : labels,
		datasets : datasets
	};

	return processed;
}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}