import { Injectable } from '@angular/core';
import { Selection } from '../../utilities/selection';
import * as d3 from 'd3';
import {JsonService} from './json.service';

@Injectable()
export class SelectionService {

  private selectionList: Array<Selection>;

  private filterStops: boolean;

  constructor(private jsonService: JsonService) {
    this.filterStops = false;
  }

  public setFilterStops(isActive) {
    this.filterStops = isActive;
  }

  public getFilterStops(): any {
    return this.filterStops;
  }

  public updateSelectionList(list) {
    this.selectionList = list;
  }

  public getSelectionList() {
    return this.selectionList;
  }

  public updateSankeyData(flights) {
    if (this.selectionList) {
      this.selectionList.forEach((selection) => {
        let outgoingFlights = 0, incomingFlights = 0, cyclingFlights = 0;

        const outgoingFlightsData = flights.filter(function(flight) {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];
          const end = [coordinates[1][1], coordinates[1][0]];
          const selectedBounds = selection.getBounds();
          const isOutgoing = selectedBounds.contains(begin) && !selectedBounds.contains(end);
          if (isOutgoing) { outgoingFlights++; }
          return isOutgoing;
        })

        const incomingFlightsData = flights.filter(function(flight) {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];
          const end = [coordinates[1][1], coordinates[1][0]];
          const selectedBounds = selection.getBounds();
          const isIncoming = selectedBounds.contains(end) && !selectedBounds.contains(begin);
          if (isIncoming) { incomingFlights++; }
          return isIncoming;
        })

        const cyclingFlightsData = flights.filter(function(flight) {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];
          const end = [coordinates[1][1], coordinates[1][0]];
          const selectedBounds = selection.getBounds();
          const isCycling = selectedBounds.contains(begin) && selectedBounds.contains(end);
          if (isCycling) { cyclingFlights++; }
          return isCycling;
        })

        console.log('outgoingFlightsData: ' + outgoingFlightsData.length);

        const outgoingDstMapping = d3.map();
        const incomingSrcMapping = d3.map();

        outgoingFlightsData.forEach((flight) => {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];
          const end = [coordinates[1][1], coordinates[1][0]];

          let foundSelectionPair = false;
          this.selectionList.forEach((innerSelection) => {
            if (selection !== innerSelection) {
              if (innerSelection.getBounds().contains(end)) {
                const selectionName = innerSelection.getName();
                if (outgoingDstMapping.has(selectionName)) {
                  foundSelectionPair = true;
                  outgoingDstMapping.set(selectionName, outgoingDstMapping.get(selectionName) + 1);
                } else {
                  outgoingDstMapping.set(selectionName, 1);
                }
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
        });

        incomingFlightsData.forEach(function(flight) {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];

          let foundSelectionPair = false;
          this.selectionList.forEach((innerSelection) => {
            if (selection !== innerSelection) {
              if (innerSelection.getBounds().contains(begin)) {
                const selectionName = innerSelection.getName();
                if (incomingSrcMapping.has(selectionName)) {
                  foundSelectionPair = true;
                  incomingSrcMapping.set(selectionName, incomingSrcMapping.get(selectionName) + 1);
                } else {
                  incomingSrcMapping.set(selectionName, 1);
                }
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
        });
      });
    }
  }

}
