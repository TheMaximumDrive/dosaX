import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';


import { AppComponent } from './app.component';
import { JsonService } from './services/json.service';
import {HttpClientModule} from '@angular/common/http';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { HighLevelViewComponent } from './high-level-view/high-level-view.component';
import {AppConstants} from '../utilities/app_constants';

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
    HighLevelViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LeafletModule.forRoot(),
  ],
  providers: [
    JsonService,
    AppConstants,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [JsonService] , multi: true }],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
