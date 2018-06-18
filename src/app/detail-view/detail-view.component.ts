import {Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {JsonService} from '../services/json.service';
import {AppConstants} from '../../utilities/app_constants';
import * as L from 'leaflet';
import * as d3 from 'd3';
import {Selection} from '../../utilities/selection';
import {SelectionService} from '../services/selection.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit, OnChanges {

  @Input() deleteSelection: Selection;
  @Input() updateMapCounter: number;
  @Output() finishSelectionChange = new EventEmitter();

  private editableLayers = new L.FeatureGroup();
  private currentAreaSelectionColor = '#ffc859';

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

  drawOptions = {
    position: 'topright',
    draw: {
      polyline: false,
      polygon: false,
      circle: false,
      rectangle: {
        shapeOptions: {
          color: this.currentAreaSelectionColor,
          clickable: false
        }
      },
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: this.editableLayers,
      remove: false
    }
  };

  layers: L.Layer[] = [];

  private map;
  private drawControl;
  private areaSelect;
  private airportMarkerList: Array<L.Marker>;
  private flightArcList: Array<L.Polyline>;
  private airportLayerGroup: L.FeatureGroup;
  private flightArcLayerGroup: L.FeatureGroup;

  constructor(private jsonService: JsonService,
              private selectionService: SelectionService,
              private app_constants: AppConstants,
              private zone: NgZone) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['deleteSelection']) {
      this.editableLayers.removeLayer(changes.deleteSelection.currentValue);
    } else if (changes['updateMapCounter']) {
      this.updateMap();
    }

    /*if (changes.selectionEnabled.currentValue) {
      this.promptSelection();
    }
    setTimeout(() => this.finishSelectionChange.emit(), 0);*/
  }

  onMapReady(map: L.Map) {
    /*console.log('Airports: ');
    console.log(this.jsonService.getAirportsGeoJSON());
    console.log('Flights: ');
    console.log(this.jsonService.getFlightsGeoJSON());*/
    this.map = map;
    this.areaSelect = this.map.selectAreaFeature;
    this.airportMarkerList = new Array<L.Marker>();
    this.flightArcList = new Array<L.Polyline>();
    this.airportLayerGroup = L.featureGroup();
    this.flightArcLayerGroup = L.featureGroup();

    /*const airports = this.jsonService.getAirportsGeoJSON().features;
    airports.forEach((airport) => {
      const latlng = L.latLng(airport.geometry.coordinates[1], airport.geometry.coordinates[0]);
      const marker = L.marker(latlng, {
        icon: L.icon({
          iconSize: [ 4, 4 ],
          iconAnchor: [ 2, 4 ],
          iconUrl: 'assets/airport.png'
        })
      });
      this.airportMarkerList.push(marker);
      this.airportLayerGroup.addLayer(marker);
    });
    this.layers.push(this.airportLayerGroup);*/

    let flights = this.jsonService.getFlightsGeoJSON().features;
    flights = this.filterFlightsGeoJSON(flights);

    flights.forEach((flight) => {
      this.createArcByFlight(flight);
    });

    this.layers.push(this.flightArcLayerGroup);
    this.flightArcLayerGroup.bringToFront();
  }

  onDrawReady(drawControl: L.Control.Draw) {
    // Do stuff with map
    this.drawControl = drawControl;

    this.layers.push(this.editableLayers);
    this.map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;

      this.editableLayers.addLayer(layer);

      const rndColor = this.getRandomColor();
      this.drawControl.setDrawingOptions({
        rectangle: {
          shapeOptions: {
            color: rndColor
          }
        }
      });

      this.finishSelectionChange.emit({
        layerRef: layer,
        bounds: layer.getBounds(),
        color: this.currentAreaSelectionColor
      });
      this.currentAreaSelectionColor = rndColor;
    });

    this.map.on(L.Draw.Event.EDITED, (e) => {
      const layer = e.layersDiffer;
      // console.log(layer);
    });
  }

  private updateMap() {
    this.cleanFlightsLayer();

    let flights = this.jsonService.getFlightsGeoJSON().features;
    flights = this.filterFlightsGeoJSON(flights);

    flights.forEach((flight) => {
      this.createArcByFlight(flight);
    });

    this.layers.push(this.flightArcLayerGroup);
    this.flightArcLayerGroup.bringToFront();

  }

  private cleanFlightsLayer() {
    const index: number = this.layers.indexOf(this.flightArcLayerGroup);
    this.layers.splice(index, 1);
    this.flightArcLayerGroup.remove();
    this.flightArcList = new Array<L.Polyline>();
    this.flightArcLayerGroup = L.featureGroup();
  }

  private filterFlightsGeoJSON(flights) {
    let i = 0;
    if (this.selectionService.getFilterStops()) {
      flights = flights.filter(function(flight) {
        return flight.properties.stops !== '0';
      });
    } else {
      flights = flights.filter(() => {
        if (i === 30) {
          i = 0;
          return true;
        } else {
          i++;
          return false;
        }
      });
    }
    return flights;
  }

  private createArcByFlight(flight) {
    const coordinates = flight.geometry.coordinates;
    const begin = [coordinates[0][1], coordinates[0][0]];
    const end = [coordinates[1][1], coordinates[1][0]];
    if (begin[0] !== end[0] && begin[1] !== end[1]) {
      const arc = L.Polyline.Arc(begin, end, {
        color: 'rgba(220,193,113,0.5)',
        weight: 0.5,
        vertices: 200
      });
      this.flightArcList.push(arc);
      this.flightArcLayerGroup.addLayer(arc);
    }
  }

  private getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
}
