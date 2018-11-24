import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parserNewJson} from '../src/js/Parser';
describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });


    it('check for null', () => {
        var code='';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table.length,0);

    });

    it('Assignment varies', () => {
        var code='let temp=x;';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'variable declaration');
        assert.equal(table[4],'x');

    });

    it('Assignment varies without let/var', () => {
        var code='temp=x;';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'assignment expression');
        assert.equal(table[2],'temp');
        assert.equal(table[4],'x');

    });

    it('Assignment of several variables in the same row', () => {
        var code='let low, high, mid;';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        var i=0;
        for (i=0;i<table.length;i=i+5){
            assert.equal(table[i],1);
            assert.equal(table[i+1],'variable declaration');
            assert.equal(table[i+4],null);


        }


    });

    it('check if and else', () => {
        var code='if (X < V[mid])\n'+
            'high = mid - 1;\n'+
        'else\n'+
            'low = mid + 1;\n';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'if statement');
        assert.equal(table[3],'X<V[mid]');

    });



    it('check if and some else if', () => {
        var code='if (X < V[mid])\n'+
            'high = mid - 1;\n'+
        'else if (X > V[mid])\n'+
            'low = mid + 1;\n'+
        'else if (high<V[mid])\n'+
            'low=mid+2;\n'+
        'else if (high> V[mid])\n'+
            'low=mid+3\n';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        var i=10;
        for (i=10;i<table.length;i=i+10){
            assert.equal(table[i+1],'else if statment');

        }

    });

    it('check if and some else if and else ', () => {
        var code='if (X < V[mid])\n'+
            'high = mid - 1;\n'+
            'else if (X > V[mid])\n'+
            'low = mid + 1;\n'+
            'else if (high<V[mid])\n'+
            'low=mid+2;\n'+
            'else if (high> V[mid])\n'+
            'low=mid+3\n'+
            'else\n'+
            'low=mid+4';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[table.length-5],10);

    });

    it('check for ', () => {
        var code='for(i=0;i<high;i++){\n'+
            'let x=t;\n'+
        '}';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'for statment');
        assert.equal(table[3],'i=0; i<high; i++');

    });

    it('check for with assignment into the for', () => {
        var code='for(let i=0;i<high;i++){\n'+
            'let x=t;\n'+
            '}';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'for statment');
        assert.equal(table[3],'i=0; i<high; i++');

    });

    it('check while ', () => {
        var code= 'while (low <= high) {\n'+
            'low=low+1;\n'+
        '}';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'while statment');
        assert.equal(table[3],'low<=high');

    });


    it('check function  without return', () => {
        var code= 'function binarySearch(X, V, n){\n'+
        '}';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[0],1);
        assert.equal(table[1],'function declaration');
        assert.equal(table[2],'binarySearch');

    });

    it('check function  with return', () => {
        var code= 'function binarySearch(X, V, n){\n'+
            'return X+V+n\n'+
            '}';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[table.length-1],'X+V+n');
        assert.equal(table[table.length-4],'return statment');
        assert.equal(table[table.length-5],2);

    });

    it('check of all', () => {
        var code= 'function binarySearch(X, V, n){\n'+
            'let low, high, mid;\n'+
            'low = 0;\n'+
            'high = n - 1;\n'+
            'for(let i=0;i<high;i++){\n'+
                'let x=t;\n'+
            '}\n'+
            'while (low <= high) {\n'+
                'mid = (low + high)/2;\n'+
                'if (X < V[mid])\n'+
                    'high = mid - 1;\n'+
                'else if (X > V[mid])\n'+
                    'low = mid + 1;\n'+
                'else\n'+
                    'return mid;\n'+
            '}\n'+
            'return -1;\n'+
        '}';
        var Parser=parseCode(code);
        var table=parserNewJson(Parser);
        assert.equal(table[table.length-5],15);

    });













});
