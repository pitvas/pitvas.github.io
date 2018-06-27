
		var latMarker=null;
		var lngMarker=null;
		var latLanMarker=document.getElementById("latForMarker");
		var lngForMarker=document.getElementById("lngForMarker");
		var markerArray=[];
		var coordsButton=document.getElementById('send');
		var isAddress=null;
		var distanceArray=[];
		var resultArray=[];
		var mediumResult;
		var resultDistance=null;
		document.getElementById("send").disabled = true;
		var counter={
			key: 1,
			count: function(){return this.key++}
		}

		function alertText(text){
			var div=document.createElement('div');
			div.classList.add("my-alert");
			div.innerHTML=`<div class="alert alert-danger alert-dismissible fade show" role="alert">
  								<strong>Oops, error!</strong> ${text}.
  								<button type="button" class="close" data-dismiss="alert" aria-label="Close">
    							<span aria-hidden="true">&times;</span>
  								</button>
							</div>`
			document.body.appendChild(div);
		}
		
		
		function initMap(){
			var minsk={lat:53.9 ,lng:27.56667};
			var div=document.getElementById('map');
			var options={
				zoom: 5,
				center: minsk,
				disableDefaultUI: true,
				gestureHandling: 'greedy'
			};

			var geocoder= new google.maps.Geocoder;
			var infoWindow= new google.maps.InfoWindow;
			var isMap= new google.maps.Map(div, options);
			addMarker(minsk,isMap);

			function addMarker(location, map){
				if(markerArray.length>=1){
					markerArray[0].setMap(null);
					markerArray.shift(markerArray[0]);
				}
					var marker=new google.maps.Marker({
						position: location,
						map: map,
					});
					markerArray.push(marker);
            }


			google.maps.event.addDomListener(isMap, 'dblclick', function(event) {
				document.getElementById("send").disabled = false;
  				addMarker(event.latLng, isMap);
  				latMarker=event.latLng.lat();
  				lngMarker=event.latLng.lng();
  				latForMarker.value=latMarker;
  				lngForMarker.value=lngMarker;
			});

			coordsButton.addEventListener('click', geocodeLatLng.bind(null,geocoder,isMap,infoWindow))

			
				 function geocodeLatLng(geocoder, map, infowindow, event ) {
					var latLng;
					if(!latMarker||!lngMarker){
						latlng = minsk;
					}else{
  						latlng = {lat: latMarker, lng: lngMarker};
  					}
  					geocoder.geocode({'location': latlng}, function(results, status) {
    				if (status === 'OK') {
      					if (results[0]) {
        					isAddress=results[0].formatted_address;
       				 	infowindow.setContent(results[0].formatted_address);
       				 	infowindow.open(map, markerArray[0]);
       				 	getDistanceBetween();
       				 	createTable(counter.count(),latMarker,lngMarker,isAddress,mediumResult,resultDistance);
      					} else {
       					 alertText('No results found');
     				 	}
    				} else {
    					alertText("Sorry, we could not convert your coordinates to address")
   						}
 				   });
			    }

		 	function getDistanceBetween(){
		 		if(distanceArray.length == 0){
		 			distanceArray.push(minsk);
		 		}
		 		var latlng = {lat: latMarker, lng: lngMarker};
			    var startCord=new google.maps.LatLng(latlng.lat,latlng.lng);
			    var finishCord=new google.maps.LatLng(distanceArray[distanceArray.length-1].lat, distanceArray[distanceArray.length-1].lng);
			    mediumResult=google.maps.geometry.spherical.computeDistanceBetween(startCord,finishCord)/1000;
			    distanceArray.push(latlng);
			    resultArray.push(mediumResult)
			    resultDistance=resultArray.reduce((sum,current) => sum+current,0);
			}

				var table=document.createElement('table');
				table.classList.add('table-bordered');

			 function createTable(key,lat,lng,address,distance,overDistance){
			 	var arr=[key,lat,lng,address,distance];
				if(!document.getElementById('tableResult')){
					table.id='tableResult'
					document.getElementById('forTable').appendChild(table);
					table.innerHTML=`<thead><tr><th scope='col'>#</th><th scope='col'>Latitude</th><th scope='col'>Longitude</th><th scope='col'>Address</th><th scope='col'>Distance between marker(km)</th></tr></thead>`;
					var tr=document.createElement('tr');
					for(var i=0;i<arr.length;i++){
						var td=document.createElement('td');
						td.innerHTML=arr[i];
						td.setAttribute('scope','row');
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}else{
					var tr=document.createElement('tr');
					for(var i=0;i<arr.length;i++){
						var td=document.createElement('td');
						td.innerHTML=arr[i];
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}
				if(!document.getElementById('resString')){
					var str=document.createElement('p');
					str.id='resString'
					document.getElementById('forResult').appendChild(str);
					str.innerHTML=overDistance+'km';
				}
				else{
					document.getElementById('resString').innerHTML=overDistance+'km';
				}
			}

		}



