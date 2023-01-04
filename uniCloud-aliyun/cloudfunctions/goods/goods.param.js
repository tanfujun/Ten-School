// 本文件中的内容将在云对象【运行】时解析为运行参数
// 配置教程参考：https://uniapp.dcloud.net.cn/uniCloud/rundebug.html#run-obj-param
const clientInfo = { // 模拟clientInfo
  uniPlatform: 'web',
  source: 'client', // 调用来源，不传时默认为 client
  clientIP: '127.0.0.1', // 客户端ip，不传时默认为 127.0.0.1
  userAgent: 'xx MicroMessenger/xxx', // 客户端ua，不传时默认为 HBuilderX
  uniIdToken: 'xxx'
}
getCategory()