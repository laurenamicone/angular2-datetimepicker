import { OnInit, EventEmitter } from '@angular/core';
import { DateRange } from './model';
import { ControlValueAccessor } from '@angular/forms';
import { Settings } from './interface';
export declare const DATEPICKER_CONTROL_VALUE_ACCESSOR: any;
export declare class DatePicker implements OnInit, ControlValueAccessor {
    settings: Settings;
    onDateSelect: EventEmitter<Date>;
    selectedDate: String;
    date: Date;
    dateRange: DateRange;
    popover: Boolean;
    cal_days_in_month: Array<any>;
    timeViewDate: Date;
    hourValue: number;
    toHourValue: number;
    minValue: number;
    toMinValue: number;
    timeViewMeridian: string;
    toTimeViewMeridian: string;
    timeView: boolean;
    yearView: Boolean;
    yearsList: Array<any>;
    monthDays: Array<any>;
    toMonthDays: Array<any>;
    monthsView: boolean;
    today: Date;
    leftDate: Date;
    rightDate: Date;
    defaultSettings: Settings;
    constructor();
    ngOnInit(): void;
    private onTouchedCallback;
    private onChangeCallback;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    initDate(val: string): void;
    initDateRange(val: DateRange): void;
    generateDays(date: Date): {
        day: number;
        date: Date;
    }[][];
    generateYearList(param: string): void;
    getMonthLength(month: number, year: number): any;
    toggleMonthView(): void;
    toggleMeridian(val: string): void;
    setTimeView(): void;
    /***
     * (ssd > endDay -> startDay = endDay -> step = 1 ) && (sed > startDay -> 2)
     * (ssd < endDay -> startDay = ssd - step =1) && (sed < startDay -> 2 )
     *
     */
    rangeSelected: number;
    setDay(evt: any, type: string): void;
    setStartDate(selectedDate: Date): void;
    setEndDate(selectedDate: Date): void;
    highlightRange(date: Date): boolean;
    setYear(evt: any): void;
    setMonth(evt: any): void;
    prevMonth(e: any): void;
    nextMonth(e: any): void;
    onChange(evt: any): void;
    incHour(): void;
    decHour(): void;
    incMinutes(): void;
    decMinutes(): void;
    done(): void;
    togglePopover(): void;
    closepopover(): void;
    composeDate(date: Date): string;
    getCurrentWeek(): void;
}
