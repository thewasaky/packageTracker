import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ConexionApiService {
  //url="http://proceso.policiachihuahua.gob.mx/apiProceso/";
  url="http://localhost:80/apiPackage/";
  constructor(private http:HttpClient) { }

  obtenerUsuario(usr,pass){
    return this.http.get(`${this.url}obtenerUsuario.php?usr=${usr}&pass=${pass}`);
  }
  crearRuta(numEmpleado){
    return this.http.get(`${this.url}crearRuta.php?num=${numEmpleado}`);
  }
  guardarEnRuta(numRastreo,latlng,idRuta){
    return this.http.get(`${this.url}guardarEnRuta.php?num=${numRastreo}&latlng=${latlng}&idRuta=${idRuta}`);
  }
  obtenerRutas(idRuta){
    return this.http.get(`${this.url}obtenerRutas.php?idRuta=${idRuta}`);
  }
  obtenerNumerosEmpleados(){
    return this.http.get(`${this.url}obtenerNumerosEmpleados.php`);
  }
}
