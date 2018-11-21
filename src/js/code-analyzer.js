/* eslint-disable no-unused-vars */
import * as esprima from 'esprima';
import {generate} from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

export const check = (parsed, table)=>{
    switch (parsed.type) {
    case 'Program':
        (parsed.body).map((x)=> check(x, table));
        break;
    case 'FunctionDeclaration':
        functionDecl(parsed, table);
        (parsed.params).map((x)=> varDecl(x, table));
        (parsed.body.body).map((x)=> check(x, table));
        break;
    case 'VariableDeclaration':
        (parsed.declarations).map((x)=>varDecl(x.id, table));
        break;
    default:
        return check2(parsed, table);
    }
    return table;
};

const check2 = (parsed, table) =>{
    switch (parsed.type) {
    case 'ExpressionStatement':
        assignmentExpDecl(parsed.expression, table);
        break;
    case 'WhileStatement':
        whileDecl(parsed.test, table );
        check(parsed.body, table);
        break;
    case 'Literal':
        return litDecl(parsed);
    case 'Identifier':
        return identifierDecl(parsed);
    default:
        return check3(parsed, table);
    }
};

const check3 = (parsed, table) =>{
    switch (parsed.type) {
    case 'ReturnStatement':
        returnDecl(parsed, table);
        break;
    case 'BlockStatement':
        (parsed.body).map((x)=> check(x, table));
        break;
    case 'BinaryExpression':
        return binaryExpDecl(parsed);
    case 'IfStatement':
        ifDecl(parsed, table);
        break;
    }
};

const buildDecl = (codeToParse, type, cond, val, name, line) => {
    var lineExp = line;
    var typeExp = type;
    var nameExp = name;
    var condition = cond;
    var value = val;
    return [lineExp , typeExp, nameExp, condition, value];
};

const functionDecl = (codeToParse, table) => {
    table.push(buildDecl(codeToParse, 'function declaration', '', '', codeToParse.id.name ,codeToParse.id.loc.start.line));
};

const varDecl = (codeToParse, table) => {
    table.push(buildDecl(codeToParse, 'variable declaration', '', '', codeToParse.name ,codeToParse.loc.start.line));
};

const assignmentExpDecl = (codeToParse, table) =>{
    table.push(buildDecl(codeToParse, 'assignment expression', '', check(codeToParse.right), codeToParse.left.name, codeToParse.loc.start.line));
};

const whileDecl = (codeToParse, table) => {
    var condition = check(codeToParse);
    table.push(buildDecl(codeToParse, 'while statement', condition, '', '' ,codeToParse.loc.start.line));
};

const binaryExpDecl = (codeToParse) =>{
    var condition = check(codeToParse.left) + ' ' + codeToParse.operator +' '+check(codeToParse.right);
    return condition;
};

const ifDecl = (codeToParse, table) => {
    table.push(buildDecl(codeToParse, 'if statement', generate(codeToParse.test), '', '' ,codeToParse.loc.start.line));
    check(codeToParse.consequent, table);
    check(codeToParse.alternate, table);
};

const litDecl = (codeToParse) =>{
    return codeToParse.value;
};

const identifierDecl = (codeToParse) =>{
    return codeToParse.name;
};

const returnDecl = (codeToParse, table) =>{
    var value = generate(codeToParse.argument);
    table.push(buildDecl(codeToParse, 'return statement', '',value, '' ,codeToParse.loc.start.line));
};

export {parseCode};
