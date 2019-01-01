export {parserNewJson};
let correntLine=1;
let arrayOfTable=[];
let dicFunction={};
dicFunction['FunctionDeclaration']=functionDeclaration;
dicFunction['BlockStatement']=blockStatement;
dicFunction['VariableDeclaration']=variableDeclaration;
dicFunction['VariableDeclarator']=variableDeclarator;
dicFunction['Identifier']=identifier;
dicFunction['Literal']=literal;
dicFunction['ExpressionStatement']=expressionStatement;
dicFunction['AssignmentExpression']=assignmentExpression;
dicFunction['BinaryExpression']=binaryExpression;
dicFunction['WhileStatement']=whileStatement;
dicFunction['IfStatement']=ifStatement;
dicFunction['MemberExpression']=memberExpression;
dicFunction['ReturnStatement']=returnStatement;
dicFunction['UnaryExpression']=unaryExpression;
dicFunction['Program']=program;
dicFunction['ForStatement']=forStatement;
dicFunction['UpdateExpression']=updateExpression;





function parserNewJson(parserJson) {
    if(parserJson!=null && parserJson.type!=null){
        if(parserJson.type=='Program'){
            var array=program(parserJson);
            arrayOfTable=[];
            correntLine=1;
            return array;
        }
        else{
            var correntFun=dicFunction[parserJson.type];
            if(isFunctionWithTwoArg(parserJson.type) )
                return correntFun(parserJson,'if statement');
            else
                return correntFun(parserJson);
        }
    }
    else
        return parserJson;
}

function isFunctionWithTwoArg(type) {
    switch (type) {
    case 'VariableDeclaration':
        return true;
    case 'VariableDeclarator':
        return true;
    case 'AssignmentExpression':
        return true;
    case 'IfStatement':
        return true;
    default:
        return false;  
    }
}



function functionDeclaration(parserJson) {
    arrayOfTable.push(correntLine, 'function declaration', parserNewJson(parserJson.id), '', '');
    for (var i = 0; i < parserJson.params.length; i++) {
        arrayOfTable.push(correntLine, 'variable declaration', parserNewJson(parserJson.params[i]), '', '');
    }
    correntLine += 1;
    return parserNewJson(parserJson.body);
}

function blockStatement(parserJson) {
    for (var i = 0; i < parserJson.body.length; i++) {
        parserNewJson(parserJson.body[i]);
    }
}

function variableDeclaration(parserJson,type) {
    if(type=='for statment'){
        return variableDeclarator(parserJson.declarations[0],'for statment');
    }
    else{
        for (var i = 0; i < parserJson.declarations.length; i++) {
            parserNewJson(parserJson.declarations[i]);
        }
        correntLine += 1;
    }

}

function variableDeclarator(parserJson,type) {
    if(type=='for statment'){
        return parserNewJson(parserJson.id)+'='+parserNewJson(parserJson.init);
    }
    else{
        arrayOfTable.push(correntLine, 'variable declaration', parserNewJson(parserJson.id), '', parserNewJson(parserJson.init));
    }

}

function identifier(parserJson) {
    return parserNewJson(parserJson.name);
}

function literal(parserJson) {
    return parserNewJson(parserJson.value);
}

function expressionStatement(parserJson) {
    parserNewJson(parserJson.expression);
    correntLine += 1;
}

function assignmentExpression(parserJson,type) {
    if(type=='for statment'){
        return parserNewJson(parserJson.left)+parserJson.operator+parserNewJson(parserJson.right);
    }
    else{
        arrayOfTable.push(correntLine, 'assignment expression', parserNewJson(parserJson.left), '', parserNewJson(parserJson.right));
    }

}

function binaryExpression(parserJson) {
    return parserNewJson(parserJson.left)+parserJson.operator+parserNewJson(parserJson.right);
}

function whileStatement(parserJson) {
    arrayOfTable.push(correntLine, 'while statment', '',parserNewJson(parserJson.test), '');
    correntLine += 1;
    return parserNewJson(parserJson.body);
}

function ifStatement(parserJson,type) {
    arrayOfTable.push(correntLine, type, '',parserNewJson(parserJson.test), '');
    correntLine += 1;
    parserNewJson(parserJson.consequent);
    if(parserJson.alternate !=null){
        if(parserJson.alternate.type == 'IfStatement'){
            ifStatement(parserJson.alternate,'else if statment');
        }
        else{
            arrayOfTable.push(correntLine, 'else', '', '', '');
            correntLine += 1;
            parserNewJson(parserJson.alternate);
        }


    }
}
function returnStatement(parserJson) {
    arrayOfTable.push(correntLine, 'return statment', '', '', parserNewJson(parserJson.argument));
    correntLine += 1;

}

function memberExpression(parserJson) {
    return parserNewJson(parserJson.object) + '[' + parserNewJson(parserJson.property) + ']';

}

function unaryExpression(parserJson) {
    return parserJson.operator + parserNewJson(parserJson.argument);
}


function program(parserJson) {
    for (var i = 0; i < parserJson.body.length; i++) {
        parserNewJson(parserJson.body[i]);
    }
    return arrayOfTable;

}

function forStatement(parserJson) {
    if(parserJson.init.type=='VariableDeclaration'){
        arrayOfTable.push(correntLine, 'for statment', '',variableDeclaration(parserJson.init,'for statment')+'; '+parserNewJson(parserJson.test)+'; '+parserNewJson(parserJson.update), '');
    }
    else{
        arrayOfTable.push(correntLine, 'for statment', '',assignmentExpression(parserJson.init,'for statment')+'; '+parserNewJson(parserJson.test)+'; '+parserNewJson(parserJson.update), '');
    }

    correntLine += 1;
    return parserNewJson(parserJson.body);
}

function updateExpression(parserJson) {
    return parserNewJson(parserJson.argument)+parserJson.operator;
}










