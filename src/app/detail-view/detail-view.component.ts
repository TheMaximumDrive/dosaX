import { Component, OnInit } from '@angular/core';
import {JsonService} from '../services/json.service';
import {AppConstants} from '../../utilities/app_constants';
import * as L from 'leaflet';
import * as d3 from 'd3';

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
    zoom: 1.75,
    center: L.latLng(37, 105),
    maxBounds: this.app_constants.worldBounds,
    attributionControl: false
  };

  layers: L.Layer[] = [];

  private map;
  private airportMarkerList: Array<L.Marker>;
  private flightArcList: Array<L.Polyline>;

  constructor(private jsonService: JsonService,
              private app_constants: AppConstants) {
  }

  ngOnInit() {
  }

  onMapReady(map: L.Map) {
    console.log('Airports: ');
    console.log(this.jsonService.getAirportsGeoJSON());
    console.log('Flights: ');
    console.log(this.jsonService.getFlightsGeoJSON());
    this.map = map;
    this.airportMarkerList = new Array<L.Marker>();
    this.flightArcList = new Array<L.Polyline>();

    // L.control.scale().addTo(map);

    const airports = this.jsonService.getAirportsGeoJSON().features;
    airports.forEach((airport) => {
      const latlng = L.latLng(airport.geometry.coordinates[1], airport.geometry.coordinates[0]);
      const marker = L.marker(latlng, {
      icon: L.icon({
        iconSize: [ 6, 6 ],
        iconAnchor: [ 3, 6 ],
        iconUrl: 'assets/airport.png'
      })
    });
      this.airportMarkerList.push(marker);
    });
    this.airportMarkerList.forEach((airportMarker) => {
      airportMarker.addTo(map);
    });

    /*const path = L.curve(['M', [50.54136296522163, 28.520507812500004],
        'C', [52.214338608258224, 28.564453125000004],
        [48.45835188280866, 33.57421875000001],
        [50.680797145321655, 33.83789062500001],
        'V', [48.40003249610685],
        'L', [47.45839225859763, 31.201171875],
        [48.40003249610685, 28.564453125000004], 'Z'],
      {color: 'red', fill: true}).addTo(map);*/


    let flights = this.jsonService.getFlightsGeoJSON().features;
    let i = 0;
    flights = flights.filter(function(flight) {
      if (i === 20) {
        i = 0;
        return true;
      } else {
        i++;
        return false;
      }
    });
    flights.forEach((flight) => {
      const coordinates = flight.geometry.coordinates;
      const begin = [coordinates[0][1], coordinates[0][0]];
      const end = [coordinates[1][1], coordinates[1][0]];
      if (begin[0] !== end[0] && begin[1] !== end[1]) {
        this.flightArcList.push(L.Polyline.Arc(begin, end, {
          color: 'rgba(255,255,255,0.1)',
          vertices: 200
        }));
      }
    });

    this.flightArcList.forEach((flightArc) => {
      flightArc.addTo(map);
    });

  }
}
