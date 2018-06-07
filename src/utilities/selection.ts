import * as L from 'leaflet';
import {Injectable} from '@angular/core';

@Injectable()
export class Selection {
  name: string;
  bounds: L.LatLngBounds;
  color: string;
}
