/*
相当于Vue构造函数
 */
function MVVM(options) {
  // 保存配置对象到vm中
  this.$options = options;
  // 保存data数据对象到vm和变量data中
  var data = this._data = this.$options.data;
  // 保存vm到me变量
  var me = this;

  // 遍历data中所有属性
  Object.keys(data).forEach(function (key) { // key就是属性名: name
    // 对key属性实现代理
    me._proxy(key);
  });

  // 监视/劫持data中所有层次的属性
  observe(data, this);

  // 创建一个用于编译模板的对象
  this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxy: function (key) {
    // 保存vm
    var me = this;
    // 给vm添加指定名称的属性(使用属性描述符)
    Object.defineProperty(me, key, {
      configurable: false, // 不能重新定义
      enumerable: true, // 可以枚举
      // 当通过vm.xxx读取属性值时自动调用
      get: function proxyGetter() {
        // 返回属性值: 读取vm中保存的data中对应的属性值
        return me._data[key];
      },
      // 当通过vm.xxx = value设置新的属性值时自动调用
      set: function proxySetter(newVal) {
        // 将设置的新值保存到vm中的data听对应属性上
        me._data[key] = newVal;
      }
    });
  }
};