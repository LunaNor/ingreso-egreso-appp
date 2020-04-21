import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });
  }

  // Si no se destruye la suscripicion, y cargamos el login 4 veces, se crean 4 instancias de la suscripcion o es la misma que sigue dando vueltas
  // si, es la misma suscripcion porque el mensaje en colsola en chrome se repite varias veces
  ngOnDestroy () {
    this.uiSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) return;
  
    /* REALIZAMOS LA ACCION DE QUE ESTÁ CARGANDO */
    this.store.dispatch( ui.isLoading() );

    /* Swal.fire({
      title: 'Espere porfavor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    }) */

    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario( email, password  )
      .then( data => {
        //Swal.close();
        this.store.dispatch( ui.stopLoading());
        this.router.navigate(['/'])
      })
      .catch( err => { 
        this.store.dispatch( ui.isLoading()); 
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })  
      })
  } 


}
