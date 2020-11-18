import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ConexionApiService } from '../conexion-api.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  markern=null;
  locacion="";
  elementType = NgxQrcodeElementTypes.IMG;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = this.locacion;

  numEmpleado="";
  numRastreo="";
  idRuta=null;

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

  constructor(private con: ConexionApiService,
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router) { }

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
      //this.saveMarker(event.latLng);
      this.deleteMarkers();
      this.saveMarker(event.latLng);
      this.codeLatLng(event.latLng);
      var a=<HTMLImageElement>document.getElementById("imagen");
      a.src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl="+event.latLng+"&choe=UTF-8";
  });

  this.directionsDisplay.setMap(this.map);
  this.directionsDisplay.setPanel(indicatorsEle);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      //this.renderMarkers();

      mapEle.classList.add('show-map');
    });
    navigator.geolocation.getCurrentPosition((a)=>{this.success(a)}, (a)=>{this.error(a)});
  }
  success(a){
    var crd = {lat: a.coords.latitude, lng: a.coords.longitude};

    this.saveMarker(crd);
    this.codeLatLng2(crd);
  }

  error(a){


  }
  crearRuta(){
    var num=(<HTMLInputElement>document.getElementById("codEmpleado"));
    if(num.value!=""){
      num.disabled=true;
      this.con.crearRuta(num.value).subscribe(
        result=>{
          if(result[0]!=null){
            this.idRuta=result[0].id;
            alert("ruta generada");
          }else{
            alert("error al crear ruta");
          }
        }
      );
    }

  }
  guardar(){
    window.print();
  }

  // Sets the map on all markers in the array.
 setMapOnAll() {
  for (let i = 0; i <this.markers.length; i++) {
    this.markers[i].setMap(this.map);
  }
}

// Removes the markers from the map, but keeps them in the array.
 clearMarkers() {
  this.setMapOnAll();
}

// Deletes all markers in the array by removing references to them.
 deleteMarkers() {
  this.clearMarkers();
  this.markers = [];
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
                (<HTMLInputElement>document.getElementById("calle2")).value = domicilio[0].substring(0, domicilio[0].lastIndexOf(" "));
                (<HTMLInputElement>document.getElementById("numeroExterior2")).value = domicilio[0].substring(domicilio[0].lastIndexOf(" ") + 1);
                (<HTMLInputElement>document.getElementById("colonia2")).value = domicilio[1];
            } else {
               // alert('No results found');
            }
        } else {
            //alert('Geocoder failed due to: ' + status);
        }
    });
}
codeLatLng2(location) {


  var latlng = location;
  geocoder.geocode({ 'location': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {

              //debugger;
              var domicilio = results[0].formatted_address.split(',');
              (<HTMLInputElement>document.getElementById("calle")).value = domicilio[0].substring(0, domicilio[0].lastIndexOf(" "));
              (<HTMLInputElement>document.getElementById("numeroExterior")).value = domicilio[0].substring(domicilio[0].lastIndexOf(" ") + 1);
              (<HTMLInputElement>document.getElementById("colonia")).value = domicilio[1];
              (<HTMLInputElement>document.getElementById("calle2")).value = domicilio[0].substring(0, domicilio[0].lastIndexOf(" "));
              (<HTMLInputElement>document.getElementById("numeroExterior2")).value = domicilio[0].substring(domicilio[0].lastIndexOf(" ") + 1);
              (<HTMLInputElement>document.getElementById("colonia2")).value = domicilio[1];
          } else {
             // alert('No results found');
          }
      } else {
          //alert('Geocoder failed due to: ' + status);
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

handleEvent(event) {
  var crd = {lat:event.latLng.lat(), lng: event.latLng.lng()};
  if (this.markern!=null) {
    this.markern.setPosition(location);
    this.codeLatLng(event.latLng);
} else {
    this.markern = new google.maps.Marker({
        position: location,
        animation: google.maps.Animation.DROP,

        map: this.map

    });
        //this.markern.addListener('drag', this.handleEvent);
        this.markern.addListener('dragend', this.handleEvent);
    this.codeLatLng(location);
}
  this.codeLatLng(event.latLng);

}

  saveMarker(location) {
    if (this.markern!=null) {
      this.markern.setPosition(location);
      this.codeLatLng2(location);
  } else {
      this.markern = new google.maps.Marker({
          position: location,
          animation: google.maps.Animation.DROP,

          map: this.map

      });
          //this.markern.addListener('drag', this.handleEvent);
          //this.markern.addListener('dragend', this.handleEvent);
      this.codeLatLng2(location);
  }

    //this.markers.push(marker);

    //this.addMarkers(location);
    //this.locacion=location;
   // document.getElementById("codigo").innerHTML='<ngx-qrcode    [elementType]="elementType"    [errorCorrectionLevel]="correctionLevel"    [value]="value"    cssClass="bshadow"></ngx-qrcode>';
  }


  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarkers(marker);
    });
  }


}
