"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _date = require("../utils/validate/date");

var _string = require("../utils/format/string");

var _utils2 = require("./utils");

var _shared = require("./shared");

var currentYear = new Date().getFullYear();

var _createNamespace = (0, _utils.createNamespace)('date-picker'),
    createComponent = _createNamespace[0];

var _default2 = createComponent({
  mixins: [_shared.TimePickerMixin],
  props: (0, _extends2.default)({}, _shared.sharedProps, {
    type: {
      type: String,
      default: 'datetime'
    },
    minDate: {
      type: Date,
      default: function _default() {
        return new Date(currentYear - 10, 0, 1);
      },
      validator: _date.isDate
    },
    maxDate: {
      type: Date,
      default: function _default() {
        return new Date(currentYear + 10, 11, 31);
      },
      validator: _date.isDate
    }
  }),
  watch: {
    filter: 'updateInnerValue',
    minDate: function minDate() {
      var _this = this;

      this.$nextTick(function () {
        _this.updateInnerValue();
      });
    },
    maxDate: function maxDate(value) {
      if (this.innerValue.valueOf() >= value.valueOf()) {
        this.innerValue = value;
      } else {
        this.updateInnerValue();
      }
    },
    value: function value(val) {
      val = this.formatValue(val);

      if (val && val.valueOf() !== this.innerValue.valueOf()) {
        this.innerValue = val;
      }
    }
  },
  computed: {
    ranges: function ranges() {
      var _this$getBoundary = this.getBoundary('max', this.innerValue ? this.innerValue : this.minDate),
          maxYear = _this$getBoundary.maxYear,
          maxDate = _this$getBoundary.maxDate,
          maxMonth = _this$getBoundary.maxMonth,
          maxHour = _this$getBoundary.maxHour,
          maxMinute = _this$getBoundary.maxMinute;

      var _this$getBoundary2 = this.getBoundary('min', this.innerValue ? this.innerValue : this.minDate),
          minYear = _this$getBoundary2.minYear,
          minDate = _this$getBoundary2.minDate,
          minMonth = _this$getBoundary2.minMonth,
          minHour = _this$getBoundary2.minHour,
          minMinute = _this$getBoundary2.minMinute;

      var result = [{
        type: 'year',
        range: [minYear, maxYear]
      }, {
        type: 'month',
        range: [minMonth, maxMonth]
      }, {
        type: 'day',
        range: [minDate, maxDate]
      }, {
        type: 'hour',
        range: [minHour, maxHour]
      }, {
        type: 'minute',
        range: [minMinute, maxMinute]
      }];

      switch (this.type) {
        case 'date':
          result = result.slice(0, 3);
          break;

        case 'year-month':
          result = result.slice(0, 2);
          break;

        case 'month-day':
          result = result.slice(1, 3);
          break;

        case 'datehour':
          result = result.slice(0, 4);
          break;
      }

      if (this.columnsOrder) {
        var columnsOrder = this.columnsOrder.concat(result.map(function (column) {
          return column.type;
        }));
        result.sort(function (a, b) {
          return columnsOrder.indexOf(a.type) - columnsOrder.indexOf(b.type);
        });
      }

      return result;
    }
  },
  methods: {
    formatValue: function formatValue(value) {
      var _this2 = this;

      if (!(0, _date.isDate)(value)) {
        return null;
      }

      var minDate = new Date(this.minDate);
      var maxDate = new Date(this.maxDate);
      var dateMethods = {
        year: 'getFullYear',
        month: 'getMonth',
        day: 'getDate',
        hour: 'getHours',
        minute: 'getMinutes'
      };

      if (this.originColumns) {
        var dateColumns = this.originColumns.map(function (_ref, index) {
          var type = _ref.type,
              values = _ref.values;
          var range = _this2.ranges[index].range;
          var minDateVal = minDate[dateMethods[type]]();
          var maxDateVal = maxDate[dateMethods[type]]();
          var min = type === 'month' ? +values[0] - 1 : +values[0];
          var max = type === 'month' ? +values[values.length - 1] - 1 : +values[values.length - 1];
          return {
            type: type,
            values: [minDateVal < range[0] ? Math.max(minDateVal, min) : min || minDateVal, maxDateVal > range[1] ? Math.min(maxDateVal, max) : max || maxDateVal]
          };
        });

        if (this.type === 'month-day') {
          var year = (this.innerValue || this.minDate).getFullYear();
          dateColumns.unshift({
            type: 'year',
            values: [year, year]
          });
        }

        var dates = Object.keys(dateMethods).map(function (type) {
          var _dateColumns$filter$;

          return (_dateColumns$filter$ = dateColumns.filter(function (item) {
            return item.type === type;
          })[0]) == null ? void 0 : _dateColumns$filter$.values;
        }).filter(function (item) {
          return item;
        });
        minDate = (0, _construct2.default)(Date, dates.map(function (val) {
          return (0, _utils2.getTrueValue)(val[0]);
        }));
        maxDate = (0, _construct2.default)(Date, dates.map(function (val) {
          return (0, _utils2.getTrueValue)(val[1]);
        }));
      }

      value = Math.max(value, minDate.getTime());
      value = Math.min(value, maxDate.getTime());
      return new Date(value);
    },
    getBoundary: function getBoundary(type, value) {
      var _ref2;

      var boundary = this[type + "Date"];
      var year = boundary.getFullYear();
      var month = 1;
      var date = 1;
      var hour = 0;
      var minute = 0;

      if (type === 'max') {
        month = 12;
        date = (0, _utils2.getMonthEndDay)(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
      }

      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;

        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();

          if (value.getDate() === date) {
            hour = boundary.getHours();

            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
            }
          }
        }
      }

      return _ref2 = {}, _ref2[type + "Year"] = year, _ref2[type + "Month"] = month, _ref2[type + "Date"] = date, _ref2[type + "Hour"] = hour, _ref2[type + "Minute"] = minute, _ref2;
    },
    updateInnerValue: function updateInnerValue() {
      var _this3 = this;

      var type = this.type;
      var indexes = this.getPicker().getIndexes();

      var getValue = function getValue(type) {
        var index = 0;

        _this3.originColumns.forEach(function (column, columnIndex) {
          if (type === column.type) {
            index = columnIndex;
          }
        });

        var values = _this3.originColumns[index].values;
        return (0, _utils2.getTrueValue)(values[indexes[index]]);
      };

      var year;
      var month;
      var day;

      if (type === 'month-day') {
        year = (this.innerValue || this.minDate).getFullYear();
        month = getValue('month');
        day = getValue('day');
      } else {
        year = getValue('year');
        month = getValue('month');
        day = type === 'year-month' ? 1 : getValue('day');
      }

      var maxDay = (0, _utils2.getMonthEndDay)(year, month);
      day = day > maxDay ? maxDay : day;
      var hour = 0;
      var minute = 0;

      if (type === 'datehour') {
        hour = getValue('hour');
      }

      if (type === 'datetime') {
        hour = getValue('hour');
        minute = getValue('minute');
      }

      var value = new Date(year, month - 1, day, hour, minute);
      this.innerValue = this.formatValue(value);
    },
    onChange: function onChange(picker) {
      var _this4 = this;

      this.updateInnerValue();
      this.$nextTick(function () {
        _this4.$nextTick(function () {
          // https://github.com/vant-ui/vant/issues/9775
          _this4.updateInnerValue();

          _this4.$emit('change', picker);
        });
      });
    },
    updateColumnValue: function updateColumnValue() {
      var _this5 = this;

      var value = this.innerValue ? this.innerValue : this.minDate;
      var formatter = this.formatter;
      var values = this.originColumns.map(function (column) {
        switch (column.type) {
          case 'year':
            return formatter('year', "" + value.getFullYear());

          case 'month':
            return formatter('month', (0, _string.padZero)(value.getMonth() + 1));

          case 'day':
            return formatter('day', (0, _string.padZero)(value.getDate()));

          case 'hour':
            return formatter('hour', (0, _string.padZero)(value.getHours()));

          case 'minute':
            return formatter('minute', (0, _string.padZero)(value.getMinutes()));

          default:
            // no default
            return null;
        }
      });
      this.$nextTick(function () {
        _this5.getPicker().setValues(values);
      });
    }
  }
});

exports.default = _default2;