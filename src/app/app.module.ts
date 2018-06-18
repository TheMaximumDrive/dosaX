import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';


import { AppComponent } from './app.component';
import { JsonService } from './services/json.service';
import {HttpClientModule} from '@angular/common/http';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { HighLevelViewComponent } from './high-level-view/high-level-view.component';
import {AppConstants} from '../utilities/app_constants';
import {SelectionService} from './services/selection.service';
import {Selection} from '../utilities/selection';
import { SelectionComponent } from './selection/selection.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import { RenameSelectionDialogComponent } from './rename-selection-dialog/rename-selection-dialog.component';
import {MatButtonModule, MatCheckboxModule, MatDialogModule, MatInputModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NouisliderModule} from 'ng2-nouislider';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {NgxEchartsModule} from 'ngx-echarts';
import {EchartsNg2Module} from 'echarts-ng2';

export function init_app(provider: JsonService) {
  return () => Promise.all([
    provider.loadAirportsGeoJSON(),
    provider.loadFlightsGeoJSON()
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    DetailViewComponent,
    HighLevelViewComponent,
    SelectionComponent,
    RenameSelectionDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    Ng2GoogleChartsModule,
    NouisliderModule,
    AngularFontAwesomeModule,
    NgxEchartsModule,
    EchartsNg2Module
  ],
  providers: [
    JsonService,
    SelectionService,
    AppConstants,
    Selection,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [JsonService] , multi: true }],
  entryComponents: [
    RenameSelectionDialogComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
