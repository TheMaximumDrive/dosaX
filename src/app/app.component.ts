import { Component } from '@angular/core';
import {selection} from 'd3-selection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  selectionRequest = false;
  selectionEnabled = false;

  forwardSelectionRequest() {
    this.selectionRequest = true;
    if (this.selectionEnabled === false) {
      this.selectionEnabled = true;
    }
  }

  finishSelectionRequest() {
    this.selectionRequest = false;
    // this.selectionEnabled = false;
  }
}
