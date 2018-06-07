import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {AppConstants} from '../../utilities/app_constants';
import {JsonService} from '../services/json.service';

@Component({
  selector: 'app-high-level-view',
  templateUrl: './high-level-view.component.html',
  styleUrls: ['./high-level-view.component.scss']
})
export class HighLevelViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
