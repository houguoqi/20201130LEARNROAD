import Dep from './dep.js';

class Watcher{
    constructor(vm, expOrFn, cb){
        this.cb = cb; // 更新操作回调函数
        this.vm = vm; // mvvm对象
        this.expOrFn = expOrFn; // 指令值
        this.depIds = {};

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }

        this.value = this.get();
    }
    update(){ // 每个订阅者所带的更新操作
        this.run();
    }
    run(){ // 订阅者被通知更新时执行的具体方法
        var value = this.get();
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }
    addDep(dep){ // 添加订阅者
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }
    get() {
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        return value;
    }

    parseGetter(exp){
        if (/[^\w.$]/.test(exp)) return;

        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
    }
}

export default Watcher;