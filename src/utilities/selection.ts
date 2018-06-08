import * as L from 'leaflet';
import {Injectable} from '@angular/core';
import {LatLngBounds} from 'leaflet';

@Injectable()
export class Selection {
  name: string;
  layerRef: L.Layer;
  bounds: LatLngBounds;
  color: string;
  incomingFlights: number;
  outgoingFlights: number;
  cyclingFlights: number;

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

  public setIncomingFlights(number) {
    this.incomingFlights = number;
  }

  public getIncomingFlights() {
    return this.incomingFlights;
  }

  public setOutgoingFlights(number) {
    this.outgoingFlights = number;
  }

  public getOutgoingFlights() {
    return this.outgoingFlights;
  }

  public setCyclingFlights(number) {
    this.cyclingFlights = number;
  }

  public getCyclingFlights() {
    return this.cyclingFlights;
  }
}
