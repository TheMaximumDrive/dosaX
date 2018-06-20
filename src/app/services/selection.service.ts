import { Injectable } from '@angular/core';
import { Selection } from '../../utilities/selection';
import * as d3 from 'd3';
import {JsonService} from './json.service';

@Injectable()
export class SelectionService {

  private selectionList: Array<Selection>;
  private outgoingFlightMapDataArray: Array<Array<Array<any>>>;
  private outgoingFlightMapColors: Array<Array<string>>;
  private incomingFlightMapDataArray: Array<Array<Array<any>>>;
  private incomingFlightMapColors: Array<Array<string>>;
  private numOfTotalFlights;
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

  public getOutgoingFlightMapData() {
    return this.outgoingFlightMapDataArray;
  }

  public getOutgoingFlightMapColors() {
    return this.outgoingFlightMapColors;
  }

  public getIncomingFlightMapData() {
    return this.incomingFlightMapDataArray;
  }

  public getIncomingFlightMapColors() {
    return this.incomingFlightMapColors;
  }

  public getNumOfTotalFlights() {
    return this.numOfTotalFlights;
  }

  public updateSankeyData(flights) {
    if (this.selectionList) {
      this.numOfTotalFlights = flights.length;
      this.outgoingFlightMapDataArray = new Array<Array<Array<any>>>();
      this.outgoingFlightMapColors = new Array<Array<string>>();
      this.incomingFlightMapDataArray = new Array<Array<Array<any>>>();
      this.incomingFlightMapColors = new Array<Array<string>>();

      this.selectionList.forEach((selection, index) => {
        let outgoingFlights = 0, cyclingFlights = 0;

        const outgoingFlightsData = flights.filter(function(flight) {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];
          const end = [coordinates[1][1], coordinates[1][0]];
          const selectedBounds = selection.getBounds();
          const isOutgoing = selectedBounds.contains(begin) && !selectedBounds.contains(end);
          if (isOutgoing) { outgoingFlights++; }
          return isOutgoing;
        });

        selection.setNumOfOutgoingFlights(outgoingFlights);

        const cyclingFlightsData = flights.filter(function(flight) {
          const coordinates = flight.geometry.coordinates;
          const begin = [coordinates[0][1], coordinates[0][0]];
          const end = [coordinates[1][1], coordinates[1][0]];
          const selectedBounds = selection.getBounds();
          const isCycling = selectedBounds.contains(begin) && selectedBounds.contains(end);
          if (isCycling) { cyclingFlights++; }
          return isCycling;
        });

        selection.setNumOfCyclingFlights(cyclingFlights);

        const outgoingDstMapping = d3.map();

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

        const outgoingFlightMapDataArrayEntry = new Array<Array<any>>();
        const outgoingFlightMapEntryColors = Array<string>();
        outgoingFlightMapEntryColors.push(selection.getColor());
        outgoingDstMapping.entries().forEach((entry) => {
          outgoingFlightMapDataArrayEntry.push([selection.getName(), entry.key, entry.value]);
          const s = this.selectionList.filter((d) => {
            return d.getName() === entry.key;
          });
          if (s[0]) {
            outgoingFlightMapEntryColors.push(s[0].getColor());
          } else {
            // Add a color for the other flight sources and destinations
            outgoingFlightMapEntryColors.push('#fff');
          }
        });
        this.outgoingFlightMapDataArray.push(outgoingFlightMapDataArrayEntry);
        this.outgoingFlightMapColors.push(outgoingFlightMapEntryColors);

        // this.outgoingFlightMapColors.push(selection.getColor());
        // this.incomingFlightMapColors.push(selection.getColor());
      });
    }
  }

}
