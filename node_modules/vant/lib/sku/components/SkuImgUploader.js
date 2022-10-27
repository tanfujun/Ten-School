"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _utils = require("../../utils");

var _uploader = _interopRequireDefault(require("../../uploader"));

// Utils
// Components
var namespace = (0, _utils.createNamespace)('sku-img-uploader');
var createComponent = namespace[0];
var t = namespace[2];

var _default = createComponent({
  props: {
    value: String,
    uploadImg: Function,
    customUpload: Function,
    maxSize: {
      type: Number,
      default: 6
    }
  },
  data: function data() {
    return {
      fileList: []
    };
  },
  watch: {
    value: function value(val) {
      if (val) {
        this.fileList = [{
          url: val,
          isImage: true
        }];
      } else {
        this.fileList = [];
      }
    }
  },
  methods: {
    afterReadFile: function afterReadFile(file) {
      var _this = this;

      file.status = 'uploading';
      file.message = t('uploading');
      this.uploadImg(file.file, file.content).then(function (img) {
        file.status = 'done';

        _this.$emit('input', img);
      }).catch(function () {
        file.status = 'failed';
        file.message = t('fail');
      });
    },
    onOversize: function onOversize() {
      this.$toast(t('oversize', this.maxSize));
    },
    onDelete: function onDelete() {
      this.$emit('input', '');
    },
    onClickUpload: function onClickUpload() {
      var _this2 = this;

      if (this.customUpload) {
        this.customUpload().then(function (url) {
          _this2.fileList.push({
            url: url
          });

          _this2.$emit('input', url);
        });
      }
    }
  },
  render: function render() {
    var _this3 = this;

    var h = arguments[0];
    return h(_uploader.default, {
      "attrs": {
        "maxCount": 1,
        "readonly": !!this.customUpload,
        "maxSize": this.maxSize * 1024 * 1024,
        "afterRead": this.afterReadFile
      },
      "on": {
        "oversize": this.onOversize,
        "delete": this.onDelete,
        "click-upload": this.onClickUpload
      },
      "model": {
        value: _this3.fileList,
        callback: function callback($$v) {
          _this3.fileList = $$v;
        }
      }
    });
  }
});

exports.default = _default;