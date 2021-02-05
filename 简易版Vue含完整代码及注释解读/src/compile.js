import Watcher from './watcher.js';
class Compile{
    constructor(el,vm){
        this.$vm = vm; // mvvm对象
        this.$el = this.isElementNode(el) ? el : document.querySelector(el); // 目标绑定的dom节点
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el); // 将页面中所有节点转化为虚拟节点对象
            this.init(); // 解析指令
            this.$el.appendChild(this.$fragment); // 将解析过的虚拟节点重新插入到dom中
        }
    }
    node2Fragment(el){
        // 创建虚拟节点对象 createDocumentFragment
        var fragment = document.createDocumentFragment(),
            child;

        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    init(){
        this.compileElement(this.$fragment); // 解析指令
    }

    compileElement(el){
        var childNodes = el.childNodes, // 获取子节点列表 NodeList
            self = this;

        [].slice.call(childNodes).forEach(function(node) { // 遍历子节点
            var text = node.textContent; // 获取子节点文本内容
            var reg = /\{\{(.*)\}\}/; // 正则：检测是否 {{}}

            if (self.isElementNode(node)) { // 如果是标签节点
                self.compile(node);

            } else if (self.isTextNode(node) && reg.test(text)) { // 如果是文本节点并且包含{{}}
                // 这里把{{}}当作v-text处理了
                self.compileText(node, RegExp.$1);  // RegExp.$1 代表符合正则的第一个表达式 这里指的应该是文本内容中的第一个{{}}
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    }

    compile(node){
        var nodeAttrs = node.attributes, // 获取标签上的所有属性
            self = this;

        [].slice.call(nodeAttrs).forEach(function(attr) { // 遍历这些属性，来解析指令
            var attrName = attr.name;
            if (self.isDirective(attrName)) { // 如果是指令
                var exp = attr.value; // 获取指令值： v-on~
                var dir = attrName.substring(2); // 获取具体的指令类型
                // 事件指令
                if (self.isEventDirective(dir)) { // 如果是事件类型 on
                    compileUtil.eventHandler(node, self.$vm, exp, dir);
                    // 普通指令
                } else {
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp); // 如果是普通指令
                }

                node.removeAttribute(attrName);
            }
        });
    }

    compileText(node, exp){
        compileUtil.text(node, this.$vm, exp);
    }

    isDirective(attr){ // 判断是是否是指令
        return attr.indexOf('v-') == 0;
    }

    isEventDirective(dir){ // 判断是否是事件指令
        return dir.indexOf('on') === 0;
    }

    isElementNode(node){ // 判断是否是标签节点
        return node.nodeType == 1;
    }

    isTextNode(node){ // 判断是否是文本节点
        return node.nodeType == 3;
    }
}

// 指令处理集合
var compileUtil = {
    text: function(node, vm, exp) {  // node：当前节点, vm：mvvm对象, exp：指令值 如 v-text
        this.bind(node, vm, exp, 'text');
    },

    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var self = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) { // v-model的实现原理，语法糖而已，通过input事件，获取e.target.value
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            self._setVMVal(vm, exp, newValue); // 动态更新对应的变量
            val = newValue;
        });
    },

    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater']; // 获取更新内容的方法

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function(node, vm, exp, dir) {
        var eventType = dir.split(':')[1], // 获取事件类型 click
            fn = vm.$options.methods && vm.$options.methods[exp]; // 获取methods中对应的方法

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal: function(vm, exp) { // 获取当前指令对应变量的值
        var val = vm; // mvvm 对象
        exp = exp.split('.');
        console.log(exp)
        exp.forEach(function(k) {
            val = val[k]; // 这块我觉的最好定义一个新变量
        });
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};


var updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};

export default Compile;