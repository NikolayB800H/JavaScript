class Executor {
    constructor(startVal, exprElemArr) {
        this.result = startVal
        this.exprElemArr = exprElemArr
    }

    start(stack, used) {
        this.stack = stack
        this.used = used
    }

    executeIn(elemPos) {
        this.stack.push(elemPos)
    }

    executeOut() {
        let top = this.stack.pop()
        this.used[top] = true
        return top
    }
}

class Printer extends Executor {
    constructor(exprElemArr) {
        super("", exprElemArr)
        this.boldsStack = []
    }

    start(stack, used) {
        super.start(stack, used)
    }

    executeIn(elemPos) {
        super.executeIn(elemPos)
        if (this.exprElemArr[elemPos] instanceof BoldsOpen) {
            this.boldsStack.push(this.result.length)
        }
    }

    executeLeafOut() {
        let top = super.executeOut()
        this.result += this.exprElemArr[top].asString()
    }

    executePrefixOut() {
        return -1
    }

    executeInfixOut() {
        let elemPos = super.executeOut()
        if (this.exprElemArr[elemPos] instanceof BoldsOpen) {
            let divide = this.boldsStack.pop()
            this.result = this.result.slice(0, divide) + '(' + this.result.slice(divide)
        } else {
            this.result += this.exprElemArr[elemPos].asString()
        }
        return elemPos
    }

    executePostfixOut() {
        return -1
    }
}

class Simplifier extends Executor {
    constructor(exprElemArr) {
        super("", exprElemArr)
        this.calcStack = []
    }

    start(stack, used) {
        super.start(stack, used)
    }

    executeIn(elemPos) {
        super.executeIn(elemPos)
    }

    executeLeafOut() {
        let top = super.executeOut()
        this.calcStack.push(top)
        return top
    }

    executePrefixOut() {
        return -1
    }

    executeInfixOut() {
        let top = super.executeOut()
        super.executeIn(top)
        return top
    }

    executePostfixOut() {
        let top = super.executeOut()
        let right = this.calcStack.pop()
        let left = this.calcStack.pop()
        let toReplace = this.exprElemArr[top]
        this.exprElemArr[top] = toReplace.execute(left, right)
        this.calcStack.push(top)
        if (this.stack.length === 0) {
            this.result = this.exprElemArr[top].asString()
        }
        return top
    }
}

class Operator {
    constructor(exprElemArr) {
        this.parent = -1
        this.left = -1
        this.right = -1
        this.partOf = exprElemArr
    }

    isLeaf() {
        return false;
    }
}

class Add extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    asString() {
        return '+'
    }

    execute(left, right) {
        return new Int(this.partOf[left].data + this.partOf[right].data)
    }
}

class Sub extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    asString() {
        return '-'
    }

    execute(left, right) {
        return new Int(this.partOf[left].data - this.partOf[right].data)
    }
}

class Mul extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    asString() {
        return '*'
    }

    execute(left, right) {
        return new Int(this.partOf[left].data * this.partOf[right].data)
    }
}

class Div extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    asString() {
        return '/'
    }

    execute(left, right) {
        return new Int(this.partOf[left].data / this.partOf[right].data)
    }
}

class BoldsOpen extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.isClosed = false
    }

    asString() {
        if (this.isClosed) {
            return '('
        }
        return '!'
    }

    execute(left, right) {
        return new Int(this.partOf[left].data)
    }
}

class SyntaxTree {
    static states = {VALID : true, INVALID : false}

    constructor(expr) {
        if (typeof(expr) === 'string') {
            this.exprStr = expr.replace(/\s/g, '')
            this.exprElemArr = new Array()
            this.state = SyntaxTree.states.INVALID
            this.root = -1
            this.generateTree()
        } else if (expr instanceof SyntaxTree) {  // Now copy constructor is unused
            this.exprStr = expr.exprStr.slice()
            this.exprElemArr = expr.exprElemArr.slice()
            this.state = expr.state
            this.root = expr.root
        } else {
            this.state = SyntaxTree.states.INVALID
            console.log("Bad constructor argument!")
        }
    }

    solve(varMap) {
        if (!this.state) {
            console.log("Bad syntax!")
            return null
        }
        console.log("Debug log before: " + this.exprStr)
        this.exprElemArr.forEach(function(elem, index, exprElemArr) {
            if (elem instanceof Var) {
                let replacement = varMap[elem.data]
                if (replacement !== undefined) {
                    let tmp = exprElemArr[index].parent
                    exprElemArr[index] = new Int(Number(replacement))
                    exprElemArr[index].parent = tmp
                }
            }
        })
        this.exprStr = this.generateExprStr()
        console.log("Debug log replace: " + this.exprStr)
        let ans = this.traverse(new Simplifier(this.exprElemArr))
        this.exprElemArr = this.exprElemArr.slice(this.root, this.root + 1)
        this.root = 0
        this.exprStr = this.generateExprStr()
        return ans
    }

    sumPrior(asString) {
        switch (asString) {
            case '+': return false;
            case '!': return false;  // Not closed bold
            default: return true;
        }
    }

    subPrior(asString) {
        switch (asString) {
            case '+': return false;
            case '-': return false;
            case '!': return false;  // Not closed bold
            default: return true;
        }
    }

    mulPrior(asString) {
        switch (asString) {
            case '+': return false;
            case '-': return false;
            case '*': return false;
            case '!': return false;  // Not closed bold
            default: return true;
        }
    }

    divPrior(asString) {
        switch (asString) {
            case '+': return false;
            case '-': return false;
            case '*': return false;
            case '/': return false;
            case '!': return false;  // Not closed bold
            default: return true;
        }
    }

    pushDynPrior(operLastPrior, elemNum, priorChecker) {
        let operPos = this.exprElemArr.length
        let ret = 0
        while (elemNum !== -1) {
            let what = this.exprElemArr[elemNum].asString()
            if (!priorChecker(what)) {
                if (what === operLastPrior.asString()) {
                    this.exprElemArr[elemNum].additional.push(operPos)
                    this.exprElemArr[elemNum].right = -1
                    operLastPrior.right = operLastPrior.left
                    operLastPrior.left = operLastPrior.parent
                    this.exprElemArr.push(operLastPrior)
                    return elemNum
                }
                break
            } else if (this.exprElemArr[elemNum].isLeaf()) {
                operLastPrior.left = elemNum
                operLastPrior.parent = this.exprElemArr[elemNum].parent
                this.exprElemArr[elemNum].parent = operPos
                if (operLastPrior.parent !== -1) {
                    this.exprElemArr[operLastPrior.parent].right = operPos
                }
            } else {
                if (operLastPrior.left !== -1) {
                    this.exprElemArr[operLastPrior.left].parent = elemNum
                }
                this.exprElemArr[elemNum].right = operLastPrior.left
                operLastPrior.parent = this.exprElemArr[elemNum].parent
                if (this.exprElemArr[elemNum].parent !== -1) {
                    this.exprElemArr[this.exprElemArr[elemNum].parent].right = operPos
                }
                this.exprElemArr[elemNum].parent = operPos
                operLastPrior.left = elemNum
            }
            ret = operPos
            elemNum = operLastPrior.parent
        }
        this.exprElemArr.push(operLastPrior)
        if (operLastPrior.right !== -1) {
            return operLastPrior.right
        }
        return ret
    }

    pushSum(operLastPrior, elemNum) {
        return this.pushDynPrior(operLastPrior, elemNum, this.sumPrior)
    }

    pushSub(operLastPrior, elemNum) {
        return this.pushDynPrior(operLastPrior, elemNum, this.subPrior)
    }

    pushMul(operLastPrior, elemNum) {
        return this.pushDynPrior(operLastPrior, elemNum, this.mulPrior)
    }

    pushDiv(operLastPrior, elemNum) {
        return this.pushDynPrior(operLastPrior, elemNum, this.divPrior)
    }

    pushMaxPrior(operLastPrior, elemNum) {
        let operPos = this.exprElemArr.length
        operLastPrior.parent = elemNum
        if (elemNum !== -1) {
            this.exprElemArr[elemNum].right = operPos
        }
        this.exprElemArr.push(operLastPrior)
        return operPos
    }

    pushCloseBold(operLastPrior, elemNum) {
        let operPos = this.exprElemArr.length
        for (let i = this.exprElemArr[elemNum];
             elemNum != -1 && !(i instanceof BoldsOpen & i.left === -1);) {
            elemNum = i.parent
            i = this.exprElemArr[elemNum]
        }
        operLastPrior.parent = elemNum
        this.exprElemArr[elemNum].left = this.exprElemArr[elemNum].right
        this.exprElemArr[elemNum].right = operPos
        this.exprElemArr[elemNum].isClosed = true
        this.exprElemArr.push(operLastPrior)
        return operPos
    }

    generateTree() {
        let elemNum = -1
        let pos = 0
        const end = this.exprStr.length
        while (pos != end) {
            switch(this.exprStr[pos]) {
                case '+':
                    elemNum = this.pushSum(new Add(this.exprElemArr), elemNum);
                    ++pos;
                    break;
                case '-':
                    elemNum = this.pushSub(new Sub(this.exprElemArr), elemNum);
                    ++pos;
                    break;
                case '*':
                    elemNum = this.pushMul(new Mul(this.exprElemArr), elemNum);
                    ++pos;
                    break;
                case '/':
                    elemNum = this.pushDiv(new Div(this.exprElemArr), elemNum);
                    ++pos;
                    break;
                case '(':
                    elemNum = this.pushMaxPrior(new BoldsOpen(this.exprElemArr), elemNum);
                    ++pos;
                    break;
                case ')':
                    elemNum = this.pushCloseBold(new BoldsClose(), elemNum);
                    ++pos;
                    break;
                default:
                    let leaf = parseInt(this.exprStr.substring(pos), 10);
                    if (isNaN(leaf)) {
                        leaf = (/^\p{L}[\p{L}\p{Nd}]*/gu).exec(this.exprStr.substring(pos))
                        if (leaf === null) {
                            console.log("Bad variable name:\n\t" + this.exprStr + "\n\t" + "".padStart(pos, '~') + "^")
                            return
                        }
                        elemNum = this.pushMaxPrior(new Var(leaf[0]), elemNum);
                        pos = pos + String(leaf).length;
                    } else {
                        elemNum = this.pushMaxPrior(new Int(leaf), elemNum);
                        pos = pos + String(leaf).length;
                    }
                    break;
            }
        }
        this.root = 0
        while (this.exprElemArr[this.root].parent !== -1) {
            this.root = this.exprElemArr[this.root].parent
        }
        this.state = SyntaxTree.states.VALID
        this.exprStr = this.generateExprStr()
    }

    traverse(executor) {
        let stack = [this.root]
        let used = new Array(this.exprElemArr.length).fill(false)
        executor.start(stack, used)
        while (stack.length !== 0) {
            let top = stack.slice(-1)
            let tmp = this.exprElemArr[top]
            if (this.exprElemArr[top].isLeaf()) {
                executor.executeLeafOut()
            } else {
                if (used[tmp.left]) {
                    if (used[tmp.right]) {
                        executor.executePostfixOut()
                    } else {
                        let infix = executor.executeInfixOut()
                        if (infix !== -1) {
                            executor.executeIn(this.exprElemArr[infix].right)
                        }
                    }
                } else {
                    let prefix = executor.executePrefixOut()
                    if (prefix !== -1) {
                        executor.executeIn(this.exprElemArr[prefix].right)
                    }
                    if (tmp.additional === undefined) {
                        executor.executeIn(tmp.left)
                    } else {
                        used[top] = true
                        tmp.additional.forEach(element => {
                            executor.executeIn(element)
                        });
                        if (!used[tmp.left]) {
                            executor.executeIn(tmp.left)
                        }
                    }
                }
            }
        }
        return executor.result
    }

    generateExprStr() {
        if (!this.state) {
            console.log("Bad syntax!")
            return ""
        }
        let ans = this.traverse(new Printer(this.exprElemArr))
        return ans
    }
}

class Leaf {
    constructor() {
        this.parent = -1
    }

    isLeaf() {
        return true;
    }
}

class BoldsClose extends Leaf {
    asString() {
        return ')'
    }
}

class Int extends Leaf {
    constructor(data) {
        super()
        this.data = data
    }

    asString() {
        return String(this.data)
    }
}

class Var extends Leaf {
    constructor(data) {
        super()
        this.data = data
    }

    asString() {
        return this.data
    }
}

let expr = ''
let x = 0

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question("Expression: ", function (ans) {
    expr = ans;
    rl.question("Value of x: ", function (ansx) {
        x = ansx;
        let exprTree = new SyntaxTree(expr)
        if (exprTree.state) {
            let res = exprTree.solve({'x' : x})
            if (res === null) {
                console.log("Can't solve!")
            } else {
                console.log("Result: " + Number(res).toFixed(3))
            }
        } else {
            console.log("Bad input!")
        }
        rl.close();
    });
});
