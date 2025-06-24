import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private valueSource = new BehaviorSubject<string>(''); // Standardwert
  currentValue = this.valueSource.asObservable(); // Observable, auf das Komponenten zugreifen können

  updateValue(value: string) {
    this.valueSource.next(value); // Neuen Wert setzen
  }
}
