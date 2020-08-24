import {
  Component,
  ViewChild,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { TrackCoronavirusService } from './services/track-coronavirus.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface IMarkerCase {
  state: string;
  confirmedCases: number;
  recoveredCases: number;
  deadCases: number;
  markerPosition: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions;
}

export interface IStatesAutocomplete {
  name: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'covid19-map';

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) googleMap: GoogleMap;
  @ViewChildren(MapMarker) mapMarker: QueryList<MapMarker>;

  centerUs = { lat: 40.1547462, lng: -99.82025 };
  center = this.centerUs;
  zoomInit = 5;
  zoom = this.zoomInit;
  optionsMap: google.maps.MapOptions = {
    mapTypeControl: false,
    styles: [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#212121',
          },
        ],
      },
      {
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#212121',
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#bdbdbd',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#181818',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1b1b1b',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2c2c2c',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8a8a8a',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#373737',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#3c3c3c',
          },
        ],
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#4e4e4e',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#3d3d3d',
          },
        ],
      },
    ],
  };
  markerCases: IMarkerCase[];
  display?: google.maps.LatLngLiteral;
  templateInfoWindow: IMarkerCase;
  confirmedCases: number[];
  covidCasesUS: {
    confirmed: number;
    country_code: string;
    dead: number;
    latitude: number;
    location: string;
    longitude: number;
    recovered: number;
    updated: string;
  }[];

  totalConfirmedCases = 0;
  totalActives = 0;
  totalDeads = 0;
  totalRecovered = 0;
  sideTotalConfirmedCases = 0;
  sideTotalActives = 0;
  sideTotalRecovered = 0;
  sideTotalDeads = 0;
  filterForm: FormGroup;
  statesOptions: IStatesAutocomplete[];
  filterStateOptions: Observable<IStatesAutocomplete[]>;
  activeCloseButton: boolean;
  covidCasesByLocation: {
    state: string;
    confirmedCases: number;
    recoveredCases: number;
    deadCases: number;
    markerPosition: { lat: number; lng: number };
    markerOptions: google.maps.MarkerOptions;
  }[];
  ctaLayer: google.maps.KmlLayer;
  stateSelected = '';

  listCodeAndNameStates = [
    { codeState: 'DC', nameState: 'District of Columbia' },
    {
      codeState: 'AS',
      nameState: 'American Samoa',
    },
    {
      codeState: 'GU',
      nameState: 'Guam',
    },
    {
      codeState: 'MP',
      nameState: 'Northern Mariana Islands',
    },
    {
      codeState: 'PR',
      nameState: 'Puerto Rico',
    },
    {
      codeState: 'UM',
      nameState: 'United States Minor Outlying Islands',
    },
    {
      codeState: 'VI',
      nameState: 'Virgin Islands',
    },
    { codeState: 'AL', nameState: 'Alabama' },
    { codeState: 'AK', nameState: 'Alaska' },
    { codeState: 'AZ', nameState: 'Arizona' },
    { codeState: 'AR', nameState: 'Arkansas' },
    { codeState: 'CA', nameState: 'California' },
    { codeState: 'CO', nameState: 'Colorado' },
    { codeState: 'CT', nameState: 'Connecticut' },
    { codeState: 'DE', nameState: 'Delaware' },
    { codeState: 'FL', nameState: 'Florida' },
    { codeState: 'GA', nameState: 'Georgia' },
    { codeState: 'HI', nameState: 'Hawaii' },
    { codeState: 'ID', nameState: 'Idaho' },
    { codeState: 'IL', nameState: 'Illinois' },
    { codeState: 'IN', nameState: 'Indiana' },
    { codeState: 'IA', nameState: 'Iowa' },
    { codeState: 'KS', nameState: 'Kansas' },
    { codeState: 'KY', nameState: 'Kentucky' },
    { codeState: 'LA', nameState: 'Louisiana' },
    { codeState: 'ME', nameState: 'Maine' },
    { codeState: 'MD', nameState: 'Maryland' },
    { codeState: 'MA', nameState: 'Massachusetts' },
    { codeState: 'MI', nameState: 'Michigan' },
    { codeState: 'MN', nameState: 'Minnesota' },
    { codeState: 'MS', nameState: 'Mississippi' },
    { codeState: 'MO', nameState: 'Missouri' },
    { codeState: 'MT', nameState: 'Montana' },
    { codeState: 'NE', nameState: 'Nebraska' },
    { codeState: 'NV', nameState: 'Nevada' },
    { codeState: 'NH', nameState: 'New Hampshire' },
    { codeState: 'NJ', nameState: 'New Jersey' },
    { codeState: 'NM', nameState: 'New Mexico' },
    { codeState: 'NY', nameState: 'New York' },
    { codeState: 'NC', nameState: 'North Carolina' },
    { codeState: 'ND', nameState: 'North Dakota' },
    { codeState: 'OH', nameState: 'Ohio' },
    { codeState: 'OK', nameState: 'Oklahoma' },
    { codeState: 'OR', nameState: 'Oregon' },
    { codeState: 'PA', nameState: 'Pennsylvania' },
    { codeState: 'RI', nameState: 'Rhode Island' },
    { codeState: 'SC', nameState: 'South Carolina' },
    { codeState: 'SD', nameState: 'South Dakota' },
    { codeState: 'TN', nameState: 'Tennessee' },
    { codeState: 'TX', nameState: 'Texas' },
    { codeState: 'UT', nameState: 'Utah' },
    { codeState: 'VT', nameState: 'Vermont' },
    { codeState: 'VA', nameState: 'Virginia' },
    { codeState: 'WA', nameState: 'Washington' },
    { codeState: 'WV', nameState: 'West Virginia' },
    { codeState: 'WI', nameState: 'Wisconsin' },
    { codeState: 'WY', nameState: 'Wyoming' },
  ];

  get inputAutoComplete(): AbstractControl {
    return this.filterForm.get('autoComplete');
  }

  constructor(
    private trackCorona: TrackCoronavirusService,
    private fb: FormBuilder
  ) {
    this.getData();
    this.filterForm = this.fb.group({
      autoComplete: [null],
    });
  }

  ngOnInit(): void {}

  getData(): void {
    this.trackCorona.getProvinces().subscribe({
      next: (res) => {
        this.covidCasesUS = res.data.filter(
          (item) => item.country_code === 'us'
        );
        this.confirmedCases = this.covidCasesUS.map((e) => e.confirmed);

        this.statesOptions = this.covidCasesUS.map((e) => {
          return { name: e.location, value: e.location };
        });

        this.filterStateOptions = this.inputAutoComplete.valueChanges.pipe(
          startWith(''),
          map((value) =>
            typeof value === 'string' || value === null ? value : value.name
          ),
          map((name) =>
            name ? this._filterStates(name) : this.statesOptions.slice()
          )
        );

        this.covidCasesByLocation = this.covidCasesUS.map((item) => {
          const scaleC =
            (item.confirmed * 125) / Math.max(...this.confirmedCases);
          let scaleCo = scaleC < 10 ? 10 : scaleC;
          scaleCo = scaleCo > 40 ? 40 : scaleCo;
          return {
            state: item.location,
            confirmedCases: item.confirmed ? item.confirmed : 0,
            recoveredCases: item.recovered ? item.recovered : 0,
            deadCases: item.dead ? item.dead : 0,
            markerPosition: { lat: item.latitude, lng: item.longitude },
            markerOptions: {
              draggable: false,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: scaleCo,
                fillColor: '#F00',
                fillOpacity: 0.7,
                strokeWeight: 0.6,
              },
              animation: google.maps.Animation.DROP,
            },
          };
        });

        this.markerCases = this.covidCasesByLocation;
      },
    });

    this.trackCorona.getCountryUS().subscribe({
      next: (res) => {
        this.totalConfirmedCases = res.data[0].confirmed;
        this.totalActives = res.data[0].confirmed - res.data[0].recovered;
        this.totalRecovered = res.data[0].recovered;
        this.totalDeads = res.data[0].dead;

        this.resetCasesSidebar();
      },
    });
  }

  resetCasesSidebar(): void {
    this.sideTotalConfirmedCases = this.totalConfirmedCases;
    this.sideTotalActives = this.totalActives;
    this.sideTotalRecovered = this.totalRecovered;
    this.sideTotalDeads = this.totalDeads;
  }

  openInfoWindow(marker: MapMarker, info: IMarkerCase): void {
    this.templateInfoWindow = info;
    this.infoWindow.open(marker);
  }

  closeInfoWindow(): void {
    this.infoWindow.close();
  }

  displayFn(state?: IStatesAutocomplete): string | undefined {
    return state ? state.name : undefined;
  }

  optionSelected(): void {
    const valueFilter = this.inputAutoComplete.value?.name || null;

    this.activeCloseButton = true;

    const state = this.covidCasesByLocation.filter((e) => {
      return e.state === valueFilter;
    });

    const position = this.covidCasesByLocation.indexOf(state[0]);

    const latlong = state.map((e) => {
      return { lat: e.markerPosition.lat, lng: e.markerPosition.lng };
    })[0];

    this.stateSelected = state[0].state;
    this.sideTotalConfirmedCases = state[0].confirmedCases;
    this.sideTotalActives = state[0].confirmedCases - state[0].recoveredCases;
    this.sideTotalRecovered = state[0].recoveredCases;
    this.sideTotalDeads = state[0].deadCases;

    this.center = latlong;
    this.zoom = 7;

    const codeState = this.listCodeAndNameStates.filter(
      (e) => e.nameState === this.stateSelected
    )[0].codeState;

    if (this.ctaLayer) {
      this.ctaLayer.setMap(null);
    }

    this.ctaLayer = new google.maps.KmlLayer({
      url: `https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/kml/${codeState}.kml`,
      map: this.googleMap.googleMap,
    });

    this.openInfoWindow(this.mapMarker.toArray()[position], state[0]);
  }

  cleanFilterStates(): void {
    this.center = this.centerUs;
    this.zoom = this.zoomInit;
    this.activeCloseButton = false;
    this.stateSelected = '';
    this.inputAutoComplete.reset();
    this.resetCasesSidebar();
    this.closeInfoWindow();
    this.ctaLayer.setMap(null);
  }

  private _filterStates(value: string): IStatesAutocomplete[] {
    const filterValue = value.toLowerCase();

    return this.statesOptions.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
