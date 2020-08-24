import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface IResponseTrackCorona {
  code: number;
  data: {
    confirmed: number;
    country_code: string;
    dead: number;
    latitude: number;
    location: string;
    longitude: number;
    recovered: number;
    updated: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class TrackCoronavirusService {
  private readonly PROVINCES_URL = `${environment.baseUrl}api/provinces`;
  private readonly COUNTRY_URL = `${environment.baseUrl}api/countries/us`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  public getProvinces(): Observable<IResponseTrackCorona> {
    return this.http.get<IResponseTrackCorona>(this.PROVINCES_URL, this.httpOptions);
  }

  public getCountryUS(): Observable<IResponseTrackCorona> {
    return this.http.get<IResponseTrackCorona>(this.COUNTRY_URL, this.httpOptions);
  }
}
