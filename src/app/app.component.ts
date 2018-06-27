import {ChangeDetectorRef, Component} from '@angular/core';
import {selection} from 'd3-selection';
import {Selection} from '../utilities/selection';
import {SelectionService} from './services/selection.service';
import {JsonService} from './services/json.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  selectionList: Array<Selection> = new Array<Selection>();
  deleteSelection: L.Layer;
  updateMapCounter = 0;
  selectionCounter = 0;

  constructor(private jsonService: JsonService,
              private selectionService: SelectionService,
              private changeDetector: ChangeDetectorRef) {}

  deleteSelectionRequest(index: number) {
    if (index !== -1) {
      this.deleteSelection = this.selectionList[index].getLayerRef();
      this.selectionList.splice(index, 1);
      this.selectionService.updateSelectionList(this.selectionList);
      this.selectionList = this.selectionList.slice();
      const flights = this.jsonService.getCurrentDrawnFlightsGeoJSON().features;
      if (!flights) {
        this.selectionService.updateSankeyData(this.jsonService.getFlightsGeoJSON().features);
      } else {
        this.selectionService.updateSankeyData(flights);
      }

      this.changeDetector.detectChanges();
    }
  }

  changeSelectionNameRequest($event) {
    const index: number = this.selectionList.indexOf($event.selection);
    this.selectionList[index].setName($event.newName);
    this.selectionService.updateSelectionList(this.selectionList);
    this.selectionList = this.selectionList.slice();
    let flights = this.jsonService.getCurrentDrawnFlightsGeoJSON().features;
    if (!flights) {
      flights = this.jsonService.getFlightsGeoJSON().features;
      if (this.selectionService.getFilterStops()) {
        flights = flights.filter(function(flight) {
          return flight.properties.stops !== '0';
        });
      } else {
        flights = this.selectionService.selectRandomFlightSample(flights);
      }
    }
    this.jsonService.setCurrentDrawnFlightsGeoJSON(flights);
    this.selectionService.updateSankeyData(flights);
    this.changeDetector.detectChanges();
  }

  updateMapRequest() {
    let flights = this.jsonService.getCurrentDrawnFlightsGeoJSON().features;
    if (!flights) {
      flights = this.jsonService.getFlightsGeoJSON().features;
      if (this.selectionService.getFilterStops()) {
        flights = flights.filter(function(flight) {
          return flight.properties.stops !== '0';
        });
      } else {
        flights = this.selectionService.selectRandomFlightSample(flights);
      }
    }
    this.jsonService.setCurrentDrawnFlightsGeoJSON(flights);
    this.selectionService.updateSankeyData(flights);
    this.updateMapCounter++;
  }

  finishSelectionRequest($event) {
    const _selection = new Selection();
    _selection.setName('Unbenannt' + ((this.selectionCounter++) === 0 ? '' : this.selectionCounter));
    _selection.setLayerRef($event.layerRef);
    _selection.setBounds($event.bounds);
    _selection.setColor($event.color);
    this.selectionList.push(_selection);
    this.selectionList = this.selectionList.slice();
    this.selectionService.updateSelectionList(this.selectionList);
    let flights = this.jsonService.getCurrentDrawnFlightsGeoJSON().features;
    if (!flights) {
      flights = this.jsonService.getFlightsGeoJSON().features;
      if (this.selectionService.getFilterStops()) {
        flights = flights.filter(function(flight) {
          return flight.properties.stops !== '0';
        });
      } else {
        flights = this.selectionService.selectRandomFlightSample(flights);
      }
    }
    this.jsonService.setCurrentDrawnFlightsGeoJSON(flights);
    this.selectionService.updateSankeyData(flights);
    this.changeDetector.detectChanges();
  }

  updateSelectionRequest($event) {
    const selectionChanges = $event.selectionChangeList;
    selectionChanges.forEach((change) => {
      this.selectionList.forEach((sel, idx) => {
        if (sel.getColor() === change.getColor()) {
          this.selectionList[idx].setColor(change.getColor());
          this.selectionList[idx].setBounds(change.getBounds());
        }
      });
    });
    this.selectionList = this.selectionList.slice();
    this.selectionService.updateSelectionList(this.selectionList);
    let flights = this.jsonService.getCurrentDrawnFlightsGeoJSON().features;
    if (!flights) {
      flights = this.jsonService.getFlightsGeoJSON().features;
      if (this.selectionService.getFilterStops()) {
        flights = flights.filter(function(flight) {
          return flight.properties.stops !== '0';
        });
      } else {
        flights = this.selectionService.selectRandomFlightSample(flights);
      }
    }
    this.jsonService.setCurrentDrawnFlightsGeoJSON(flights);
    this.selectionService.updateSankeyData(flights);
    this.changeDetector.detectChanges();
  }
}
