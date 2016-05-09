/** global moment:false */
/**
*  Date Service
*
*  Provides methods for getting Current Date and formatting Dates
*/
(function () {
    'use strict';

    angular.module('ccMobile.requests')
        .factory('dateService', dateService);
    
    function dateService() {
        var service = {
            add: add,
            formatDate: formatDate,
            formatDateTime: formatDateTime,
            formatShortDate: formatShortDate,
            getDateFormatString: getDateFormatString,
            getDateTimeFormatString: getDateTimeFormatString,
            now: now
        };

        Date.prototype.today = function () {
            return (((this.getMonth() + 1) < 10) ? '0' :'') + (this.getMonth() + 1) + '/' + ((this.getDate() < 10) ? '0' : '') + this.getDate() + '/' + this.getFullYear();
        };

        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? '0' : '') + this.getHours() + ':' + ((this.getMinutes() < 10) ? '0' : '') + this.getMinutes() + ':' + ((this.getSeconds() < 10) ? '0' : '') + this.getSeconds();
        };

        function formatDate(dateField, format) {
            if (dateField) {
                if (format) {
                    return moment(dateField).format(format);
                } else {
                    return formatShortDate(dateField);
                }
            }
            return dateField;
        }

        /** Returns the short data of format 'MM/DD/YYYY' 
        *   dateField - date
        */
        function formatShortDate(dateField) {
            if (dateField) {
                return moment(dateField).format('MM/DD/YYYY');
            } else {
                return dateField;
            }

        }

        /** Returns the formatted data of format 'MM/DD/YYYY HH:mm:ss' 
        *   dateField - date
        */
        function formatDateTime(dateField) {
            if (dateField) {
                //return moment(dateField).format('MM/DD/YYYY h:mm:ss a');
                return moment(dateField).format('MM/DD/YYYY HH:mm:ss');
            } else {
                return dateField;
            }
        }

        function getDateFormatString() {
            return '{0: MM/dd/yyyy}';
        }
        
        function getDateTimeFormatString() {
            return '{0: MM/dd/yyyy HH:mm:ss}';
        }

        /** function to get the current date */
        function now() {
            return formatDateTime(moment());
        }

        function add(date, amount, period) {
            var periods = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];
            if (periods.indexOf(period) === -1) {
                throw new Error('Invalid period: ' + period);
            }
            return moment(date).add(amount, period);
        }
        return service;
    }
})();