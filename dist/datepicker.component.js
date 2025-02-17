import { Component, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { DateRange } from './model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export var DATEPICKER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return DatePicker; }),
    multi: true
};
var DatePicker = /** @class */ (function () {
    function DatePicker() {
        this.onDateSelect = new EventEmitter();
        this.dateRange = new DateRange();
        this.popover = false;
        this.cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.timeViewDate = new Date(this.date);
        this.hourValue = 0;
        this.toHourValue = 0;
        this.minValue = 0;
        this.toMinValue = 0;
        this.timeViewMeridian = "";
        this.toTimeViewMeridian = "";
        this.timeView = false;
        this.yearView = false;
        this.yearsList = [];
        this.monthDays = [];
        this.toMonthDays = [];
        this.monthsView = false;
        this.today = new Date();
        this.leftDate = new Date();
        this.rightDate = new Date();
        this.defaultSettings = {
            defaultOpen: false,
            bigBanner: true,
            timePicker: false,
            format: 'dd-MMM-yyyy hh:mm a',
            cal_days_labels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            cal_full_days_lables: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            cal_months_labels: ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'],
            cal_months_labels_short: ['JAN', 'FEB', 'MAR', 'APR',
                'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
                'OCT', 'NOV', 'DEC'],
            closeOnSelect: true,
            rangepicker: false
        };
        /***
         * (ssd > endDay -> startDay = endDay -> step = 1 ) && (sed > startDay -> 2)
         * (ssd < endDay -> startDay = ssd - step =1) && (sed < startDay -> 2 )
         *
         */
        this.rangeSelected = 0;
    }
    DatePicker.prototype.ngOnInit = function () {
        var _this = this;
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.defaultOpen) {
            this.popover = true;
        }
        window.addEventListener('input', function (e) {
            var currentHourValue = Number(_this.hourValue);
            var currentMinValue = Number(_this.minValue);
            if (currentHourValue > 12) {
                _this.hourValue = 11;
            }
            if (currentMinValue > 59) {
                _this.minValue = 59;
            }
        });
    };
    DatePicker.prototype.writeValue = function (value) {
        if (value !== undefined && value !== null) {
            if (!this.settings.rangepicker) {
                this.initDate(value);
                this.monthDays = this.generateDays(this.date);
            }
            else {
                this.initDateRange(value);
                if (this.dateRange.startDate.getMonth() === this.dateRange.endDate.getMonth() && this.dateRange.startDate.getFullYear() === this.dateRange.endDate.getFullYear()) {
                    this.leftDate = new Date(this.dateRange.startDate);
                    var tempDate = new Date(this.dateRange.startDate);
                    tempDate.setMonth(tempDate.getMonth() + 1);
                    tempDate.setDate(1);
                    this.rightDate = new Date(tempDate);
                    this.monthDays = this.generateDays(this.leftDate);
                    this.toMonthDays = this.generateDays(this.rightDate);
                }
                else {
                    this.leftDate = new Date(this.dateRange.startDate);
                    this.rightDate = new Date(this.dateRange.endDate);
                    this.monthDays = this.generateDays(this.leftDate);
                    this.toMonthDays = this.generateDays(this.rightDate);
                }
                console.log(this.monthDays);
            }
        }
        else {
            this.date = new Date();
        }
    };
    DatePicker.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DatePicker.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    DatePicker.prototype.initDate = function (val) {
        this.date = new Date(val);
        if (this.date.getHours() <= 11) {
            this.hourValue = this.date.getHours();
            this.timeViewMeridian = "AM";
        }
        else {
            this.hourValue = this.date.getHours() - 12;
            this.timeViewMeridian = "PM";
        }
        if (this.date.getHours() == 0 || this.date.getHours() == 12) {
            this.hourValue = 12;
        }
        this.minValue = this.date.getMinutes();
    };
    DatePicker.prototype.initDateRange = function (val) {
        this.dateRange.startDate = new Date(val.startDate);
        this.dateRange.endDate = new Date(val.endDate);
        if (this.dateRange.startDate.getHours() <= 11) {
            this.hourValue = this.dateRange.startDate.getHours();
            this.timeViewMeridian = "AM";
        }
        else {
            this.hourValue = this.dateRange.startDate.getHours() - 12;
            this.timeViewMeridian = "PM";
        }
        if (this.dateRange.startDate.getHours() == 0 || this.dateRange.startDate.getHours() == 12) {
            this.hourValue = 12;
        }
        this.minValue = this.dateRange.startDate.getMinutes();
        if (this.dateRange.endDate.getHours() <= 11) {
            this.toHourValue = this.dateRange.endDate.getHours();
            this.toTimeViewMeridian = "AM";
        }
        else {
            this.toHourValue = this.dateRange.endDate.getHours() - 12;
            this.toTimeViewMeridian = "PM";
        }
        if (this.dateRange.endDate.getHours() == 0 || this.dateRange.endDate.getHours() == 12) {
            this.toHourValue = 12;
        }
        this.toMinValue = this.dateRange.endDate.getMinutes();
    };
    DatePicker.prototype.generateDays = function (date) {
        var year = date.getFullYear(), month = date.getMonth(), current_day = date.getDate(), today = new Date();
        var firstDay = new Date(year, month, 1);
        var startingDay = firstDay.getDay();
        var monthLength = this.getMonthLength(month, year);
        var day = 1;
        var dateArr = [];
        var dateRow = [];
        // this loop is for is weeks (rows)
        for (var i = 0; i < 9; i++) {
            // this loop is for weekdays (cells)
            dateRow = [];
            for (var j = 0; j <= 6; j++) {
                var dateCell = null;
                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    dateCell = day;
                    if (day == current_day) {
                        // dateCell.classList.add('selected-day');
                    }
                    if (day == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
                        // dateCell.classList.add('today');
                    }
                    day++;
                }
                dateRow.push({ day: dateCell, date: new Date((month + 1) + '-' + dateCell + '-' + date.getFullYear()) });
            }
            // stop making rows if we've run out of days
            if (day > monthLength) {
                dateArr.push(dateRow);
                break;
            }
            else {
                dateArr.push(dateRow);
            }
        }
        return dateArr;
    };
    DatePicker.prototype.generateYearList = function (param) {
        var startYear = null;
        var currentYear = null;
        if (param == "next") {
            startYear = this.yearsList[8] + 1;
            currentYear = this.date.getFullYear();
        }
        else if (param == "prev") {
            startYear = this.yearsList[0] - 9;
            currentYear = this.date.getFullYear();
        }
        else {
            currentYear = this.date.getFullYear();
            startYear = currentYear - 4;
            this.yearView = !this.yearView;
            this.monthsView = false;
        }
        for (var k = 0; k < 9; k++) {
            this.yearsList[k] = startYear + k;
        }
    };
    DatePicker.prototype.getMonthLength = function (month, year) {
        var monthLength = this.cal_days_in_month[month];
        // compensate for leap year
        if (month == 1) { // February only!
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                monthLength = 29;
            }
        }
        return monthLength;
    };
    DatePicker.prototype.toggleMonthView = function () {
        this.yearView = false;
        this.monthsView = !this.monthsView;
    };
    DatePicker.prototype.toggleMeridian = function (val) {
        this.timeViewMeridian = val;
    };
    DatePicker.prototype.setTimeView = function () {
        if (this.timeViewMeridian == "AM") {
            if (this.hourValue == 12) {
                this.date.setHours(0);
            }
            else {
                this.date.setHours(this.hourValue);
            }
            this.date.setMinutes(this.minValue);
        }
        else {
            if (this.hourValue == 12) {
                this.date.setHours(this.hourValue);
            }
            else {
                this.date.setHours(Number(this.hourValue) + 12);
            }
            this.date.setMinutes(this.minValue);
        }
        this.date = new Date(this.date);
        this.timeView = !this.timeView;
    };
    DatePicker.prototype.setDay = function (evt, type) {
        if (evt.target.innerHTML) {
            var selectedDay = new Date(evt.target.getAttribute('data-label'));
            if (type == 'range') {
                if (this.rangeSelected == 0) {
                    this.setStartDate(selectedDay);
                }
                else if (this.rangeSelected == 1) {
                    this.setEndDate(selectedDay);
                }
            }
            else {
                this.date = new Date(selectedDay);
                this.onChangeCallback(this.date.toString());
            }
            if (this.settings.closeOnSelect) {
                this.popover = false;
                this.onDateSelect.emit(this.date);
            }
        }
    };
    DatePicker.prototype.setStartDate = function (selectedDate) {
        if (selectedDate < this.dateRange.endDate) {
            this.dateRange.startDate = new Date(selectedDate);
        }
        else if (selectedDate > this.dateRange.endDate) {
            this.dateRange.startDate = new Date(selectedDate);
            this.dateRange.endDate = new Date(selectedDate);
        }
        this.rangeSelected = 1;
    };
    DatePicker.prototype.setEndDate = function (selectedDate) {
        if (selectedDate > this.dateRange.startDate && (this.dateRange.startDate != this.dateRange.endDate)) {
            this.dateRange.endDate = new Date(selectedDate);
        }
        else if (selectedDate > this.dateRange.startDate && (this.dateRange.startDate == this.dateRange.endDate)) {
            this.dateRange.endDate = new Date(selectedDate);
        }
        else if (selectedDate < this.dateRange.startDate && (this.dateRange.startDate != this.dateRange.endDate)) {
            this.dateRange.startDate = new Date(selectedDate);
            this.dateRange.endDate = new Date(selectedDate);
        }
        else if (selectedDate < this.dateRange.startDate && (this.dateRange.startDate == this.dateRange.endDate)) {
            this.dateRange.startDate = new Date(selectedDate);
            this.dateRange.endDate = new Date(selectedDate);
        }
        else if (selectedDate.getTime() == this.dateRange.startDate.getTime()) {
            this.dateRange.startDate = new Date(selectedDate);
            this.dateRange.endDate = new Date(selectedDate);
        }
        this.rangeSelected = 0;
    };
    DatePicker.prototype.highlightRange = function (date) {
        return (date > this.dateRange.startDate && date < this.dateRange.endDate);
    };
    DatePicker.prototype.setYear = function (evt) {
        console.log(evt.target);
        var selectedYear = parseInt(evt.target.getAttribute('id'));
        this.date = new Date(this.date.setFullYear(selectedYear));
        this.yearView = !this.yearView;
        this.monthDays = this.generateDays(this.date);
    };
    DatePicker.prototype.setMonth = function (evt) {
        if (evt.target.getAttribute('id')) {
            var selectedMonth = this.settings.cal_months_labels_short.indexOf(evt.target.getAttribute('id'));
            this.date = new Date(this.date.setMonth(selectedMonth));
            this.monthsView = !this.monthsView;
            this.monthDays = this.generateDays(this.date);
        }
    };
    DatePicker.prototype.prevMonth = function (e) {
        e.stopPropagation();
        var self = this;
        if (this.date.getMonth() == 0) {
            this.date.setMonth(11);
            this.date.setFullYear(this.date.getFullYear() - 1);
        }
        else {
            var prevmonthLength = this.getMonthLength(this.date.getMonth() - 1, this.date.getFullYear());
            var currentDate = this.date.getDate();
            if (currentDate > prevmonthLength) {
                this.date.setDate(prevmonthLength);
            }
            this.date.setMonth(this.date.getMonth() - 1);
        }
        this.date = new Date(this.date);
        this.monthDays = this.generateDays(this.date);
    };
    DatePicker.prototype.nextMonth = function (e) {
        e.stopPropagation();
        var self = this;
        if (this.date.getMonth() == 11) {
            this.date.setMonth(0);
            this.date.setFullYear(this.date.getFullYear() + 1);
        }
        else {
            var nextmonthLength = this.getMonthLength(this.date.getMonth() + 1, this.date.getFullYear());
            var currentDate = this.date.getDate();
            if (currentDate > nextmonthLength) {
                this.date.setDate(nextmonthLength);
            }
            this.date.setMonth(this.date.getMonth() + 1);
        }
        this.date = new Date(this.date);
        this.monthDays = this.generateDays(this.date);
    };
    DatePicker.prototype.onChange = function (evt) {
        console.log(evt);
    };
    DatePicker.prototype.incHour = function () {
        if (this.hourValue < 12) {
            this.hourValue += 1;
            console.log(this.hourValue);
        }
    };
    DatePicker.prototype.decHour = function () {
        if (this.hourValue > 1) {
            this.hourValue -= 1;
            console.log(this.hourValue);
        }
    };
    DatePicker.prototype.incMinutes = function () {
        if (this.minValue < 59) {
            this.minValue += 1;
            console.log(this.minValue);
        }
    };
    DatePicker.prototype.decMinutes = function () {
        if (this.minValue > 0) {
            this.minValue -= 1;
            console.log(this.minValue);
        }
    };
    DatePicker.prototype.done = function () {
        this.onChangeCallback(this.date.toString());
        this.popover = false;
        this.onDateSelect.emit(this.date);
    };
    DatePicker.prototype.togglePopover = function () {
        // if (this.popover) {
        //     this.closepopover();
        // }
        // else {
        //     this.popover = true;
        // }
    };
    DatePicker.prototype.closepopover = function () {
        // this.rangeSelected = 0;
        // this.popover = false;
    };
    DatePicker.prototype.composeDate = function (date) {
        return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    };
    DatePicker.prototype.getCurrentWeek = function () {
        var curr_date = new Date();
        var day = curr_date.getDay();
        var diff = curr_date.getDate() - day + (day == 0 ? -6 : 1); // 0 for sunday
        var week_start_tstmp = curr_date.setDate(diff);
        var week_start = new Date(week_start_tstmp);
        var week_end = new Date(week_start_tstmp); // first day of week 
        week_end = new Date(week_end.setDate(week_end.getDate() + 6));
        var date = week_start + ' to ' + week_end; // date range for current week
        console.log(date);
        if (week_start.getMonth() === week_end.getMonth()) {
            this.monthDays = this.generateDays(week_start);
            var tempDate = new Date(week_end);
            tempDate.setMonth(tempDate.getMonth() + 1);
            tempDate.setDate(1);
            this.toMonthDays = this.generateDays(tempDate);
        }
        else {
            this.monthDays = this.generateDays(week_start);
            this.toMonthDays = this.generateDays(week_end);
        }
        this.setStartDate(week_start);
        this.setEndDate(week_end);
    };
    DatePicker.decorators = [
        { type: Component, args: [{
                    selector: 'avail-date-picker',
                    template: "\n      <div class=\"winkel-calendar\" (clickOutside)=\"closepopover()\">\n          <span *ngIf=\"!settings.rangepicker\">\n          <input type=\"hidden\" class=\"wc-input\" value=\"{{date}}\">\n          <div class=\"wc-date-container\" (click)=\"popover = !popover\">\n              <span>{{date | date: settings.format}}</span>\n          <i class=\"fa fa-calendar\"></i>\n      </div>\n      </span>\n      <div *ngIf=\"!settings.rangepicker\" class=\"wc-date-popover\" [ngClass]=\"{'banner-true': settings.bigBanner == true}\" [hidden]=\"!popover\">\n          <div class=\"wc-banner\" *ngIf=\"settings.bigBanner\">\n              <div class=\"wc-day-row\">{{date | date: 'EEEE'}}</div>\n              <div class=\"wc-date-row\">{{date | date: 'dd'}}</div>\n              <div class=\"wc-my-sec\">\n                  <div class=\"wc-month-row\">\n                      <div>{{date | date: 'MMMM'}}</div>\n                  </div>\n                  <div class=\"wc-year-row\">\n                      <div>{{date | date: 'yyyy'}}</div>\n                  </div>\n              </div>\n              <div class=\"wc-time-sec ng-scope\">\n                  <div *ngIf=\"settings.timePicker\" class=\"time\" (click)=\"timeView = !timeView\">\n                      {{date | date: 'hh'}} : {{date | date: 'mm'}} {{date | date: 'a'}} <span class=\"fa fa-clock-o\"></span>\n                  </div>\n              </div>\n\n          </div>\n          <div class=\"wc-details\">\n              <i class=\"wc-prev fa fa-angle-left\" (click)=\"prevMonth($event)\"></i>\n              <div class=\"month-year\" *ngIf=\"settings.bigBanner\" (click)=\"toggleMonthView()\">{{date | date: 'MMMM'}}\n                  <!-- <i ng-show=\"!monthsView\" class=\"fa fa-arrow-down\"></i>\n                                       <i ng-show=\"monthsView\" class=\"fa fa-arrow-up\"></i> -->\n              </div>\n              <div class=\"month-year\" *ngIf=\"!settings.bigBanner\" (click)=\"toggleMonthView()\">\n                  {{date | date: 'MMMM'}}\n                  <!--    <i ng-show=\"!monthsView\" class=\"fa fa-arrow-down\" (click)=\"toggleMonthView()\"></i>\n                                          <i ng-show=\"monthsView\" class=\"fa fa-arrow-up\" (click)=\"toggleMonthView()\"></i>  -->\n\n              </div>\n              <i class=\"wc-next fa fa-angle-right\" (click)=\"nextMonth($event)\"></i>\n          </div>\n          <div class=\"year-title\">\n              <div class=\"year-dropdown\" (click)=\"generateYearList('current')\">\n                  {{date | date: 'yyyy'}}\n                  <i *ngIf=\"!yearView\" class=\"fa fa-angle-down\"></i>\n                  <i *ngIf=\"yearView\" class=\"fa fa-angle-up\"></i>\n              </div>\n          </div>\n          <table class=\"calendar-header\" [hidden]=\"yearView == true || monthsView == true\">\n              <tr>\n                  <td class=\"calendar-header-day\">Su</td>\n                  <td class=\"calendar-header-day\">Mo</td>\n                  <td class=\"calendar-header-day\">Tu</td>\n                  <td class=\"calendar-header-day\">We</td>\n                  <td class=\"calendar-header-day\">Th</td>\n                  <td class=\"calendar-header-day\">Fr</td>\n                  <td class=\"calendar-header-day\">Sa</td>\n              </tr>\n          </table>\n          <div class=\"months-view\" [hidden]=\"!monthsView\" (click)=\"setMonth($event)\">\n              <span *ngFor=\"let month of settings.cal_months_labels_short\" [ngClass]=\"{'current-month': month == settings.cal_months_labels_short[date?.getMonth()]}\"\n                  id=\"{{month}}\">{{month}}</span>\n          </div>\n          <div class=\"years-view\" *ngIf=\"yearView\">\n              <div class=\"fa fa-angle-left prev\" (click)=\"generateYearList('prev')\"></div>\n              <div class=\"fa fa-angle-right next\" (click)=\"generateYearList('next')\"></div>\n              <div class=\"years-list-view\" (click)=\"setYear($event)\">\n                  <span *ngFor=\"let year of yearsList\" [ngClass]=\"{'current-year': year == date?.getFullYear()}\" id=\"{{year}}\">{{year}}</span>\n              </div>\n          </div>\n          <div class=\"time-view\" [hidden]=\"!timeView\">\n              <i class=\"fa fa-close time-close\" (click)=\"timeView = false\"></i>\n              <div class=\"time\">\n                  <div class=\"hour\">\n                      <span class=\"fa fa-plus inc-btn\" (click)=\"incHour()\"></span>\n                      <input type=\"string\" value=\"{{hourValue}}\" [(ngModel)]=\"hourValue\"  (keydown.arrowdown) = \"decHour()\" (keydown.arrowup) = \"incHour()\" autofocus/>\n                      <span class=\"fa fa-minus dec-btn\" (click)=\"decHour()\"></span>\n                  </div>\n                  <div class=\"time-divider\">:</div>\n                  <div class=\"minutes\">\n                      <span class=\"fa fa-plus inc-btn\" (click)=\"incMinutes()\"></span>\n                      <input type=\"string\" value=\"{{minValue}}\" [(ngModel)]=\"minValue\" (keydown.arrowdown) = \"decMinutes()\" (keydown.arrowup) = \"incMinutes()\"/>\n                      <span class=\"fa fa-minus dec-btn\" (click)=\"decMinutes()\"></span>\n                  </div>\n              </div>\n              <div class=\"meridian\">\n                  <div class=\"cuppa-btn-group\">\n                      <button [ngClass]=\"{'active': timeViewMeridian == 'AM'}\" class=\"button\" ng-model=\"timeViewMeridian\" (click)=\"toggleMeridian('AM')\">AM</button>\n                      <button [ngClass]=\"{'active': timeViewMeridian == 'PM'}\" class=\"button\" ng-model=\"timeViewMeridian\" (click)=\"toggleMeridian('PM')\">PM</button>\n                  </div>\n              </div>\n              <div class=\"time-view-btn\">\n                  <button class=\"button\" (click)=\"setTimeView()\">Set Time</button>\n              </div>\n          </div>\n          <table class=\"calendar-days\" (click)=\"setDay($event);\" [hidden]=\"monthsView || yearView\">\n              <tr *ngFor=\"let week of monthDays\">\n                  <td [ngClass]=\"{'calendar-day': day.day != null,'today': day == today.getDate() && date?.getMonth() == today.getMonth() && date?.getFullYear() == today.getFullYear(),'selected-day': day.day == date?.getDate()}\"\n                      *ngFor=\"let day of week\">\n                      <span [attr.data-label]=\"composeDate(day.date)\">{{day.day}}</span>\n                  </td>\n\n              </tr>\n          </table>\n          <div class=\"cal-util\">\n              <div class=\"clock-icon\" *ngIf=\"!settings.bigBanner\">\n                  <i class=\"fa fa-clock-o\" aria-hidden=\"true\" (click)=\"timeView = !timeView\"></i>\n              </div>\n              <div class=\"ok\" (click)=\"done()\"><i class=\"fa fa-check\"></i>Done\n              </div>\n          </div>\n      </div>\n      <span *ngIf=\"settings.rangepicker\">\n              <input type=\"hidden\" class=\"wc-input\" value=\"{{date}}\">\n      <div class=\"range-input\" (click)=\"togglePopover()\">\n              <div class=\"wc-date-container\" >\n                  <span>{{dateRange?.startDate | date: settings.format}}</span>\n      <i class=\"fa fa-arrow-circle-o-right range-direc\"></i>\n      </div>\n      <div class=\"wc-date-container to-input\">\n          <span>{{dateRange?.endDate | date: settings.format}}</span>\n          <i class=\"fa fa-calendar\"></i>\n      </div>\n      </div>\n      </span>\n      <div *ngIf=\"settings.rangepicker\" class=\"range-date-popover\" [ngClass]=\"{'banner-true': settings.bigBanner == true}\" [hidden]=\"!popover\">\n          <div class=\"range-banner\">\n              <div class=\"wc-banner-col\" *ngIf=\"settings.bigBanner\">\n                  <label>FROM</label>\n                  <div class=\"wc-day\">\n                      {{dateRange.startDate | date: 'dd'}}\n                  </div>\n                  <div class=\"wc-my\">\n                      <div class=\"wc-month\">\n                          <div>\n                              {{dateRange.startDate | date: 'MMMM'}} {{dateRange.startDate | date: 'yyyy'}}\n                          </div>\n                      </div>\n                      <div class=\"wc-year\">\n                          <span>{{dateRange.startDate | date: 'EEEE'}}</span>\n                      </div>\n                  </div>\n              </div>\n              <div class=\"wc-banner-col arrow-right\" *ngIf=\"settings.bigBanner\">\n                  <i class=\"fa fa-angle-right\"></i>\n              </div>\n              <div class=\"wc-banner-col\" *ngIf=\"settings.bigBanner\">\n                  <label>TO</label>\n                  <div class=\"wc-day\">{{dateRange.endDate | date: 'dd'}}</div>\n                  <div class=\"wc-my\">\n                      <div class=\"wc-month\">\n                          <div>\n                              {{dateRange.endDate | date: 'MMMM'}} {{dateRange.endDate | date: 'yyyy'}}\n                          </div>\n                      </div>\n                      <div class=\"wc-year\">\n                          <span>{{dateRange.endDate | date: 'EEEE'}}</span>\n                      </div>\n                  </div>\n              </div>\n          </div>\n          <div class=\"dp-left-section\">\n              <div class=\"wc-details\">\n                  <i class=\"wc-prev fa fa-angle-left\" (click)=\"prevMonth($event)\"></i>\n                  <div class=\"month-year\" *ngIf=\"settings.bigBanner\" (click)=\"toggleMonthView()\">{{leftDate | date: 'MMMM'}}\n                      <!-- <i ng-show=\"!monthsView\" class=\"fa fa-arrow-down\"></i>\n                                       <i ng-show=\"monthsView\" class=\"fa fa-arrow-up\"></i> -->\n                  </div>\n                  <div class=\"month-year\" *ngIf=\"!settings.bigBanner\" (click)=\"toggleMonthView()\">\n                      {{leftDate | date: 'MMMM'}}\n                      <!--    <i ng-show=\"!monthsView\" class=\"fa fa-arrow-down\" (click)=\"toggleMonthView()\"></i>\n                                          <i ng-show=\"monthsView\" class=\"fa fa-arrow-up\" (click)=\"toggleMonthView()\"></i>  -->\n\n                  </div>\n                  <i class=\"wc-next fa fa-angle-right\" (click)=\"nextMonth($event)\"></i>\n              </div>\n              <div class=\"year-title\">\n                  <div class=\"year-dropdown\" (click)=\"generateYearList('current')\">\n                      {{leftDate | date: 'yyyy'}}\n                      <i *ngIf=\"!yearView\" class=\"fa fa-angle-down\"></i>\n                      <i *ngIf=\"yearView\" class=\"fa fa-angle-up\"></i>\n                  </div>\n              </div>\n              <table class=\"calendar-header\" [hidden]=\"yearView == true || monthsView == true\">\n                  <tr>\n                      <td class=\"calendar-header-day\">Su</td>\n                      <td class=\"calendar-header-day\">Mo</td>\n                      <td class=\"calendar-header-day\">Tu</td>\n                      <td class=\"calendar-header-day\">We</td>\n                      <td class=\"calendar-header-day\">Th</td>\n                      <td class=\"calendar-header-day\">Fr</td>\n                      <td class=\"calendar-header-day\">Sa</td>\n                  </tr>\n              </table>\n              <div class=\"months-view\" [hidden]=\"!monthsView\" (click)=\"setMonth($event)\">\n                  <span *ngFor=\"let month of settings.cal_months_labels_short\" [ngClass]=\"{'current-month': month == settings.cal_months_labels_short[dateRange.startDate?.getMonth()]}\"\n                      id=\"{{month}}\">{{month}}</span>\n              </div>\n              <div class=\"years-view\" *ngIf=\"yearView\">\n                  <div class=\"fa fa-angle-left prev\" (click)=\"generateYearList('prev')\"></div>\n                  <div class=\"fa fa-angle-right next\" (click)=\"generateYearList('next')\"></div>\n                  <div class=\"years-list-view\" (click)=\"setYear($event)\">\n                      <span *ngFor=\"let year of yearsList\" [ngClass]=\"{'current-year': year == dateRange.startDate?.getFullYear()}\" id=\"{{year}}\">{{year}}</span>\n                  </div>\n              </div>\n              <div class=\"time-view\" [hidden]=\"!timeView\">\n                  <div class=\"time\">\n                      <div class=\"hour\">\n                          <span class=\"fa fa-plus inc-btn\" (click)=\"incHour()\"></span>\n                          <input type=\"number\" value=\"{{hourValue}}\" [(ngModel)]=\"hourValue\" autofocus/>\n                          <span class=\"fa fa-minus dec-btn\" (click)=\"decHour()\"></span>\n                      </div>\n                      <div class=\"time-divider\">:</div>\n                      <div class=\"minutes\">\n                          <span class=\"fa fa-plus inc-btn\" (click)=\"incMinutes()\"></span>\n                          <input type=\"number\" value=\"{{minValue}}\" [(ngModel)]=\"minValue\" />\n                          <span class=\"fa fa-minus dec-btn\" (click)=\"decMinutes()\"></span>\n                      </div>\n                  </div>\n                  <div class=\"meridian\">\n                      <div class=\"cuppa-btn-group\">\n                          <button [ngClass]=\"{'active': timeViewMeridian == 'AM'}\" class=\"button\" type=\"button\" ng-model=\"timeViewMeridian\" (click)=\"toggleMeridian('AM')\">AM</button>\n                          <button [ngClass]=\"{'active': timeViewMeridian == 'PM'}\" class=\"button\" type=\"button\" ng-model=\"timeViewMeridian\" (click)=\"toggleMeridian('PM')\">PM</button>\n                      </div>\n                  </div>\n                  <div class=\"time-view-btn\">\n                      <button class=\"button\" type=\"button\" (click)=\"setTimeView()\">Set Time</button>\n                  </div>\n              </div>\n              <table class=\"calendar-days\" (click)=\"setDay($event,'range');\" [hidden]=\"monthsView || yearView\">\n                  <tr *ngFor=\"let week of monthDays\">\n                      <td [ngClass]=\"{'range-highlight':highlightRange(day.date),'calendar-day': day.day != null,'today': day.day == today.getDate() && dateRange.startDate?.getMonth() == today.getMonth() && dateRange.startDate?.getFullYear() == today.getFullYear(),'selected-day': day.date.toString() == dateRange.startDate.toString() || day.date.toString() == dateRange.endDate.toString()}\"\n                          *ngFor=\"let day of week\">\n                          <span [attr.data-label]=\"composeDate(day.date)\">{{day.day}}</span>\n                      </td>\n\n                  </tr>\n              </table>\n          </div>\n\n          <div class=\"dp-right-section\">\n              <div class=\"wc-details\">\n                  <i class=\"wc-prev fa fa-angle-left\" (click)=\"prevMonth($event)\"></i>\n                  <div class=\"month-year\" *ngIf=\"settings.bigBanner\" (click)=\"toggleMonthView()\">{{rightDate | date: 'MMMM'}}\n                      <!-- <i ng-show=\"!monthsView\" class=\"fa fa-arrow-down\"></i>\n                                       <i ng-show=\"monthsView\" class=\"fa fa-arrow-up\"></i> -->\n                  </div>\n                  <div class=\"month-year\" *ngIf=\"!settings.bigBanner\" (click)=\"toggleMonthView()\">\n                      {{rightDate | date: 'MMMM'}}\n                      <!--    <i ng-show=\"!monthsView\" class=\"fa fa-arrow-down\" (click)=\"toggleMonthView()\"></i>\n                                          <i ng-show=\"monthsView\" class=\"fa fa-arrow-up\" (click)=\"toggleMonthView()\"></i>  -->\n\n                  </div>\n                  <i class=\"wc-next fa fa-angle-right\" (click)=\"nextMonth($event)\"></i>\n              </div>\n              <div class=\"year-title\">\n                  <div class=\"year-dropdown\" (click)=\"generateYearList('current')\">\n                      {{rightDate | date: 'yyyy'}}\n                      <i *ngIf=\"!yearView\" class=\"fa fa-angle-down\"></i>\n                      <i *ngIf=\"yearView\" class=\"fa fa-angle-up\"></i>\n                  </div>\n              </div>\n              <table class=\"calendar-header\" [hidden]=\"yearView == true || monthsView == true\">\n                  <tr>\n                      <td class=\"calendar-header-day\">Su</td>\n                      <td class=\"calendar-header-day\">Mo</td>\n                      <td class=\"calendar-header-day\">Tu</td>\n                      <td class=\"calendar-header-day\">We</td>\n                      <td class=\"calendar-header-day\">Th</td>\n                      <td class=\"calendar-header-day\">Fr</td>\n                      <td class=\"calendar-header-day\">Sa</td>\n                  </tr>\n              </table>\n              <div class=\"months-view\" [hidden]=\"!monthsView\" (click)=\"setMonth($event)\">\n                  <span *ngFor=\"let month of settings.cal_months_labels_short\" [ngClass]=\"{'current-month': month == settings.cal_months_labels_short[date?.getMonth()]}\"\n                      id=\"{{month}}\">{{month}}</span>\n              </div>\n              <div class=\"years-view\" *ngIf=\"yearView\">\n                  <div class=\"fa fa-angle-left prev\" (click)=\"generateYearList('prev')\"></div>\n                  <div class=\"fa fa-angle-right next\" (click)=\"generateYearList('next')\"></div>\n                  <div class=\"years-list-view\" (click)=\"setYear($event)\">\n                      <span *ngFor=\"let year of yearsList\" [ngClass]=\"{'current-year': year == date?.getFullYear()}\" id=\"{{year}}\">{{year}}</span>\n                  </div>\n              </div>\n              <div class=\"time-view\" [hidden]=\"!timeView\">\n                  <div class=\"time\">\n                      <div class=\"hour\">\n                          <span class=\"fa fa-plus inc-btn\" (click)=\"incHour()\"></span>\n                          <input type=\"number\" value=\"{{hourValue}}\" [(ngModel)]=\"hourValue\" autofocus/>\n                          <span class=\"fa fa-minus dec-btn\" (click)=\"decHour()\"></span>\n                      </div>\n                      <div class=\"time-divider\">:</div>\n                      <div class=\"minutes\">\n                          <span class=\"fa fa-plus inc-btn\" (click)=\"incMinutes()\"></span>\n                          <input type=\"number\" value=\"{{minValue}}\" [(ngModel)]=\"minValue\" />\n                          <span class=\"fa fa-minus dec-btn\" (click)=\"decMinutes()\"></span>\n                      </div>\n                  </div>\n                  <div class=\"meridian\">\n                      <div class=\"cuppa-btn-group\">\n                          <button [ngClass]=\"{'active': timeViewMeridian == 'AM'}\" type=\"button\" class=\"button\" ng-model=\"timeViewMeridian\" (click)=\"toggleMeridian('AM')\">AM</button>\n                          <button [ngClass]=\"{'active': timeViewMeridian == 'PM'}\" type=\"button\" class=\"button\" ng-model=\"timeViewMeridian\" (click)=\"toggleMeridian('PM')\">PM</button>\n                      </div>\n                  </div>\n                  <div class=\"time-view-btn\">\n                      <button class=\"button\" (click)=\"setTimeView()\">Set Time</button>\n                  </div>\n              </div>\n              <table class=\"calendar-days\" (click)=\"setDay($event,'range');\" [hidden]=\"monthsView || yearView\">\n                  <tr *ngFor=\"let week of toMonthDays\">\n                      <td [ngClass]=\"{'range-highlight':highlightRange(day.date),'calendar-day': day != null,'today': day == today.getDate() && dateRange.endDate?.getMonth() == today.getMonth() && dateRange.endDate?.getFullYear() == today.getFullYear(),'selected-day': day.date.toString() == dateRange.startDate.toString() || day.date.toString() == dateRange.endDate.toString()}\"\n                          *ngFor=\"let day of week\">\n                          <span [attr.data-label]=\"composeDate(day.date)\">{{day.day}}</span>\n                      </td>\n\n                  </tr>\n              </table>\n          </div>\n          <div class=\"cal-util\">\n              <ul class=\"util-list\">\n                  <li><a>Last week</a></li>\n                  <li><a (click)=\"getCurrentWeek()\">Current week</a></li>\n                  <li><a>Next week</a></li>\n              </ul>\n              <button class=\"button btn-xs\" type=\"button\" (click)=\"done()\"><i class=\"fa fa-check\"></i>Done</button>\n          </div>\n      </div>\n    ",
                    styles: ["\n      @import url(\"https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700\");body{font-family:'Roboto',sans-serif}*{box-sizing:border-box}#cuppaDatePickerContainer,#cuppaDatePicker{width:250px;text-align:center;margin:0px auto;font-family:'Roboto','Arial',sans-serif}.year-dropdown{text-align:center}.calendar-header{color:#333;background:#fff}.wc-date-container{float:left;width:100%;height:30px;border:1px solid #0076C0;margin-bottom:1px;font-size:16px;padding:5px;text-align:left;cursor:pointer;background:#fff;line-height:20px}.wc-date-container>span{color:#0076C0}.wc-date-container>i{float:right;font-size:20px;color:#0076C0}.winkel-calendar{position:relative;font-family:'Roboto','Arial',sans-serif}.wc-date-popover{font-size:14px;box-shadow:0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12),0 8px 10px -5px rgba(0,0,0,0.4);margin:0px auto;perspective:1000px;float:left;background:#fff;background:#fff;position:fixed;width:90%;top:5%;left:50%;z-index:9999999;overflow:hidden;height:90%;max-width:320px;transition:all .5s linear;transform:translateX(-50%)}.wc-banner{float:left;width:100%;font-size:54px;background:#0076C0}.wc-day-row{padding:5px 0px;color:#fff;width:100%;float:left;font-size:3vh;text-align:center}.wc-date-row{display:inline-block;font-size:25vw;color:#fff;padding:5px;width:50%;float:left;text-align:right;font-weight:200}.wc-month-row{padding:25px 0px 0px 0px;font-size:8vw;color:#fff;width:100%;float:left}.wc-month-row>i,.wc-year-row>i{float:right;font-size:12px;padding:10px 6px;cursor:pointer}.wc-month-row>i:hover,.wc-year-row>i:hover{color:rgba(255,255,255,0.63)}.wc-year-row{text-align:left;color:#fff;font-size:7vw;float:left;width:100%;padding:2px 0px 0px 0px}.timepicker-true .wc-year-row{font-size:20px;padding:5px 0px 0px 12px}.timestate>.active{color:#fff}.timestate span{cursor:pointer}.wc-my-sec{display:inline-block;padding:5px 10px;float:left;width:50%;font-weight:300}.timepicker-true .wc-my-sec{width:20%}.time i{font-size:21px;display:block;text-align:center;cursor:pointer}.time i:hover{color:rgba(255,255,255,0.65)}.time>.hour,.time>.minutes{float:left;width:48%;text-align:center}.wc-month-row>div:nth-child(1),.wc-year-row>div:nth-child(1){float:left;text-align:left}.wc-time-sec{color:#fff;text-align:center;padding:0px 10px 10px;float:left;width:100%}.wc-time-sec>.time{font-size:38px;font-weight:300;width:100%;text-align:center;float:left}.time-divider{width:4%;float:left;text-align:center;padding:0px 10px}.time-view{position:absolute;background:#fff;width:100%;z-index:1;top:40px;padding:35px;border-top:1px solid #0076C0}.time-view-btn{text-align:center}.meridian{text-align:center;padding:15px 0px}.button{width:100%;padding:10px;background:#0076C0;color:#fff;margin:0px auto;border:1px solid #0076C0;border-radius:3px;cursor:pointer}.button-sm{width:50%}.time-view .time{font-size:36px;width:100%;margin:0px auto;display:inline-block;padding:5px 0px 0px 0px;color:#0076C0;font-weight:300}.time-view .time-divider{padding:16px 0}.wc-time-sec .time input,.time-view .time input{display:inline-block;width:100%;background:none;border:none;text-align:center;cursor:pointer;font-family:inherit;font-size:32px;font-weight:300;padding:0px 10px;text-align:center;color:#0076C0}.inc-btn,.dec-btn{font-size:14px;display:block;color:#8e8e8e}.wc-time-sec>.time>.timestate{float:left;padding:0px 10px}.show-time-picker .wc-date-row{width:33% !important}.show-time-picker .wc-my-sec{width:22% !important}.wc-month-controls>.fa:hover,.wc-year-controls>.fa:hover{color:#fff}.wc-details>.fa:hover{color:#ccc}.wc-month-controls{padding:5px;font-size:16px;color:rgba(255,255,255,0.71);float:right}.wc-year-controls{padding:2px 5px 0px 5px;font-size:16px;color:rgba(255,255,255,0.71);float:right}.wc-year-controls>.fa,.wc-month-controls>.fa{cursor:pointer;padding:0px 4px}.wc-details{float:left;width:65%;padding:10px 0px 10px;color:#fff;background:#0076C0}.banner-true>.wc-details{padding:10px 0px 10px}.wc-prev{float:left;width:25%;text-align:left;padding:0px 15px;cursor:pointer;font-size:35px}.month-year{float:left;width:50%;font-size:18px;line-height:35px;text-align:center}.wc-next{float:right;width:25%;text-align:right;padding:0px 15px;cursor:pointer;font-size:35px}.calendar-days{color:#0076C0 !important;background:#fff}.cal-util{width:100%;float:left;position:absolute;bottom:0;background:#fff;border-top:1px solid #f2f2f2}.cal-util>.ok{width:100%;padding:5px;float:left;color:#0076C0;font-size:18px;border-top:1px solid #d1d1d1;text-align:center;cursor:pointer}.ok>i{margin-right:5px}.cal-util>.cancel{width:50%;float:left;padding:10px;color:#0076C0;font-size:20px}.cal-util>.ok:hover,.cal-util>.cancel:hover{box-shadow:inset 0px 0px 20px #ccc}.range-date-popover .cal-util{padding:10px}.range-date-popover .cal-util .btn-xs{float:right}.btn-xs{padding:5px 10px;width:auto}.today>span{border:1px solid #0076C0;background:none}.selected-day>span{background:#0076C0;color:#fff}.calendar-days td{cursor:pointer}.calendar-day:hover>span{background:#0076C0;color:#fff}.winkel-calendar table{width:100%;text-align:center;font-size:18px;border-collapse:collapse}.winkel-calendar table td{padding:0px 0px;width:calc((100%)/7);text-align:center;transition:all .1s linear}.winkel-calendar table td span{display:block;padding:7px;margin:0px;line-height:32px}.calendar-header td{padding:5px 0px !important}.months-view,.years-view{background:#fff;width:100%;top:210px;width:100%;height:calc(100% - 210px);bottom:0;text-align:center}.years-list-view{float:left;width:calc(100% - 60px);height:100%}.months-view>span,.years-list-view>span{display:inline-block;width:25%;padding:25px 0px;cursor:pointer;font-size:16px}.years-list-view>span{width:33.3333%}.years-view>.prev,.years-view>.next{float:left;width:30px;padding:85px 0px;cursor:pointer;font-size:52px}.years-view>.prev:hover,.years-view>.next:hover{color:#ccc}.years-view>.next{float:right}.current-month,.current-year{color:#0076C0}.years-view>span{width:33.3333%}.months-view>span:hover,.years-list-view>span:hover{color:#0076C0}.banner-true{padding-top:0px !important}.banner-true>.wc-banner{margin-bottom:0px !important}.banner-true>.time-view{height:calc(100% - 124px);top:142px}.methods{clear:left;padding:50px 0px;text-align:center}.month-year i{cursor:pointer;font-size:10px}.timepicker-true .wc-month-row{font-size:28px;padding:5px 0px 5px 15px}.timepicker-true .wc-month-row>i,.wc-year-row>i{padding:8px 6px}.timepicker-true .wc-my-sec{padding:16px 2px}.timepicker-true .wc-time-sec{width:48%;padding:25px 0px;margin:0px;cursor:pointer}.timepicker-true .wc-time-sec:hover{color:rgba(255,255,255,0.65)}.timepicker-true .wc-time-sec>.time{width:75%;cursor:pointer}.timepicker-true .time i{display:none}.timepicker-true .time-divider{padding:0px}.timepicker-true .timestate{padding:0px;width:auto;padding-top:7px;font-size:20px;font-weight:300}.year-title{width:35%;float:left;line-height:55px;font-size:18px;color:#fff;background:#0076C0}.year-title i{float:right;padding:13px 10px 7px 0px;font-size:28px}@media (min-width: 365px) and (max-width: 767px){.timepicker-true .wc-date-row{width:54%;padding:20px 5px 10px}.timepicker-true .wc-my-sec{padding:33px 2px 10px;width:46%}.timepicker-true .wc-time-sec{width:100%;padding:0px 0px 15px 0px}.timepicker-true .wc-time-sec>.time{width:35%;float:none;margin:0px auto;font-size:42px}.timepicker-true .wc-month-row{font-size:42px;padding:5px 0px 5px 5px}.timepicker-true .wc-year-row{font-size:24px;padding:15px 0px 0px 5px}.timepicker-true .timestate{font-size:22px;font-weight:100}.months-view,.years-view{top:297px}.banner-true>.time-view{top:240px}.time-view .time{font-size:62px}.cuppa-btn-group{font-size:22px;font-weight:300;color:#ccc}.angular-range-slider{height:5px;margin:20px auto 25px auto}.angular-range-slider div.handle{width:45px;height:45px;top:-20px;font-size:26px}.time-view-btn{padding:25px 0px}.button-sm{width:80%;padding:10px;font-size:16px}.cuppa-btn-group>.button{padding:5px 15px !important}}@media (min-width: 768px){.wc-date-popover{width:250px;position:absolute;top:31px;height:auto;left:0;transform:translateX(0)}.wc-day-row{padding:5px 0px;font-size:0.25em}.wc-date-row{font-size:1em;padding:5px}.wc-my-sec{padding:5px 0px}.timepicker-true .wc-my-sec{padding:15px 3px}.wc-month-row{padding:10px 0px 0px 0px;font-size:0.4em}.wc-year-row{font-size:0.3em;padding:0px}.month-year{font-size:14px;line-height:20px;cursor:pointer}.wc-prev,.wc-next{font-size:18px}.wc-details{padding:10px 0px 10px}.year-title{line-height:40px;font-size:16px}.year-title i{padding:11px 10px 10px 0px;font-size:18px}.calendar-header td{padding:5px 0px !important}.winkel-calendar table{font-size:14px}.winkel-calendar table td span{line-height:24px;width:35px;height:35px}.months-view,.years-view{top:40px;width:100%;height:calc(100%)}.banner-true .months-view,.banner-true .years-view{top:165px;height:calc(100% - 128px)}.winkel-calendar table td span{padding:6px}.cal-util>.ok{font-size:14px;padding:10px}.wc-time-sec>.time{font-size:0.35em;cursor:pointer}.time i{font-size:10px}.wc-time-sec>.timestate{font-size:16px}.wc-month-row>div:nth-child(1),.wc-year-row>div:nth-child(1){min-width:35px}.wc-month-row>i,.wc-year-row>i{font-size:8px}.cal-util{position:relative}.banner-true>.time-view{top:159px}.timepicker-true .wc-month-row{padding:6px 0px 0px 0px;font-size:18px}.timepicker-true .wc-year-row{padding:0px 0px 0px 0px;font-size:16px}}.time-view h5{text-align:left;width:80%;margin:0px auto;padding:5px 0px;font-weight:400}.cuppa-btn-group{display:inline-flex}.cuppa-btn-group>.active{background:#0076C0 !important;color:#fff !important}.cuppa-btn-group>.button{border:1px solid #0076C0;background:#fff;border-radius:3px;float:left;margin:0px;align-items:initial;color:#0076C0;width:auto;padding:5px 10px}.cuppa-btn-group>.button:first-child{border-top-right-radius:0px;border-bottom-right-radius:0px;border-right:0px}.cuppa-btn-group>.button:last-child{border-top-left-radius:0px;border-bottom-left-radius:0px}.slider{width:200px;height:5px;background:#ccc;border-radius:5px;margin:12px auto;position:relative}.slider>.circle{width:20px;height:20px;background:#fff;position:absolute;top:-8px;border-radius:20px;left:60px;box-shadow:0px 0px 5px #ccc;cursor:pointer}input[type='number']{-moz-appearance:textfield}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.range-highlight{background:#f2f2f2}.clock-icon{text-align:center;color:#0076C0}.time-close{position:absolute;right:15px;top:15px;cursor:pointer}.util-list{list-style:none;float:left;padding:0px;margin:0px}.util-list li{float:left;padding:5px}.util-list li a{color:#007bff;cursor:pointer}.util-list li a:hover{color:#14569d;text-decoration:underline}\n      .range-banner{background:#ffffff;width:100%;float:left;display:flex;flex-direction:row;flex-wrap:nowrap;padding:25px 15px 10px 15px}.range-input{display:flex;flex-direction:row;min-width:275px}.wc-date-container{position:relative}.range-direc{position:absolute;right:-8px;background:#fff;z-index:1;color:#ccc !important;font-size:16px !important;top:6px}.to-input{padding-left:15px}.arrow-right{padding:0px 20px}.arrow-right .fa{font-size:2em;color:#1565c0}.wc-banner-col{display:flex;color:#1565c0;flex-direction:row;align-items:center;flex-wrap:wrap;position:relative}.wc-banner-col label{width:100%;text-align:left;margin:0px;position:absolute;top:-10px;color:#888888}.wc-day{font-size:3em;font-weight:300;padding-right:5px}.wc-my{display:flex;align-items:baseline;flex-direction:column}.wc-month{font-size:1.2em;margin-top:-5px;color:#888888}.wc-year{font-size:0.9em;font-weight:300;margin-top:-1px;color:#6e6e6e}.dp-left-section,.dp-right-section{border-top:1px solid #fff}.dp-left-section{border-right:1px solid #ccc}.range-date-popover{border:1px solid #1565c0;background:#fff}@media (min-width: 768px){.range-banner .wc-banner{width:30%}.range-date-popover{width:500px;position:absolute;top:31px;height:auto;left:0;-webkit-transform:translateX(0);transform:translateX(0)}.dp-left-section,.dp-right-section{float:left;width:50%}}\n    "],
                    providers: [DATEPICKER_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    DatePicker.ctorParameters = function () { return []; };
    DatePicker.propDecorators = {
        'settings': [{ type: Input },],
        'onDateSelect': [{ type: Output },],
    };
    return DatePicker;
}());
export { DatePicker };
//# sourceMappingURL=datepicker.component.js.map