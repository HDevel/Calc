modules.define(
    'calculator',
    ['i-bem__dom'],
    function(provide, BEMDOM) {
        provide(BEMDOM.decl('calculator', {
            onSetMod: {
                'js': {
                    'inited': function() {
                        var self = this;
                        self.input = this.findBlockInside('input');

                        this.findBlocksInside('button').forEach(function (block) {
                            block.bindTo('click',function(){
                                var btnText = this.domElem.text();
                                var val = self.input.getVal();
                                switch(btnText){
                                    case 'CE':
                                        val = '';
                                        break;
                                    case '=':
                                        val = self.result;
                                        break;
                                    default:
                                        val += btnText;
                                        break;
                                }
                                self.input.setVal(val);
                            })
                        });

                        self.input.on('change', this._onChange, this);
                    }
                }
            },
            _onChange: function() {
                this.result = this._polishCalculator(this._toPolish(this.input.getVal()));
                this.findBlockInside('calculator__output').domElem.text(this.result);
            },
            _toPolish: function(str){
                var arr = str.toLowerCase()
                        .replace(/,/g,'.')
                        .replace(/÷/g,'/')
                        .match(/[0-9.]+|[a-z]+|[+/\-*()^%]/g),
                    res = [],
                    stack = ['T'];
                if(arr === null || str == '')
                return str;
                arr.push('T');
                arr[0].match(/[+/\-*^]/g) && arr.unshift('0');

                function level(val){
                    var lvl;
                    switch(true){
                        case /[(T]/.test(val):
                            lvl = 0;
                            break;
                        case /[\^%]/.test(val):
                            lvl = 1;
                            break;
                        case /[*/]/.test(val):
                            lvl = 2;
                            break;
                        case /[+\-]/.test(val):
                            lvl = 3;
                            break;
                    }
                    return lvl
                }
                for(var i = 0; i < arr.length; i++){
                    var lastStack = stack[stack.length - 1];

                    if(arr[i] == '-' && /[+/\-*^]/.test(arr[i - 1])){
                        arr[i + 1] = -parseFloat(arr[i + 1]);
                        arr[i] = ' ';
                    }
                    var v = arr[i];
                    if(v == ' ') continue;
                    switch(true){
                        case (/[0-9]/.test(v)):
                            res.push(v);
                            break;

                        case (lastStack == '(' && v == ')'):
                            stack.pop();
                            break;

                        case (v == ')' || lastStack != 'T' && v == 'T'):
                            res.push(stack.pop());
                            i--;
                            break;

                        case (level(v) == 0 || level(lastStack) == 0 || level(v) < level(lastStack)):
                            stack.push(v);
                            break;

                        case (level(v) >= level(lastStack)):
                            res.push(stack.pop());
                            stack.push(v);
                            break;
                    }
                }
                return res;
            },
            _polishCalculator: function(equ){
                if(equ === undefined || equ == '')
                    return equ;
                var stack = [];
                function match(cell, newCell){
                    stack.splice(-cell);
                    stack.push(newCell);
                }
                equ.forEach(function(v, i, a){
                    var lv1 = stack[stack.length - 2];
                    var lv2 = stack[stack.length - 1];
                    if(/[0-9]/.test(v)){
                        stack.push(parseFloat(v));
                    }
                    switch(v){
                        case '+':
                            match(2, lv1 + lv2);
                            break;
                        case '*':
                            match(2, lv1 * lv2);
                            break;
                        case '-':
                            match(2, lv1 - lv2);
                            break;
                        case '/':
                            match(2, lv1 / lv2);
                            break;
                        case '^':
                            match(2, Math.pow(lv1, lv2));
                            break;
                        case '%':
                            if(a[i+1] == '*'){
                                match(1, lv2 * 0.01);
                            } else {
                                match(1, lv1 * (lv2 * 0.01));
                            }
                            break;
                    }
                });
                if(stack.length > 1 || isNaN(stack[0])){
                    stack[0] = 'Ошибка';
                }
                return stack[0]
            }
        }));
    });
