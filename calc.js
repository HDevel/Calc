function polish(str){
    var arr = str.toLowerCase().match(/[0-9.,]+|[a-z]+|[+/\-*()^]/g),
        res = [],
        stack = ['T'];
    arr.push('T');

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
