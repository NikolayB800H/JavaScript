class Executor {
    constructor(startVal) {
        this.result = startVal
    }

    execute() {}  // execute must be appended in derived classes
}

class Printer extends Executor {
    constructor() {
        super("")
    }

    execute(toAdd) {
        this.result += toAdd.asString()
    }
}

class Operator {
    constructor(exprElemArr) {
        this.parent = -1
        this.left = -1
        this.right = -1
        //console.log(exprElemArr)
        this.partOf = exprElemArr
        //console.log(this.partOf)
    }

    isLeaf() {
        return false;
    }

    getChildSimple(lrIndex) {
        let elem = 0
        if (this.partOf[lrIndex].isLeaf()) {
            elem = this.partOf[lrIndex].data
        } else {
            elem = this.partOf[lrIndex].simplify(lrIndex)
        }
        this.partOf[lrIndex] = undefined
        return elem
    }

    simplify(pos, replacer) {
        let left = this.left
        let right = this.right
        this.partOf[pos] = replacer(this)
        this.partOf[left] = undefined
        this.partOf[right] = undefined
        return this.partOf[pos].data
    }
}

class Add extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    asString() {
        let ret = '+'
        /*this.additional.forEach(element => {
            ret += this.partOf[this.partOf[element].left].asString() + '+'
        });*/
        return ret
    }

    getSelfReplacement(super_) {
        return new Int(super_.getChildSimple(super_.right) + super_.getChildSimple(super_.left))
    }

    simplify(pos) {
        let ret = super.simplify(pos, this.getSelfReplacement)
        this.additional.forEach(element => {
            let cur = this.partOf[element]
            ret += cur.getChildSimple(cur.right)
            this.partOf[cur.right] = undefined
            this.partOf[element] = undefined
        });
        this.partOf[pos].data = ret
        return ret
    }
}

class Sub extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    asString() {
        let ret = '-'
        /*this.additional.forEach(element => {
            ret += this.partOf[this.partOf[element].left].asString() + '-'
        });*/
        return ret
    }

    getSelfReplacement(super_) {
        return new Int(super_.getChildSimple(super_.left) - super_.getChildSimple(super_.right))
    }

    /*simplify(exprElemArr, pos) {
        return super.simplify(exprElemArr, pos, this.getSelfReplacement)
    }*/
    simplify(pos) {
        let ret = super.simplify(pos, this.getSelfReplacement)
        this.additional.forEach(element => {
            let cur = this.partOf[element]
            ret -= cur.getChildSimple(cur.right)
            this.partOf[cur.right] = undefined
            this.partOf[element] = undefined
        });
        this.partOf[pos].data = ret
        return ret
    }
}

class Mul extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    /*asString() {
        return '*'
    }*/
    asString() {
        let ret = '*'
        //console.log(this.additional)
        //console.log(this.partOf)
        /*this.additional.forEach(element => {
            ret += this.partOf[this.partOf[element].left].asString() + '*'
        });*/
        return ret
    }

    getSelfReplacement(super_) {
        return new Int(super_.getChildSimple(super_.right) * super_.getChildSimple(super_.left))
    }

    /*simplify(exprElemArr, pos) {
        return super.simplify(exprElemArr, pos, this.getSelfReplacement)
    }*/
    simplify(pos) {
        let ret = super.simplify(pos, this.getSelfReplacement)
        this.additional.forEach(element => {
            let cur = this.partOf[element]
            ret *= cur.getChildSimple(cur.right)
            this.partOf[cur.right] = undefined
            this.partOf[element] = undefined
        });
        this.partOf[pos].data = ret
        return ret
    }
}

class Div extends Operator {
    constructor(exprElemArr) {
        super(exprElemArr)
        this.additional = []
    }

    /*asString() {
        return '/'
    }*/
    asString() {
        let ret = '/'
        /*this.additional.forEach(element => {
            ret += this.partOf[this.partOf[element].left].asString() + '/'
        });*/
        return ret
    }

    getSelfReplacement(super_) {
        return new Int(super_.getChildSimple(super_.left) / super_.getChildSimple(super_.right))
    }

    /*simplify(exprElemArr, pos) {
        return super.simplify(exprElemArr, pos, this.getSelfReplacement)
    }*/
    simplify(pos) {
        let ret = super.simplify(pos, this.getSelfReplacement)
        this.additional.forEach(element => {
            let cur = this.partOf[element]
            ret /= cur.getChildSimple(cur.right)
            this.partOf[cur.right] = undefined
            this.partOf[element] = undefined
        });
        this.partOf[pos].data = ret
        return ret
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

    getSelfReplacement(super_) {
        return new Int(new Number(super_.partOf[super_.left].simplify(super_.partOf, super_.left)))
    }

    simplify(pos) {
        return super.simplify(pos, this.getSelfReplacement)
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
        } else if (expr instanceof SyntaxTree) {
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
        this.simplify()
        //return this.exprElemArr[this.root].asString()
        this.exprStr = this.generateExprStr()
        console.log("Debug log simplify: " + this.exprStr)
        return this.exprStr
    }

    simplify() {
        if (!this.state) {
            console.log("Bad syntax!")
            return
        }
        if (this.exprElemArr[this.root].isLeaf()) {
            return
        }
        this.exprElemArr[this.root].simplify(this.root)
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
        //console.log(elemNum)
        let operPos = this.exprElemArr.length
        let ret = 0
        while (elemNum !== -1) {
            let what = this.exprElemArr[elemNum].asString()
            if (!priorChecker(what)) {
                if (what === operLastPrior.asString()) {
                    this.exprElemArr[elemNum].additional.push(operPos)
                    this.exprElemArr[elemNum].right = -1
                    //operPos = elemNum
                    //ret = elemNum
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
            //console.log("New: "+elemNum)
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
            //console.log(this.exprElemArr)
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
        let top = 0
        let used = new Array(this.exprElemArr.length).fill(false)
        while (stack.length !== 0) {
            if (this.exprElemArr[stack[top]].isLeaf()) {
                let tmp = stack.pop()
                executor.execute(this.exprElemArr[tmp])
                used[tmp] = true
                --top
            } else {
                let next = this.exprElemArr[stack[top]].left
                if (used[next]) {
                    let tmp = stack.pop()
                    executor.execute(this.exprElemArr[tmp])
                    used[tmp] = true
                    stack.push(this.exprElemArr[tmp].right)
                } else {
                    let tmp = this.exprElemArr[stack[top]]
                    if (tmp.additional === undefined) {
                        stack.push(tmp.left)
                        ++top
                    } else {
                        used[stack[top]] = true
                        tmp.additional.forEach(element => {
                            stack.push(element)
                        });
                        if (!used[tmp.left]) stack.push(tmp.left)
                        top += tmp.additional.length + 1
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
        let ans = this.traverse(new Printer())
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
