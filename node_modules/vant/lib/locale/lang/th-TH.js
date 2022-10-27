"use strict";

exports.__esModule = true;
exports.default = void 0;
var _default = {
  name: 'ชื่อ',
  tel: 'โทรศัพท์',
  save: 'บันทึก',
  confirm: 'ยืนยัน',
  cancel: 'ยกเลิก',
  delete: 'ลบ',
  complete: 'ดำเนินการ',
  loading: 'กำลังโหลด...',
  telEmpty: 'กรุณากรอกข้อมูลในโทรศัพท์',
  nameEmpty: 'กรุณากรอกชื่อของคุณ',
  nameInvalid: 'กรุณากรอกชื่อที่ถูกต้อง',
  confirmDelete: 'คุณแน่ใจว่าต้องการลบ',
  telInvalid: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง',
  vanCalendar: {
    end: 'จบ',
    start: 'เริ่ม',
    title: 'การเลือกวันที่',
    confirm: 'ตกลง',
    startEnd: 'เริ่ม/เริ่ม',
    weekdays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    monthTitle: function monthTitle(year, month) {
      return year + "\u0E1B\u0E35" + month + "\u0E40\u0E14\u0E37\u0E2D\u0E19";
    },
    rangePrompt: function rangePrompt(maxRange) {
      return "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + maxRange + " \u0E27\u0E31\u0E19";
    }
  },
  vanCascader: {
    select: 'โปรดเลือก'
  },
  vanContactCard: {
    addText: 'เพิ่มผู้ติดต่อ'
  },
  vanContactList: {
    addText: 'รายชื่อติดต่อใหม่'
  },
  vanPagination: {
    prev: 'หน้าที่แล้ว',
    next: 'หน้าต่อไป'
  },
  vanPullRefresh: {
    pulling: 'ดึงลงเพื่อรีเฟรช...',
    loosing: 'ปล่อยเพื่อรีเฟรช...'
  },
  vanSubmitBar: {
    label: 'รวม：'
  },
  vanCoupon: {
    unlimited: 'ไม่มีเกณฑ์การใช้งาน',
    discount: function discount(_discount) {
      return "\u0E25\u0E14" + _discount;
    },
    condition: function condition(_condition) {
      return "\u0E21\u0E35\u0E08\u0E33\u0E2B\u0E19\u0E48\u0E32\u0E22\u0E43\u0E19\u0E23\u0E32\u0E04\u0E32 " + _condition + " \u0E01\u0E27\u0E48\u0E32\u0E2B\u0E22\u0E27\u0E19";
    }
  },
  vanCouponCell: {
    title: 'คูปอง',
    tips: 'ไม่สามารถใช้ได้',
    count: function count(_count) {
      return "\u0E21\u0E35\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E " + _count + " \u0E23\u0E39\u0E1B";
    }
  },
  vanCouponList: {
    empty: 'ไม่มีคูปอง',
    exchange: 'แลกเปลี่ยน',
    close: 'ห้ามใช้คูปอง',
    enable: 'พร้อมใช้งาน',
    disabled: 'ไม่พร้อมใช้งาน',
    placeholder: 'กรุณากรอกรหัสคูปอง'
  },
  vanAddressEdit: {
    area: 'พื้นที่',
    postal: 'รหัสไปรษณีย์',
    areaEmpty: 'โปรดเลือกภูมิภาค',
    addressEmpty: 'กรุณากรอกที่อยู่โดยละเอียด',
    postalEmpty: 'รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง',
    defaultAddress: 'ตั้งเป็นที่อยู่จัดส่งเริ่มต้น',
    telPlaceholder: 'หมายเลขโทรศัพท์มือถือของผู้รับสินค้า',
    namePlaceholder: 'ชื่อผู้รับ',
    areaPlaceholder: 'เลือกจังหวัด / เมือง / อำเภอ'
  },
  vanAddressEditDetail: {
    label: 'ที่อยู่',
    placeholder: 'เลขที่บ้านเลขที่ห้องชั้นและข้อมูลอื่น ๆ'
  },
  vanAddressList: {
    add: 'เพิ่มที่อยู่'
  }
};
exports.default = _default;