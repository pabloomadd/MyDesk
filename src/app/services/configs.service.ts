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

  getConfig(): AppConfig {
    return this.config
  }

  getConfigValue<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.config[key];
  }

  updateConfig(updatedConfig: AppConfig) {
    this.config = updatedConfig
  }

  updateConfigValue<T extends keyof AppConfig>(key: T, value: AppConfig[T]) {
    this.config[key] = value;
  }


}
