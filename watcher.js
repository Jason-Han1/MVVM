function Watcher(vm, exp, cb) {
    this.cb = cb; // 用于更新节点的回调函数
    this.vm = vm;
    this.exp = exp; // 表达式
    this.depIds = {};  // 保存相关dep的对象容器, 属性名是dep的id
    this.value = this.get(); // 表达式所对应的值
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        // 得到最新的值
        var value = this.get();
        // 得老的值
        var oldVal = this.value;
        // 如果不相同
        if (value !== oldVal) {
            // 保存最新的值
            this.value = value;
            // 调用用于更新节点的回调函数
            this.cb.call(this.vm, value, oldVal);
        }
    },

    addDep: function(dep) {
        // 判断关系是否已经建立过, 只有没有建立过才进入
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // 将当前watcher添加到dep中-->建立从dep到watcher的关系
            dep.addSub(this);
            // 将dep添加到watcher中-->建立从watcher到dep的关系
            this.depIds[dep.id] = dep;
        }
    },
    get: function() {
        // 给dep指定当前watcher为其target
        Dep.target = this;
        // 得到当前表达式所对应的属性值(内部会导致get调用, 从而建立dep与watcher之间的关系)
        var value = this.getVMVal();
        // 去掉dep中关联的当前watcher
        Dep.target = null;

        return value;
    },

    getVMVal: function() {
        var exp = this.exp.split('.');
        var val = this.vm._data;
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    }
};