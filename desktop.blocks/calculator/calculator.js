modules.define(
    'calculator',
    ['i-bem__dom'],
    function (provide, BEMDOM) {
        provide(BEMDOM.decl('calculator', {
            onSetMod: {
                'js': {
                    'inited': function () {
                        var self = this;
                        self.input = this.findBlockInside('input');

                        this.findBlocksInside('button').forEach(function (block) {
                            block.bindTo('click', function () {
                                var btnText = this.domElem.text();
                                var val = self.input.getVal();
                                switch (btnText) {
                                    case 'CE':
                                        val = '';
                                        break;
                                    case '=':
                                        val = self.result;
                                        break;
                                    case 'X':
                                        val += '*';
                                        break;
                                    case '÷':
                                        val += '/';
                                        break;
                                    default:
                                        val += btnText;
                                        break;
                                }
                                self.input.setVal(val);
                                self.input.findBlockInside('input__control').domElem.focus();
                            })
                        });

                        self.input.on('change', this._onChange, this);
                    }
                }
            },
            _onChange: function () {
                this.result = this._polishCalculator(this._toPolish(this.input.getVal()));
                this.findBlockInside('calculator__output').domElem.text(this.result);
            },
            _toPolish: function (string) {
                var array = string.toLowerCase()
                        .replace(/,/g, '.')
                        .match(/[0-9.]+|[a-z]+|[+/\-*()^%]/g),
                    res = [],
                    stack = ['T'];
                if (array === null || string == '') {
                    return string;
                }
                array.push('T');
                array[0].match(/[+/\-*^]/g) && array.unshift('0');

                function level(val) {
                    var regex = [/[(T]/, /[\^%]/, /[*/]/, /[+\-]/],
                        level;
                    regex.forEach(function (v, i) {
                        if (val.match(v)) {
                            level = i;
                        }
                    })
                    return level;
                }

                for (var i = 0; i < array.length; i++) {
                    var lastStack = stack[stack.length - 1];

                    if (array[i] == '-' && /[+/\-*^]/.test(array[i - 1])) {
                        array[i + 1] = -parseFloat(array[i + 1]);
                        array[i] = ' ';
                    }
                    var value = array[i];
                    if (/[0-9]/.test(value)) {
                        res.push(value);
                    } else if (lastStack == '(' && value == ')') {
                        stack.pop();
                    } else if (value == ')' || lastStack != 'T' && value == 'T') {
                        res.push(stack.pop());
                        i--;
                    } else if (level(value) == 0 || level(lastStack) == 0 || level(value) < level(lastStack)) {
                        stack.push(value);
                    } else if (level(value) >= level(lastStack)) {
                        res.push(stack.pop());
                        stack.push(value);
                    }
                }
                return res;
            },
            _polishCalculator: function (equ) {
                if (equ === undefined || equ == '')
                    return equ;
                var stack = [];

                function match(cell, newCell) {
                    stack.splice(-cell);
                    stack.push(newCell);
                }

                equ.forEach(function (value, i, a) {
                    var lv1 = stack[stack.length - 2];
                    var lv2 = stack[stack.length - 1];
                    if (/[0-9]/.test(value)) {
                        stack.push(parseFloat(value));
                    }
                    switch (value) {
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
                            if (a[i + 1] == '*') {
                                match(1, lv2 * 0.01);
                            } else {
                                match(1, lv1 * (lv2 * 0.01));
                            }
                            break;
                    }
                });
                if (stack.length > 1 || isNaN(stack[0])) {
                    stack[0] = 'Ошибка';
                }
                return stack[0]
            }
        }));
    });
