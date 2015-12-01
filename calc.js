function result(str){
    str = str.split('');
    var ma = [];
    var opiration = {};
    str.forEach(function(v, i){
        var last = ma.length - 1;
        v = v.replace(',','.');
        switch(true){
            case /^[0-9]+$/.test(v):
                if(/[0-9,.]/.test(ma[last])){
                    ma[last] = parseFloat(ma[last].toString() + v);
                } else {
                    ma.push(parseFloat(v));
                }
                break;
            case /^[+\-*^/]+$/.test(v):
                ma.push(v);
                break;
            case /^[()]+$/.test(v):
                if(/[a-z]/.test(ma[last]) && ma[last]){
                    ma[last] = ma[last] + v;
                } else {
                    ma.push(v);
                }
                break;
            case /^[a-z]+$/.test(v):
                if(/^[a-z]+$/.test(ma[last])){
                    ma[last] = ma[last] + v;
                } else {
                    ma.push(v);
                }
                break;
            case /^[,.]+$/.test(v):
                ma[last] = ma[last] + v;
                break;
        }
    });
    var stt = '';
    ma.forEach(function(v, i, a){
        var prev = a[i-1];
        if(typeof prev == 'string' && !/^[()+\-/\/*]+$/.test(prev)){
            stt = stt.slice(0, -1)
            stt += '(' + v + ') ';
        } else if(typeof v == 'string' && typeof prev == 'number' &&  /^[(a-z]+$/.test(v)){
            stt += '* ' + v + ' ';
        } else {
            stt += v + ' ';
        }
    });
    return ma;
};
// result('1 / 25 * 1.33tang23 - 4 + (1)');


function polish(str){
    var arr = result(str);
    arr.push('T');
    var res = [];
    var stack = ['T'];

    function level(val){
        var lvl;
        switch(true){
            case /[(T]/.test(val):
                lvl = 0;
                break;
            case /[\^]/.test(val):
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
        var v = arr[i];
        if(v == ' ') continue;

        switch(true){
            case (/[0-9]/.test(v)):
                res.push(v);
                break;

            case (lastStack == '(' && v == ')'):
                stack.pop();
                break;

            case (v == ')'):
                res.push(stack.pop()[0]);
                i--;
                break;

            case (lastStack != 'T' && v == 'T'):
                res.push(stack.pop()[0]);
                i--;
                break;

            case (level(v) == 0 || level(lastStack) == 0 || level(v) < level(lastStack)):
                stack.push(v);
                break;

            case (level(v) >= level(lastStack)):
                res.push(stack.pop()[0]);
                stack.push(v);
                break;
        }
    }
    return res;
}


function polishCalc(str){
    var stack = [];
    function match(cell, newCell){
        stack.splice(-cell);
        stack.push(newCell);
    }
    str.forEach(function(v, i, a){
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
        }
    });
    return stack
}
console.log(polishCalc(polish('1+2*3/(4+5*6)-7')));
