import { Component, OnInit } from '@angular/core';
import {JsonService} from '../services/json.service';
import {AppConstants} from '../../utilities/app_constants';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  options = {
    layers: [
      L.tileLayer(this.app_constants.LAYER_OSM, {
        minZoom: 1.5,
        continuousWorld: false
      })
    ],
    zoomDelta: 0.25,
    zoomSnap: 0.25,
    zoom: 1.5,
    center: L.latLng(37, 105),
    maxBounds: this.app_constants.worldBounds,
  };

  layers: L.Layer[] = [];

  private map;

  constructor(private jsonService: JsonService,
              private app_constants: AppConstants) { }

  ngOnInit() {
  }

  onMapReady(map: L.Map) {
    console.log('Airports: ');
    console.log(this.jsonService.getAirportsGeoJSON());
    console.log('Flights: ');
    console.log(this.jsonService.getFlightsGeoJSON());
    this.map = map;

    L.control.scale().addTo(map);
  }
}
