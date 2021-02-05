var uid = 0;
class Dep{
    constructor(){
        this.id = uid++; // 订阅者唯一ID
        this.subs = []; // 用于存放订阅者
    }
    addSub(sub){
        this.subs.push(sub); // 添加订阅者方法
    }

    depend(){
        Dep.target.addDep(this); // Dep.target即watcher 用于observe中对每个data中属性进行监听时 向subs中添加对应的watcher
    }

    removeSub(sub) { // 移除某个订阅者
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }
    //后续用来通知订阅者进行更新
    notify(){
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
}

export default Dep;