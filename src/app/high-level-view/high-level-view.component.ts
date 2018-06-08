import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as L from 'leaflet';
import {AppConstants} from '../../utilities/app_constants';
import {JsonService} from '../services/json.service';
import {Selection} from '../../utilities/selection';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-high-level-view',
  templateUrl: './high-level-view.component.html',
  styleUrls: ['./high-level-view.component.scss']
})
export class HighLevelViewComponent implements OnInit, OnChanges {

  @Input() selectionList: Array<Selection>;

  private chart: Chart;
  private sankeyDiagramData;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectionList']) {
      console.log(changes.selectionList.currentValue);
      this.updateHighLevelMap();
    }

  }

  private updateHighLevelMap() {
    console.log('updateHighLevelMap');

    this.sankeyDiagramData = {
      chartType: 'Sankey',
      dataTable: [
        ['From', 'To', 'Weight'],
        [ 'Brazil', 'Portugal', 5 ],
        [ 'Brazil', 'France', 1 ],
        [ 'Brazil', 'Spain', 1 ],
        [ 'Brazil', 'England', 1 ],
        [ 'Canada', 'Portugal', 1 ],
        [ 'Canada', 'France', 5 ],
        [ 'Canada', 'England', 1 ],
        [ 'Mexico', 'Portugal', 1 ]
      ],
      options: {'title': 'Tasks'}
    };
  }

}
