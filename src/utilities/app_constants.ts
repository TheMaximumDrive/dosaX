import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class AppConstants {

  readonly mapboxAccessToken = 'pk.eyJ1IjoibWF4aW11bWRyaXZlIiwiYSI6ImNqNW1kaDNoYzNlbDAycXA4eXphODdpd2cifQ.1rzMimmRE_AFJvEU6eQlQA';
  readonly southWest = L.latLng(-80.9, -169.5);
  readonly northEast = L.latLng(85.0, 191.3);
  readonly worldBounds: L.LatLngBounds = L.latLngBounds(this.southWest, this.northEast);
  readonly LAYER_OSM = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken;

}
