import { Component, OnInit, AfterViewInit  } from '@angular/core';

@Component({
  template: `
            <avail-date-picker [(ngModel)]="date" [settings]="settings"></avail-date-picker>
  `
})
export class DateTimePickerExample implements OnInit {
  date: Date = new Date();
  settings = {
        bigBanner: true,
        timePicker: true,
        format: 'dd-MM-yyyy hh:mm',
        defaultOpen: true,
        closeOnSelect: false
    }
  constructor(){
    
  }
   ngOnInit(){

   }
}
