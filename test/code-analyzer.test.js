import assert from 'assert';
import {check, parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('1. is parsing a function with variable declaration and assignment statement correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('function x(){ let x; x = 9; return 1; }'), [])),
            '[[1,"function declaration","x","",""],[1,"variable declaration","x","",""],[1,"assignment expression","x","",9],[1,"return statement","","","1"]]'
        );
    });

    it('2. is parsing a function with an if and return statements correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('function ex(x){\n' +'    if(x>7){\n' +'      return 1;\n' +'    }\n' +'    else\n' +'      return 2;\n' +'}'), [])),
            '[[1,"function declaration","ex","",""],[1,"variable declaration","x","",""],[2,"if statement","","x > 7",""],[3,"return statement","","","1"],[6,"return statement","","","2"]]'
        );
    });

    it('3. is parsing an empty function correctly', () => {
        assert.equal(JSON.stringify(check(parseCode(''), [])),
            '[]'
        );
    });

    it('4. is parsing a simple function declaration correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('function x(){}'), [])),
            '[[1,"function declaration","x","",""]]'
        );
    });

    it('5. is parsing a simple assignment declaration correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('x = 2; y = 3;'), [])),
            '[[1,"assignment expression","x","",2],[1,"assignment expression","y","",3]]'
        );
    });

    it('6. is parsing parameterized function, while, var declaration, and assignment statements correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('function ex(x){\n' +' let y = 5;\n' +' while(x<4){\n' +'   y = y + 1;\n' +' } \n' +' return y;\n' +'}'), [])),
            '[[1,"function declaration","ex","",""],[1,"variable declaration","x","",""],[2,"variable declaration","y","",""],[3,"while statement","","x < 4",""],[4,"assignment expression","y","","y + 1"],[6,"return statement","","","y"]]'
        );
    });

    it('7. is parsing a simple variable declaration correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('let a = 1;'), [])),
            '[[1,"variable declaration","a","",""]]'
        );
    });

    it('8. is parsing a function with for statement correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('function ex(){\n' + '\tlet a = 3;\n' + '    for(let i = 0; i < 6; i = i + 1){\n' + '     \ta = a * 3;\n' + '    }\t\n' + ' }'), [])),
            '[[1,"function declaration","ex","",""],[2,"variable declaration","a","",""]]'
        );
    });

    it('9. is parsing an empty function correctly', () => {
        assert.equal(JSON.stringify(check(parseCode(''), [])),
            '[]'
        );
    });

    it('10. is parsing the binarySearch function', () => {
        assert.equal(JSON.stringify(check(parseCode('function binarySearch(X, V, n){\n' +'    let low, high, mid;\n' +'    low = 0;\n' +'    high = n - 1;\n' +'    while (low <= high) {\n' +'        mid = (low + high)/2;\n' +'        if (X < V[mid])\n' +'            high = mid - 1;\n' +'        else if (X > V[mid])\n' +'            low = mid + 1;\n' +'        else\n' +'            return mid;\n' +'    }\n' +'    high = 2;\n' +'    let y = V[mid];\n' +'    return -1;\n' +'}'), [])),
            '[[1,"function declaration","binarySearch","",""],[1,"variable declaration","X","",""],[1,"variable declaration","V","",""],[1,"variable declaration","n","",""],[2,"variable declaration","low","",""],[2,"variable declaration","high","",""],[2,"variable declaration","mid","",""],[3,"assignment expression","low","",0],[4,"assignment expression","high","","n - 1"],[5,"while statement","","low <= high",""],[6,"assignment expression","mid","","low + high / 2"],[7,"if statement","","X < V[mid]",""],[8,"assignment expression","high","","mid - 1"],[9,"if statement","","X > V[mid]",""],[10,"assignment expression","low","","mid + 1"],[12,"return statement","","","mid"],[14,"assignment expression","high","",2],[15,"variable declaration","y","",""],[16,"return statement","","","-1"]]'
        );
    });

    it('11. is parsing a function with 3 variable declarations correctly', () => {
        assert.equal(JSON.stringify(check(parseCode('function x(){ let x, y, z; }'), [])),
            '[[1,"function declaration","x","",""],[1,"variable declaration","x","",""],[1,"variable declaration","y","",""],[1,"variable declaration","z","",""]]'
        );
    });
});