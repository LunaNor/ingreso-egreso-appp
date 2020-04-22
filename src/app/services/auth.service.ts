import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSuscription = new Subscription;
  private _user: Usuario;


  get user() {
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  // solo se hara una vez, por lo tanto debemos suscribirnos pero la suscripcion interna
  // quedará dando vueltas y seguirá recibiendo información una vez que haga logout
  initAuthListener () {
    // cada vez que se emite un valor realiza el callback
    this.auth.authState.subscribe( fuser => {
      //console.log( fuser?.uid ) // si esto existe lo imprime
      if ( fuser ) {
        // existe
        this.userSuscription = this.firestore.doc(`${ fuser.uid}/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
  
            const user = Usuario.fromfireBase( firestoreUser );
            this._user = user;
            this.store.dispatch( authActions.setUser({ user }));
          });
      
      } else {
        // no existe
        this._user = null;
        this.userSuscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
        this.store.dispatch( ingresoEgresoActions.unSetItems());

      }
    });

  }

  crearUsuario( nombre: string, email: string, password: string ) {
    //console.log({ nombre, email, password });
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {
          const newUser = new Usuario(user.uid, nombre, user.email);
          
          return this.firestore.doc(`${ user.uid}/usuario`).set({...newUser }); 
        });
  }

  loginUsuario( email: string, password: string ) {
    return this.auth.signInWithEmailAndPassword( email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    //regresa un observable que resuelve el usuario de firebase
    return this.auth.authState.pipe(
      map( fbUser => fbUser !==  null)
    );
  }
}
