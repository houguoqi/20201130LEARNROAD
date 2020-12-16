# 2020-12-10 将json格式的字符串格式化输出
将json格式的字符串格式化输出，先将json字符串转为对象，然后将此对象以json格式化输出：  
1. JSON.stringify(JSON.parse(json), null, "\t")  
2. JSON.stringify(JSON.parse(json), null, 4)  
其中\t：代表缩进一个tab；4：代表缩进4个空格
# 2020-12-10 JS函数字符串转函数
1. eval()  
let funcStr = "function test(value){alert(value)}";  
let test = eval("(false || "+funcStr+")");  
test("函数能够执行");  
2. new Function()  
new Function ([arg1[, arg2[, ...argN]],] functionBody)  
let funcStr = "function test(value){alert(value)}";  
let funcTest = new Function('return '+funcStr);  
funcTest()("函数也能够执行")  
# 2020-12-16 判断对象是否有某个字段
foo.hasOwnProperty("bar")  
Object.prototype.hasOwnProperty.call(foo, "bar")  