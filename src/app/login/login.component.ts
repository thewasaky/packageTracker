import { Component, OnInit } from '@angular/core';
import { ConexionApiService } from '../conexion-api.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare function mensajeErrorIniciarSesion(): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(private con: ConexionApiService,
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {

      this.registerForm = this.formBuilder.group({
        NumEmpleado: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(1)]],
      });

}
// convenience getter for easy access to form fields
get f() {
  return this.registerForm.controls;
}
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    //alert('SUCCESS!! :-)\n\n' + this.registerForm.value.NumEmpleado);
    this.obtenerDatos();
  }

  obtenerDatos() {
    this.con
      .obtenerUsuario(
        this.registerForm.value.NumEmpleado,
        this.registerForm.value.password
      )
      .subscribe((result) => {
        if (result[0] != null){
          this.router.navigate(['/menu']);
       } else {
          mensajeErrorIniciarSesion();
        }
      });
  }
  ponerCookies(depa,result){
    this.cookie.set('impe', result[0].impe);
    this.cookie.set('nombre',result[0].nombre);
    this.cookie.set('apaterno',result[0].apaterno);
    this.cookie.set('amaterno',result[0].amaterno);
    this.cookie.set('depa',depa);
  }

}
