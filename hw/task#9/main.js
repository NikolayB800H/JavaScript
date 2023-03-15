function sum(val, expr, last) {
    const ans = subsolve(expr, last)
    return [val + ans[0], ans[1]];
}

function sub(val, expr, last) {
    const ans = subsolve(expr, last)
    return [val - ans[0], ans[1]];
}

function mul(val, expr, last) {
    const ans = subsolve(expr, last)
    return [val * ans[0], ans[1]];
}

function div(val, expr, last) {
    const ans = subsolve(expr, last)
    return [val / ans[0], ans[1]];
}

function bolds(expr, last) {
    console.log('['+last)
    ans = subsolve(expr.substring(1), last)
    console.log(ans[0]+'; '+ans[1]+']')
    return subsolve(String(ans[0]) + expr.substring(ans[1] - last + 1), ans[1] + 1)
}

function subsolve(expr, last) {
    //console.log(expr)
    if (expr[0] === '(') return bolds(expr, last + 1);
    let ans = parseInt(expr, 10);
    if (isNaN(ans)) return 666;
    let pos = String(ans).length;
    let oper = expr[pos]
    //console.log(expr.substring(pos + 1))
    switch(oper) {
        case '+': return sum(ans, expr.substring(pos + 1), last + pos + 1);
        case '-': return sub(ans, expr.substring(pos + 1), last + pos + 1);
        case '*': return mul(ans, expr.substring(pos + 1), last + pos + 1);
        case '/': return div(ans, expr.substring(pos + 1), last + pos + 1);
        default: return [ans, last + pos + 1];
    }
}

function solve(expr, x) {
    expr = expr.split('x').join(x);
    return subsolve(expr.replace(/\s/g, ''), -1)[0];
}

let expr = ''
let x = 0

const exp = require("constants");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("Expression: ", function (ans) {
    expr = ans;
    rl.question("Value of x: ", function (ansx) {
        x = ansx;
        console.log("Result: " + solve(expr, x))
        rl.close();
    });
});
