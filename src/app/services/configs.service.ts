import { Injectable } from '@angular/core';
import { AppConfig } from '../../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  private config: AppConfig = {
    wReloj: true,
    wClima: true,
    ciudad: 'Cartagena',
    pais: 'Colombia'

  }

  getConfig(): AppConfig{
    return this.config
  }

  getConfigValue(key: keyof AppConfig):any{
    return this.config[key];
  }


}
