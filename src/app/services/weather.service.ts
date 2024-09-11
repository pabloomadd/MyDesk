import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWeather } from '../../models/weather.model';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private _http = inject(HttpClient)
  baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  apiKey = environment.weatherKey;


  // Usar Postman para crear interface del json obtenido
  getWeatherByCity(city:string, country: string): Observable<IWeather>{
    return this._http.get<IWeather>(`${this.baseUrl}?q=${city},${country}&appid=${this.apiKey}`)
  }
}
