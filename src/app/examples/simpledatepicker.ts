import { Component, OnInit, AfterViewInit  } from '@angular/core';

@Component({
  template: `
            <avail-date-picker [(ngModel)]="date" [settings]="settings"></avail-date-picker>
  `
})
export class SimpleDatePickerExample implements OnInit {
  date: Date = new Date();
  settings = {
        bigBanner: false,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: true
    }
  constructor(){
    
  }    
   ngOnInit(){

   }
}
