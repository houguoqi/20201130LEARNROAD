import Watcher from './watcher.js';
import Observer from './observer.js';
import Compile from './compile.js';

class Mvvm{
    constructor(options){
        this.$options=options; // 接收参数对象
        this.data=this._data = this.$options.data; // 获取data
        console.log(this.$options)
        var self = this;
        // 数据代理,实现响应，vue3会改写，使用proxy代理方式
        Object.keys(this.data).forEach(function(key) {
            self.defineReactive(key);
        });
        this.initComputed(); // 监听computed

        new Observer(this.data, this); // 订阅者方法，监听所有订阅者，接收data

        this.$compile = new Compile(this.$options.el || document.body, this)
    }
    watch(key,cb,options){
        new Watcher(this,key,cb);
    }
    defineReactive(key){
        var self=this;
        Object.defineProperty(this,key,{
            configurable:false,
            enuselfrable:true,
            get(){
                return self.data[key];
            },
            set(newValue){
                self.data[key]=newValue;
            }
        })
    }
    initComputed(){
        var self = this;
        var computed = this.$options.computed;
        //console.log(Object.prototype.toString.call(computed)==="[object Object]");//输出true
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(self, key, {
                    get: typeof computed[key] === 'function' 
                            ? computed[key]
                            : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
}

export default Mvvm;