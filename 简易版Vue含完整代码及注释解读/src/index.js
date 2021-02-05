import Mvvm from './mvvm.js';

new Mvvm({
    el:'#app',
    data:{
        txt:'hello'
    },
    methods: {
        clickMe(){
            this.txt="你好";
        }
    },
    computed: {
        computedTxt(){
            return this.txt+' world';
        }
    },
})