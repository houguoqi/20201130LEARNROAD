# 2020-12-10
将json格式的字符串格式化输出，先将json字符串转为对象，然后将此对象以json格式化输出：
JSON.stringify(JSON.parse(json), null, "\t")
JSON.stringify(JSON.parse(json), null, 4)
::: \t：代表缩进一个tab；4：代表缩进4个空格