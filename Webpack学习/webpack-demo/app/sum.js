// sum.js
// 这个模块化写法是 node 环境独有的，浏览器原生不支持使用
// module.exports = function(a, b) {
//   return a + b
// }

export default (a, b) => {
  return a + b
}
