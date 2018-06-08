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

    // L.control.scale().addTo(map);

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

      const selectionList = this.selectionService.getSelectionList();

      const all_flights = this.jsonService.getFlightsGeoJSON().features;
      let outgoingFlights = 0, incomingFlights = 0, cyclingFlights = 0;
      const outgoingFlightMapping;

      const outgoingFlightsData = all_flights.filter(function(flight) {
        const coordinates = flight.geometry.coordinates;
        const begin = [coordinates[0][1], coordinates[0][0]];
        const end = [coordinates[1][1], coordinates[1][0]];
        const selectedBounds = layer.getBounds();
        const isOutgoing = selectedBounds.contains(begin) && !selectedBounds.contains(end);
        if (isOutgoing) { outgoingFlights++; }
        return isOutgoing;
      })

      const incomingFlightsData = all_flights.filter(function(flight) {
        const coordinates = flight.geometry.coordinates;
        const begin = [coordinates[0][1], coordinates[0][0]];
        const end = [coordinates[1][1], coordinates[1][0]];
        const selectedBounds = layer.getBounds();
        const isIncoming = selectedBounds.contains(end) && !selectedBounds.contains(begin);
        if (isIncoming) { incomingFlights++; }
        return isIncoming;
      })

      const cyclingFlightsData = all_flights.filter(function(flight) {
        const coordinates = flight.geometry.coordinates;
        const begin = [coordinates[0][1], coordinates[0][0]];
        const end = [coordinates[1][1], coordinates[1][0]];
        const selectedBounds = layer.getBounds();
        const isCycling = selectedBounds.contains(begin) && selectedBounds.contains(end);
        if (isCycling) { cyclingFlights++; }
        return isCycling;
      })

      console.log('outgoingFlightsData: ' + outgoingFlightsData.length);

      const outgoingDstMapping = d3.map();
      const incomingSrcMapping = d3.map();

      outgoingFlightsData.forEach(function(flight) {
        const coordinates = flight.geometry.coordinates;
        const begin = [coordinates[0][1], coordinates[0][0]];
        const end = [coordinates[1][1], coordinates[1][0]];

        if (selectionList) {
          let foundSelectionPair = false;
          selectionList.forEach((selection) => {
            if (selection.getBounds().contains(end)) {
              const selectionName = selection.getName();
              if (outgoingDstMapping.has(selectionName)) {
                foundSelectionPair = true;
                outgoingDstMapping.set(selectionName, outgoingDstMapping.get(selectionName) + 1);
              } else {
                outgoingDstMapping.set(selectionName, 1);
              }
            }
          });
          if (!foundSelectionPair) {
            if (outgoingDstMapping.has('Others')) {
              outgoingDstMapping.set('Others', outgoingDstMapping.get('Others') + 1);
            } else {
              outgoingDstMapping.set('Others', 1);
            }
          }
        } else {
          if (outgoingDstMapping.has('Others')) {
            outgoingDstMapping.set('Others', outgoingDstMapping.get('Others') + 1);
          } else {
            outgoingDstMapping.set('Others', 1);
          }
        }
      })

      incomingFlightsData.forEach(function(flight) {
        const coordinates = flight.geometry.coordinates;
        const begin = [coordinates[0][1], coordinates[0][0]];

        if (selectionList) {
          let foundSelectionPair = false;
          selectionList.forEach((selection) => {
            if (selection.getBounds().contains(begin)) {
              const selectionName = selection.getName();
              if (incomingSrcMapping.has(selectionName)) {
                foundSelectionPair = true;
                incomingSrcMapping.set(selectionName, incomingSrcMapping.get(selectionName) + 1);
              } else {
                incomingSrcMapping.set(selectionName, 1);
              }
            }
          });
          if (!foundSelectionPair) {
            if (incomingSrcMapping.has('Others')) {
              incomingSrcMapping.set('Others', incomingSrcMapping.get('Others') + 1);
            } else {
              incomingSrcMapping.set('Others', 1);
            }
          }
        } else {
          if (incomingSrcMapping.has('Others')) {
            incomingSrcMapping.set('Others', incomingSrcMapping.get('Others') + 1);
          } else {
            incomingSrcMapping.set('Others', 1);
          }
        }
      })

      console.log(outgoingDstMapping);
      console.log(incomingSrcMapping);
      console.log('outgoing: ' + outgoingFlights + ', ingoing: ' + incomingFlights + ', cycle: ' + cyclingFlights);

      this.finishSelectionChange.emit({
        layerRef: layer,
        bounds: layer.getBounds(),
        outgoingFlights: outgoingFlights,
        incomingFlights: incomingFlights,
        cyclingFlights: cyclingFlights,
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
        if (i === 50) {
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
        color: 'rgba(255,255,255,0.7)',
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
