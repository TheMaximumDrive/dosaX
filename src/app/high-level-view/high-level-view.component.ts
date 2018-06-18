import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Selection} from '../../utilities/selection';
import {SelectionService} from '../services/selection.service';

@Component({
  selector: 'app-high-level-view',
  templateUrl: './high-level-view.component.html',
  styleUrls: ['./high-level-view.component.scss']
})
export class HighLevelViewComponent implements OnInit, OnChanges {

  @Input() selectionList: Array<Selection>;
  @Input() selectedSelection;

  public flightsSankey;
  private outgoingFlightMapData;
  private outgoingFlightMapColors;

  chartOption = {
    title : {
      text: '测试数据',
      subtext: 'From d3.js',
      x:'right',
      y:'bottom'
    },
    tooltip : {
      trigger: 'item',
      formatter: function (params) {
        if (params.indicator2) { // is edge
          return params.value.weight;
        } else {// is node
          return params.name;
        }
      }
    },
    toolbox: {
      show : true,
      feature : {
        restore : {show: true},
        magicType: {show: true, type: ['force', 'chord']},
        saveAsImage : {show: true}
      }
    },
    legend: {
      x: 'left',
      data: ['group1', 'group2', 'group3', 'group4']
    },
    series : [
      {
        type: 'chord',
        sort : 'ascending',
        sortSub : 'descending',
        showScale : true,
        showScaleText : true,
        data : [
          {name : 'group1'},
          {name : 'group2'},
          {name : 'group3'},
          {name : 'group4'}
        ],
        itemStyle : {
          normal : {
            label : {
              show : false
            }
          }
        },
        matrix : [
          [11975,  5871, 8916, 2868],
          [ 1951, 10048, 2060, 6171],
          [ 8010, 16145, 8090, 8045],
          [ 1013,   990,  940, 6907]
        ]
      }
    ]
  };


  constructor(private selectionService: SelectionService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectionList']) {
      const val = changes['selectionList'].currentValue;
      if (val.length > 0) {
        this.updateHighLevelMap();
      }
    }
  }

  private updateHighLevelMap() {
    this.outgoingFlightMapData = this.selectionService.getOutgoingFlightMapData();
    this.outgoingFlightMapColors = this.selectionService.getOutgoingFlightMapColors();
    const incomingFlightMapData = this.selectionService.getIncomingFlightMapData();
    const incomingFlightMapColors = this.selectionService.getIncomingFlightMapColors();

    console.log(this.outgoingFlightMapData);
    // console.log(this.selectionList);

    const selectionNames = Array.from(this.selectionList, selection => selection.getName());
    selectionNames.push('Others');
    const chordMatrix = [];

    this.outgoingFlightMapData.forEach((selection) => {
      const a = Array(this.selectionList.length + 1).fill(0);
      selection.forEach((outgoingFlights, index) => {
        const idx = selectionNames.indexOf(outgoingFlights[1]);
        a[idx] = outgoingFlights[2];
      });
      const idx_self = selectionNames.indexOf(selection[0][0]);
      a[idx_self] = this.selectionList[idx_self].getNumOfCyclingFlights();
      chordMatrix.push(a);
    });

    console.log(chordMatrix);

  }

}
