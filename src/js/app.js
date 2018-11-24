import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parserNewJson} from './Parser';

var ansTable = document.getElementById('Table');
var correntRow;
var tableRows = ansTable.getElementsByTagName('tr');
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        var rowCount = tableRows.length;
        if(rowCount>0){
            for (var x=rowCount-1; x>0; x--) {
                ansTable.deleteRow(x);
            }
        }
        correntRow=ansTable.insertRow(ansTable.rows.length);
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let arrayTable=parserNewJson(parsedCode);
        var i=0;
        for (i=0;i<arrayTable.length;i=i+5){
            addRowToTable(arrayTable[i], arrayTable[i+1], arrayTable[i+2], arrayTable[i+3], arrayTable[i+4]);
            correntRow=ansTable.insertRow(ansTable.rows.length);
        }
    });
});


function addRowToTable(line,type,name,condition,value){
    addColToTable(0,line);
    addColToTable(1,type);
    addColToTable(2,name);
    addColToTable(3,condition);
    addColToTable(4,value);
}




function addColToTable(col,value) {
    var correntCol  = correntRow.insertCell(col);
    var ValueOfCol  = document.createTextNode(value);
    correntCol.appendChild(ValueOfCol);
}