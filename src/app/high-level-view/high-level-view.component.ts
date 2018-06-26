import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Selection} from '../../utilities/selection';
import {SelectionService} from '../services/selection.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-high-level-view',
  templateUrl: './high-level-view.component.html',
  styleUrls: ['./high-level-view.component.scss']
})
export class HighLevelViewComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() selectionList: Array<Selection>;
  @Input() selectedSelection;

  private outgoingFlightMapData;
  private outgoingFlightMapColors;

  private svg;
  private selectionNames;
  private selectionColors;

  constructor(private selectionService: SelectionService,
              private el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.svg = d3.select('#chordChart');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectionList']) {
      const val = changes['selectionList'].currentValue;
      if (val.length > 0) {
        this.updateHighLevelMap();
      }
    }
  }

  public updateHighLevelMap() {
    if (this.selectionList.length > 0) {
      this.svg
        .attr('width', this.el.nativeElement.offsetWidth * 0.9)
        .attr('height', this.el.nativeElement.offsetHeight * 0.9);

      this.svg.selectAll('*').remove();

      this.outgoingFlightMapData = this.selectionService.getOutgoingFlightMapData();
      this.outgoingFlightMapColors = this.selectionService.getOutgoingFlightMapColors();
      const incomingFlightMapData = this.selectionService.getIncomingFlightMapData();
      const incomingFlightMapColors = this.selectionService.getIncomingFlightMapColors();

      this.selectionNames = Array.from(this.selectionList, selection => selection.getName());
      this.selectionNames.push('Others');
      this.selectionColors = Array.from(this.selectionList, selection => selection.getColor());
      this.selectionColors.push('#80d1ff');
      const opacityDefault = 0.8;
      const chordMatrix = [];

      const otherFlightsChordArray = Array(this.selectionList.length + 1).fill(0);
      let numOfOtherCyclingFlights = this.selectionService.getNumOfTotalFlights();

      this.outgoingFlightMapData.forEach((selection, index) => {
        const a = Array(this.selectionList.length + 1).fill(0);
        selection.forEach((outgoingFlights) => {
          const idx = this.selectionNames.indexOf(outgoingFlights[1]);
          a[idx] = outgoingFlights[2];
          numOfOtherCyclingFlights = numOfOtherCyclingFlights - outgoingFlights[2];
        });
        const idx_self = this.selectionNames.indexOf(selection[0][0]);
        if (idx_self >= 0) {
          a[idx_self] = this.selectionList[idx_self].getNumOfCyclingFlights();
        }
        numOfOtherCyclingFlights = numOfOtherCyclingFlights - a[idx_self];

        otherFlightsChordArray[index] = selection[0][2];
        numOfOtherCyclingFlights = numOfOtherCyclingFlights - selection[0][2];

        chordMatrix.push(a);
      });

      otherFlightsChordArray[otherFlightsChordArray.length - 1] = 0; // numOfOtherCyclingFlights
      chordMatrix.push(otherFlightsChordArray);

      const width = +this.svg.attr('width'),
        height = +this.svg.attr('height'),
        innerRadius = Math.min(width, height) * 0.3,
        outerRadius = innerRadius * 1.1;

      const chordGenerator = d3.chord()
        .padAngle(.15)
        .sortChords(d3.descending);

      const chord = chordGenerator(chordMatrix);

      const arc = d3.arc()
        .innerRadius(innerRadius * 1.01)
        .outerRadius(outerRadius);

      const ribbon = d3.ribbon()
        .radius(innerRadius);

      const color = d3.scaleOrdinal<string, string>()
        .domain(this.selectionNames)
        .range(this.selectionColors);

      // Create SVG
      const wrapper = this.svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      ////////////////////////////////////////////////////////////
/////////////// Create the gradient fills //////////////////
////////////////////////////////////////////////////////////

      // Create the gradients definitions for each chord
      const grads = this.svg.append('defs').selectAll('linearGradient')
        .data(chord)
        .enter().append('linearGradient')
          .attr('id', this.getGradID)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', function(d, i) {
            return innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2);
          })
          .attr('y1', function(d, i) {
            return innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2);
          })
          .attr('x2', function(d, i) {
            return innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2);
          })
          .attr('y2', function(d, i) {
            return innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2);
          });

      // Set the starting color (at 0%)
      grads.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', function(d) { return color(d.source.index); });

      // Set the ending color (at 100%)
      grads.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', function(d) { return color(d.target.index); });

      const outerArcs = wrapper.append('g')
        .attr('class', 'groups')
        .selectAll('g')
        .data(chord.groups)
        .enter().append('g');

      outerArcs.append('path')
        .style('fill', (d) => color(d.index))
        .style('stroke', (d) => d3.rgb(color(d.index)).darker())
        .on('mouseover', this.fade(.1))
        .on('mouseout', this.fade(opacityDefault))
        .attr('d', arc);

      // Append title
      outerArcs.append('title').text((d) => this.groupTip(d));

      // Append labels
      outerArcs.append('text')
        .each((d) => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr('dy', '.35em')
        .attr('class', 'titles')
        .attr('font-size', '11px')
        .attr('fill', '#fff')
        .attr('text-anchor', (d) => (d.angle > Math.PI ? 'end' : null))
        .attr('transform', (d) => {
          return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')'
            + 'translate(' + (outerRadius + 10) + ')'
            + (d.angle > Math.PI ? 'rotate(180)' : '');
        })
        .text((d, i) => this.selectionNames[i]);

      const ribbons = wrapper.append('g')
        .attr('class', 'ribbons')
        .selectAll('path')
        .data(chord)
        .enter().append('path')
          .attr('class', function(d) {
            return 'ribbon ribbon-' + d.source.index + ' chord-' + d.target.index;
          })
          .style('fill', (d) => ('url(#' + this.getGradID(d) + ')'))
          .attr('d', ribbon);

      ribbons.append('title').text((d) => this.chordTip(d));
    }
  }

  // Function to create the unique id for each chord gradient
  private getGradID(d) {
    return 'linkGrad-' + d.source.index + '-' + d.target.index;
  }

  private fade(opacity) {
    return (d, i) => {
      this.svg.selectAll('path.ribbon')
        .filter((j) => (j.source.index !== i && j.target.index !== i))
        .transition()
        .style('opacity', opacity);
    };
  }

  private chordTip(d) {
    const q = d3.formatPrefix(',.2r', 1e3);
    return 'Flow Info:\n'
      + this.selectionNames[d.source.index] + ' → ' + this.selectionNames[d.target.index] + ': ' + d.target.value
      + ((d.source.index === d.target.index) ? '' : ('\n' + this.selectionNames[d.target.index] + ' → '
        + this.selectionNames[d.source.index] + ': ' + d.source.value));
  }

  private groupTip(d) {
    const q = d3.formatPrefix(',.2r', 1e3);
    return 'Total number flights related to ' + this.selectionNames[d.index] + ':\n' + d.value;
  }

}
