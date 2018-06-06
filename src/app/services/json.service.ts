import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class JsonService {

  private airportsGeoJSON;
  private flightsGeoJSON;

  constructor(private http: HttpClient) { }

  public getAirportsGeoJSON(): any {
    return this.airportsGeoJSON;
  }

  public getFlightsGeoJSON(): any {
    return this.flightsGeoJSON;
  }

  public loadAirportsGeoJSON(): Promise<any> {
    return new Promise(resolve => {
      this.http
        .get('assets/airports.geojson')
        .subscribe(response => {
          this.airportsGeoJSON = response;
          resolve(true);
        });
    });
  }

  public loadFlightsGeoJSON(): Promise<any> {
    return new Promise(resolve => {
      this.http
        .get('assets/flights.geojson')
        .subscribe(response => {
          this.flightsGeoJSON = response;
          resolve(true);
        });
    });
  }

}
