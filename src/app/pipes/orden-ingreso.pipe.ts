import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {
  
  // OCURRE UN ERROR QUE CUANDO EL COMPONENTE SE RENDERIZA AÚN NO LLEGAN LOS DATOS DE FIREBASE, POR LO TANTO
  // EL PIPE ESTA APLICANDOSE A UN ARRAY VACIO

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    console.log('items',items);
    console.log('items slice',items.slice());
    return items.slice().sort( a => {
      if ( a.tipo ==='ingreso') {
        return -1;
      } else {
        return 1;
      }

    });
  }
}
