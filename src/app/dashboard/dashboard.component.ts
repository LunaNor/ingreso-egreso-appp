import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs = new Subscription;
  ingresosSubs = new  Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    // RECIBIMOS ACA LOS INGRESOS-EGRESOS PORQUE CUANDO HACEMOS LOGOUT ES CUANDO SE DESTRUIRIA ESTE COMPONENTE Y
    // Y YA NO RECIBIRIAMOS EMISIONES DEL OSERVABLE. ES DECIR DEBEMIS RECIBIR EMISIONES DE IE CONSTATEMENTE 
    // Y ACA EN EL DASHBORARD ES BUENA LUGAR PORQUE EL COMPONENTE NUNCA ES DESTRUIDO
    this.userSubs =  this.store.select('user').pipe(
      filter( auth => auth.user != null ) // solo emite cuando sea distinto de nulo
    )
    .subscribe( ({user}) => {
      this.ingresosSubs =  this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
        .subscribe( ingresosEgresosFB => {
          this.store.dispatch(ieActions.setItems({ items: ingresosEgresosFB }));
        });
    })
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

}
