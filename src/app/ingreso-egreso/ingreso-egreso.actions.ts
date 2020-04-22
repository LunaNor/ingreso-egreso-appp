import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const unSetItems = createAction('[IngresoEgreso] setItems');
export const setItems = createAction(
    '[IngresoEgreso] unSetItems',
    props<{items: IngresoEgreso[]}>()
);

