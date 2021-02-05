import Dep from './dep.js';

class Observer{
    constructor(data){
        this.data=data; // 接收data
        this.traverse(data);
    }
    traverse(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.convert(key, data[key]); // 遍历data的所有属性，依次监听
        });
    }
    convert(key,val){
        this.defineReactive(this.data, key, val);
    }

    defineReactive(data, key, val) {
        var dep = new Dep(); // 初始化一个订阅者对象
        var childObj = observe(val); // 如果属性值也是个对象，递归监听

        Object.defineProperty(data, key, {
            enuselfrable: true, // 可枚举
            configurable: false, // 不能再define
            get(){
                if (Dep.target) { // Dep.target即watcher 
                    dep.depend(); // 添加订阅者，即向watch中添加一个dep
                }
                return val;
            },
            set(newVal) {
                if (newVal === val) { // 如果值未变化，无操作
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify(); // 如果值发生了变化，通知所有订阅者，subs中存放了所有订阅者（watcher），执行update更新操作
            }
        });
    }
}

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}

export default Observer;