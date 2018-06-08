import { Component } from '@angular/core';
import {selection} from 'd3-selection';
import {Selection} from '../utilities/selection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  selectionRequest = false;
  selectionEnabled = false;
  selectionList: Array<Selection>;

  forwardSelectionRequest() {
    this.selectionRequest = true;
    if (this.selectionEnabled === false) {
      this.selectionEnabled = true;
    }
  }

  finishSelectionRequest($event) {
    console.log($event.bounds);
    console.log($event.color);
    // const sel = new Selection('Unbenannt', $event.bounds, $event.color);
    // this.selectionList.push(sel);
  }
}
