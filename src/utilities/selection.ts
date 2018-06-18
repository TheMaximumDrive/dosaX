import * as L from 'leaflet';
import {Injectable} from '@angular/core';
import {LatLngBounds} from 'leaflet';

@Injectable()
export class Selection {
  name: string;
  layerRef: L.Layer;
  bounds: LatLngBounds;
  color: string;
  numOfOutgoingFlights: number;
  numOfCyclingFlights: number;

  public setName(name) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public setLayerRef(layerRef) {
    this.layerRef = layerRef;
  }

  public getLayerRef() {
    return this.layerRef;
  }

  public setBounds(bounds) {
    this.bounds = bounds;
  }

  public getBounds() {
    return this.bounds;
  }

  public setColor(color) {
    this.color = color;
  }

  public getColor() {
    return this.color;
  }

  public setNumOfOutgoingFlights(number) {
    this.numOfOutgoingFlights = number;
  }

  public getNumOfOutgoingFlights() {
    return this.numOfOutgoingFlights;
  }

  public setNumOfCyclingFlights(number) {
    this.numOfCyclingFlights = number;
  }

  public getNumOfCyclingFlights() {
    return this.numOfCyclingFlights;
  }
}
