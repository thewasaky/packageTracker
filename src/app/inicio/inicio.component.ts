import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

declare var google;
declare var geocoder;
declare var $:any;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']

})

export class InicioComponent implements OnInit {
  markers = [];
  locacion="";
  elementType = NgxQrcodeElementTypes.IMG;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = this.locacion;


  wayPoints = [
    {
      location: { lat: 28.616204, lng: -106.029633 },
      stopover: true,
    },
  ];
  marker=null;
  map=null;
  origin = { lat: 28.605960, lng: -106.0355295 };

  destination = { lat: 28.634967, lng: -106.043675 };
  directionsService = new google.maps.DirectionsService();
directionsDisplay = new google.maps.DirectionsRenderer()

  constructor() { }

  ngOnInit(): void {

    this.loadMap();

  }



  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');
    // create LatLng object
    const myLatLng = {lat: 28.638692, lng: -106.077344};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    // This event listener will call addMarker() when the map is clicked.
    google.maps.event.addListener(this.map, 'click',  (event)=> {
      this.saveMarker(event.latLng);
      this.codeLatLng(event.latLng);
  });
  this.directionsDisplay.setMap(this.map);
  this.directionsDisplay.setPanel(indicatorsEle);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();

      mapEle.classList.add('show-map');
    });
    navigator.geolocation.getCurrentPosition((a)=>{this.success(a)}, (a)=>{this.error(a)});
  }
  success(a){
    var crd = {lat: a.coords.latitude, lng: a.coords.longitude};

    this.saveMarker(crd);
  }

  error(a){


  }

  calculateRoute() {
    var pos=0;
    this.markers.forEach((direction)=>{
      if(pos>0 || pos<(this.markers.length-1))
      this.wayPoints.push({ location: direction.position,
        stopover: true,});
    });
    this.directionsService.route({
      origin: this.markers[0].position,
      destination: this.markers[this.markers.length-1].position,
      waypoints: this.wayPoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
    }
  codeLatLng(location) {

    var input = location + '';
    var latlngStr = input.split(',', 2);

    var latlng = { lat: parseFloat(latlngStr[0].replace('(', '')), lng: parseFloat(latlngStr[1].replace(')', '')) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {

                //debugger;
                var domicilio = results[0].formatted_address.split(',');
                (<HTMLInputElement>document.getElementById("calle")).value = domicilio[0].substring(0, domicilio[0].lastIndexOf(" "));
                (<HTMLInputElement>document.getElementById("numeroExterior")).value = domicilio[0].substring(domicilio[0].lastIndexOf(" ") + 1);
                (<HTMLInputElement>document.getElementById("colonia")).value = domicilio[1];
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}


   addMarkers(location) {

      return new google.maps.Marker({
        position: location,
        map: this.map,
        title: "",
        animation: google.maps.Animation.DROP,
        draggable:true
      });

}

  saveMarker(location) {
    
    this.markers.push({
      position: location
    });
    this.addMarkers(location);
    this.locacion=location;
    document.getElementById("codigo").innerHTML='<ngx-qrcode    [elementType]="elementType"    [errorCorrectionLevel]="correctionLevel"    [value]="value"    cssClass="bshadow"></ngx-qrcode>';
  }




  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarkers(marker.position);
    });
  }


}
