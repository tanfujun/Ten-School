"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _utils = require("../utils");

var _tab = _interopRequireDefault(require("../tab"));

var _tabs = _interopRequireDefault(require("../tabs"));

var _icon = _interopRequireDefault(require("../icon"));

var _createNamespace = (0, _utils.createNamespace)('cascader'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    title: String,
    value: [Number, String],
    fieldNames: Object,
    placeholder: String,
    activeColor: String,
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    closeable: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      tabs: [],
      activeTab: 0
    };
  },
  computed: {
    textKey: function textKey() {
      var _this$fieldNames;

      return ((_this$fieldNames = this.fieldNames) == null ? void 0 : _this$fieldNames.text) || 'text';
    },
    valueKey: function valueKey() {
      var _this$fieldNames2;

      return ((_this$fieldNames2 = this.fieldNames) == null ? void 0 : _this$fieldNames2.value) || 'value';
    },
    childrenKey: function childrenKey() {
      var _this$fieldNames3;

      return ((_this$fieldNames3 = this.fieldNames) == null ? void 0 : _this$fieldNames3.children) || 'children';
    }
  },
  watch: {
    options: {
      deep: true,
      handler: 'updateTabs'
    },
    value: function value(_value) {
      var _this = this;

      if (_value || _value === 0) {
        var values = this.tabs.map(function (tab) {
          var _tab$selectedOption;

          return (_tab$selectedOption = tab.selectedOption) == null ? void 0 : _tab$selectedOption[_this.valueKey];
        });

        if (values.indexOf(_value) !== -1) {
          return;
        }
      }

      this.updateTabs();
    }
  },
  created: function created() {
    this.updateTabs();
  },
  methods: {
    getSelectedOptionsByValue: function getSelectedOptionsByValue(options, value) {
      for (var i = 0; i < options.length; i++) {
        var option = options[i];

        if (option[this.valueKey] === value) {
          return [option];
        }

        if (option[this.childrenKey]) {
          var selectedOptions = this.getSelectedOptionsByValue(option[this.childrenKey], value);

          if (selectedOptions) {
            return [option].concat(selectedOptions);
          }
        }
      }
    },
    updateTabs: function updateTabs() {
      var _this2 = this;

      if (this.value || this.value === 0) {
        var selectedOptions = this.getSelectedOptionsByValue(this.options, this.value);

        if (selectedOptions) {
          var optionsCursor = this.options;
          this.tabs = selectedOptions.map(function (option) {
            var tab = {
              options: optionsCursor,
              selectedOption: option
            };
            var next = optionsCursor.filter(function (item) {
              return item[_this2.valueKey] === option[_this2.valueKey];
            });

            if (next.length) {
              optionsCursor = next[0][_this2.childrenKey];
            }

            return tab;
          });

          if (optionsCursor) {
            this.tabs.push({
              options: optionsCursor,
              selectedOption: null
            });
          }

          this.$nextTick(function () {
            _this2.activeTab = _this2.tabs.length - 1;
          });
          return;
        }
      }

      this.tabs = [{
        options: this.options,
        selectedOption: null
      }];
    },
    onSelect: function onSelect(option, tabIndex) {
      var _this3 = this;

      this.tabs[tabIndex].selectedOption = option;

      if (this.tabs.length > tabIndex + 1) {
        this.tabs = this.tabs.slice(0, tabIndex + 1);
      }

      if (option[this.childrenKey]) {
        var nextTab = {
          options: option[this.childrenKey],
          selectedOption: null
        };

        if (this.tabs[tabIndex + 1]) {
          this.$set(this.tabs, tabIndex + 1, nextTab);
        } else {
          this.tabs.push(nextTab);
        }

        this.$nextTick(function () {
          _this3.activeTab++;
        });
      }

      var selectedOptions = this.tabs.map(function (tab) {
        return tab.selectedOption;
      }).filter(function (item) {
        return !!item;
      });
      var eventParams = {
        value: option[this.valueKey],
        tabIndex: tabIndex,
        selectedOptions: selectedOptions
      };
      this.$emit('input', option[this.valueKey]);
      this.$emit('change', eventParams);

      if (!option[this.childrenKey]) {
        this.$emit('finish', eventParams);
      }
    },
    onClose: function onClose() {
      this.$emit('close');
    },
    renderHeader: function renderHeader() {
      var h = this.$createElement;

      if (this.showHeader) {
        return h("div", {
          "class": bem('header')
        }, [h("h2", {
          "class": bem('title')
        }, [this.slots('title') || this.title]), this.closeable ? h(_icon.default, {
          "attrs": {
            "name": "cross"
          },
          "class": bem('close-icon'),
          "on": {
            "click": this.onClose
          }
        }) : null]);
      }
    },
    renderOptions: function renderOptions(options, selectedOption, tabIndex) {
      var _this4 = this;

      var h = this.$createElement;

      var renderOption = function renderOption(option) {
        var isSelected = selectedOption && option[_this4.valueKey] === selectedOption[_this4.valueKey];
        var Text = _this4.slots('option', {
          option: option,
          selected: isSelected
        }) || h("span", [option[_this4.textKey]]);
        return h("li", {
          "class": bem('option', {
            selected: isSelected
          }),
          "style": {
            color: isSelected ? _this4.activeColor : null
          },
          "on": {
            "click": function click() {
              _this4.onSelect(option, tabIndex);
            }
          }
        }, [Text, isSelected ? h(_icon.default, {
          "attrs": {
            "name": "success"
          },
          "class": bem('selected-icon')
        }) : null]);
      };

      return h("ul", {
        "class": bem('options')
      }, [options.map(renderOption)]);
    },
    renderTab: function renderTab(item, tabIndex) {
      var h = this.$createElement;
      var options = item.options,
          selectedOption = item.selectedOption;
      var title = selectedOption ? selectedOption[this.textKey] : this.placeholder || t('select');
      return h(_tab.default, {
        "attrs": {
          "title": title,
          "titleClass": bem('tab', {
            unselected: !selectedOption
          })
        }
      }, [this.renderOptions(options, selectedOption, tabIndex)]);
    },
    renderTabs: function renderTabs() {
      var _this5 = this;

      var h = this.$createElement;
      return h(_tabs.default, {
        "attrs": {
          "animated": true,
          "swipeable": true,
          "swipeThreshold": 0,
          "color": this.activeColor
        },
        "class": bem('tabs'),
        "model": {
          value: _this5.activeTab,
          callback: function callback($$v) {
            _this5.activeTab = $$v;
          }
        }
      }, [this.tabs.map(this.renderTab)]);
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "class": bem()
    }, [this.renderHeader(), this.renderTabs()]);
  }
});

exports.default = _default2;