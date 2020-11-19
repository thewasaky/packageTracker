import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { InicioComponent } from './inicio/inicio.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { ConexionApiService } from "./conexion-api.service";
import { CookieService } from 'ngx-cookie-service';
import { MenuComponent } from './menu/menu.component';
import { RutasComponent } from './rutas/rutas.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    MenuComponent,
    RutasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxQRCodeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConexionApiService,
    CookieService,{provide:LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
