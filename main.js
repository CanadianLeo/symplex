$(document).ready(function () {
    for (var i = 1; i <= 10; i++) {
        if (i == 3) {
            $('#columns').append("<option selected>" + i);
            $('#rows').append("<option selected>" + (i - 1));
        }
        $('#columns').append("<option>" + i);
        $('#rows').append("<option>" + (i - 1));
    }
    setMatrixSize();
});

function setMatrixSize() {
    var needRows = $('#rows').val(),
        needColumns = $('#columns').val();
    if (checkRestrict(needColumns, needRows)) {
        $('#matrix').empty();
        for (var i = 0; i <= needRows; i++) {
            if (i === 0) {
                $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="">');
                for (var j = 1; j <= needColumns; j++) {
                    $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="x' + j + '">');
                }
                $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="const">');
            } else {
                $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="x' + i + '">');
                for (var j = 0; j <= needColumns; j++) {
                    $('#matrix').append('<input type="text" size="3" id="x' + i + (j + 1) + '" class="matrix-input">');
                }
            }
            $('#matrix').append('<br>');
        }
        $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="F">');
        for (var j = 0; j <= needColumns; j++) {
            $('#matrix').append('<input type="text" size="3" id="F' + j + '" class="matrix-input">');
        }
    }
}

function calculate(A) {

    // Oграничения и переменные
    var variable = parseInt(document.getElementById('columns').value);
    var restriction = parseInt(document.getElementById('rows').value);

    // Массив функции
    var mainFunction = [];
    mainFunction.push(0);
    for (var i = 0; i < document.getElementById('columns').value; i++) {
        mainFunction.push(document.getElementById("F" + i).value);
    }

    // Массив симплекс таблицы
    var elementsOfSimplexTable = [];
    for (var i = 1; i < restriction + 1; i++) {
        for (var j = 1; j <= variable + 1; j++) {
            elementsOfSimplexTable.push(document.getElementById('x' + i + j).value);
        }
    }

    if (checkData(elementsOfSimplexTable, mainFunction, variable, restriction)) {

        var mainSimplexTable = [];
        var n = 0;
        for (var i = 0; i < restriction; i++) {
            mainSimplexTable[i] = []
            for (var j = 0; j <= variable; j++) {
                if (new Fraction(elementsOfSimplexTable[variable + (variable + 1)]).s === -1)
                    mainSimplexTable[i][j] = new Fraction(elementsOfSimplexTable[n]).mul(new Fraction(-1));
                else
                    mainSimplexTable[i][j] = elementsOfSimplexTable[n];
                n++;
            }
        }
        makeTheTable();
        finaleTable()
        nextStep();


        function nextStep() {
            var standColumn = null;
            var standElem = null;
            var standLine = null;
            var flag = 0;
            for (var i = 1; i < variable + 1; i++) {
                if (new Fraction(mainSimplexTable[restriction + 1][i]).s === -1) {
                    standColumn = i;
                    break;
                } else {
                    flag++;
                }
                if (flag === variable) {
                    if (new Fraction(mainSimplexTable[restriction + 1][variable + 1]).s === -1)
                        alert('Почему-то не сработало');
                    if (new Fraction(mainSimplexTable[restriction + 1][variable + 1]).n > 0)
                        alert("Система условий задачи противоречива!");
                    if (new Fraction(mainSimplexTable[restriction + 1][variable + 1]).n === 0) {
                        alert("Далее");
                        lastStep();
                    }
                    return;
                }
            }

            var check = 9001;
            for (var i = 1; i <= restriction; i++) {
                if ((new Fraction(mainSimplexTable[i][standColumn]).s === 1) && (new Fraction(mainSimplexTable[i][standColumn]).n !== 0)) {

                    if (new Fraction(mainSimplexTable[i][variable + 1]).div(new Fraction(mainSimplexTable[i][standColumn])) < check) {
                        check = new Fraction(mainSimplexTable[i][variable + 1]).div(new Fraction(mainSimplexTable[i][standColumn]));
                        standLine = i;
                    }
                }
            }
            //шаг 1
            [mainSimplexTable[0][standColumn], mainSimplexTable[standLine][0]] = [mainSimplexTable[standLine][0], mainSimplexTable[0][standColumn]];



            for (var i = 1; i <= restriction + 1; i++) {
                if (i !== standLine) {
                    for (var j = 1; j <= variable + 1; j++) {
                        if (j !== standColumn) {
                            var temp1 = new Fraction(mainSimplexTable[i][standColumn]).mul(new Fraction(mainSimplexTable[standLine][j]));
                            var temp2 = new Fraction(temp1).div(new Fraction(mainSimplexTable[standLine][standColumn]));
                            mainSimplexTable[i][j] = new Fraction(mainSimplexTable[i][j]).sub(new Fraction(temp2));
                        }
                    }
                }
            }
            for (var i = 1; i <= variable + 1; i++) {
                if (i !== standColumn) {
                    mainSimplexTable[standLine][i] = new Fraction(mainSimplexTable[standLine][i]).div(new Fraction(mainSimplexTable[standLine][standColumn]));
                }
            }

            for (var i = 1; i <= restriction + 1; i++) {
                if (i !== standLine) {
                    mainSimplexTable[i][standColumn] = new Fraction(mainSimplexTable[i][standColumn]).div(new Fraction(mainSimplexTable[standLine][standColumn]));
                    mainSimplexTable[i][standColumn] = new Fraction(mainSimplexTable[i][standColumn]).mul(new Fraction(-1));
                }
            }
            alert(mainSimplexTable[standLine][standColumn])

            mainSimplexTable[standLine][standColumn] = new Fraction(1).div(new Fraction(mainSimplexTable[standLine][standColumn]));

            finaleTable()
            nextStep()
        }


        function finaleTable() {
            var text = '<table border=1 class="center-ps">'
            for (var i = 0; i < restriction + 2; i++) {
                text += "<tr>";
                for (var j = 0; j < variable + 2; j++) {
                    if (j > 0 && i > 0) {
                        var tempp = new Fraction(mainSimplexTable[i][j]);
                        mainSimplexTable[i][j] = tempp.toFraction(true)
                    }
                    text += '<td> <p id = "W' + i + j + '">' + mainSimplexTable[i][j] + '</p></td>';
                }
                text += "</tr>";
            }
            text += "</tr> </table><br><br>";
            document.body.innerHTML += text;
        }

        function makeTheTable() {
            var downFlex = [];

            for (var j = 0; j <= variable; j++) {
                var pushTheTempo = 0;
                for (var i = 0; i < restriction; i++) {
                    pushTheTempo += mainSimplexTable[i][j] * -1;
                }
                downFlex.push(pushTheTempo);
            }
            downFlex.unshift(" ")

            var nonEmptyArray = ["X[N]"];
            for (var i = 1; i <= variable; i++) {
                nonEmptyArray.push("X" + i);
            }
            nonEmptyArray.push("Const");

            for (var i = 0; i < restriction; i++) {
                mainSimplexTable[i].unshift("X" + (variable + 1 + i));
            }
            mainSimplexTable.unshift(nonEmptyArray);
            mainSimplexTable.push(downFlex);
        }

        function lastStep() {
            var bazis = [];
            for (var i = 1; i <= restriction; i++) {
                bazis.push(mainSimplexTable[i][0])
                bazis[i - 1] = parseInt(bazis[i - 1].slice(1), 10);
            }

            mainSimplexTable.shift();
            for (var i = 0; i < restriction; i++) {
                for (var j = 1; j < variable + 1; j++) {
                    if ((new Fraction(mainSimplexTable[restriction][j]).n) === 1) {
                        mainSimplexTable[i][j] = "0";
                    }
                }
                mainSimplexTable[i].shift();
            }
            mainSimplexTable.pop();

            for (var i = 0; i < restriction; i++) {
                bazis[i] = bazis[i] - 1;
            }

            var anotherOneArray = [];
            for (var i = 0; i < restriction; i++) {
                anotherOneArray[i] = [];
                for (var j = 0; j < variable + 1; j++) {
                    anotherOneArray[i][j] = mainSimplexTable[i][j];
                }
            }

            for (var i = 0; i < restriction; i++) {
                for (var j = 0; j < variable + 1; j++) {
                    anotherOneArray[i][j] = new Fraction(anotherOneArray[i][j]).mul(new Fraction(mainFunction[bazis[i]]));
                    anotherOneArray[i][j] = new Fraction(anotherOneArray[i][j]).mul(new Fraction('-1'));
                }
            }

            for (var i = 0; i < variable + 1; i++) {
                for (var j = 0; j < restriction; j++) {
                    mainFunction[i] = new Fraction(mainFunction[i]).add(new Fraction(anotherOneArray[j][i]));
                }
            }

            var newNewArray = [];
            newNewArray.length = bazis.length;
            for (var i = 0; i < bazis.length; i++) {
                newNewArray[i] = bazis[i] + 1;
            }

            var finalSimplexTable = [
                ["X[N]"]
            ];
            var temp = [];
            for (var i = 1; i < variable + 1; i++) {
                if (newNewArray.includes(i) === false) {
                    finalSimplexTable[0].push("X" + i);
                }
            }

            finalSimplexTable[0].push("Const")
            for (var i = 0; i < newNewArray.length; i++) {
                temp.push("X" + newNewArray[i])
                for (var j = 0; j < variable + 1; j++) {
                    if (bazis.includes(j) === false) {
                        temp.push(mainSimplexTable[i][j])
                    }
                }
                finalSimplexTable.push(temp);
                temp = [];
            }

            var temp0 = [" "];
            for (var i = 0; i < variable + 1; i++) {
                if (bazis.includes(i) === false) {
                    temp0.push(mainFunction[i]);
                }
            }
            finalSimplexTable.push(temp0);
            mainSimplexTable = finalSimplexTable;
            variable = finalSimplexTable[0].length;
            finaleTable1()
            finalAnswer();

            function finaleTable1() {
                var text = '<table border=1 class="center-ps">'
                for (var i = 0; i < restriction + 2; i++) {
                    text += "<tr>";
                    for (var j = 0; j < variable; j++) {
                        if (j > 0 && i > 0) {
                            var tempp = new Fraction(mainSimplexTable[i][j]);
                            mainSimplexTable[i][j] = tempp.toFraction(true)
                        }
                        text += "<td> <p id = 'P" + i + j + "'>" + mainSimplexTable[i][j] + "</p></td>";
                    }
                    text += "</tr>";
                }
                text += "</tr> </table><br><br>"
                document.body.innerHTML += text;
            }

            function finalAnswer() {
                var answer = 0;
                for (var i = 1; i < variable - 1; i++) {
                    if ((new Fraction(mainSimplexTable[restriction + 1][i]).s) === 1) {
                        alert(new Fraction(mainSimplexTable[restriction + 1][i]).s)
                        answer++;

                        if (answer === variable - 2) {
                            return;
                        }

                    }
                }

                var standColumn = null;
                var standElem = null;
                var standLine = null;
                var flag = 0;
                for (var i = 1; i < variable - 1; i++) {
                    if (new Fraction(mainSimplexTable[restriction + 1][i]).s === -1) {
                        standColumn = i;
                    }
                }

                var check = 9001;
                for (var i = 1; i <= restriction; i++) {
                    if ((new Fraction(mainSimplexTable[i][standColumn]).s === 1) && (new Fraction(mainSimplexTable[i][standColumn]).n !== 0)) {

                        if (new Fraction(mainSimplexTable[i][variable - 1]).div(new Fraction(mainSimplexTable[i][standColumn])) < check) {
                            check = new Fraction(mainSimplexTable[i][variable + 1]).div(new Fraction(mainSimplexTable[i][standColumn]));
                            standLine = i;
                        }
                    }
                }
                //шаг 1
                [mainSimplexTable[0][standColumn], mainSimplexTable[standLine][0]] = [mainSimplexTable[standLine][0], mainSimplexTable[0][standColumn]];



                for (var i = 1; i <= restriction + 1; i++) {
                    if (i !== standLine) {
                        for (var j = 1; j <= variable - 1; j++) {
                            if (j !== standColumn) {
                                var temp1 = new Fraction(mainSimplexTable[i][standColumn]).mul(new Fraction(mainSimplexTable[standLine][j]));
                                var temp2 = new Fraction(temp1).div(new Fraction(mainSimplexTable[standLine][standColumn]));
                                mainSimplexTable[i][j] = new Fraction(mainSimplexTable[i][j]).sub(new Fraction(temp2));
                            }
                        }
                    }
                }
                for (var i = 1; i <= variable - 1; i++) {
                    if (i !== standColumn) {
                        mainSimplexTable[standLine][i] = new Fraction(mainSimplexTable[standLine][i]).div(new Fraction(mainSimplexTable[standLine][standColumn]));
                    }
                }

                for (var i = 1; i <= restriction + 1; i++) {
                    if (i !== standLine) {
                        mainSimplexTable[i][standColumn] = new Fraction(mainSimplexTable[i][standColumn]).div(new Fraction(mainSimplexTable[standLine][standColumn]));
                        mainSimplexTable[i][standColumn] = new Fraction(mainSimplexTable[i][standColumn]).mul(new Fraction(-1));
                    }
                }
                alert(mainSimplexTable[standLine][standColumn]);

                mainSimplexTable[standLine][standColumn] = new Fraction(1).div(new Fraction(mainSimplexTable[standLine][standColumn]));

                finaleTable1()
                finalAnswer()
            }
        }
    }
}

function checkRestrict(variable, restriction) {
    if (parseInt(restriction, 10) >= parseInt(variable, 10)) {
        alert("Ограничений больше, чем нужно");
        return false;
    }
    localStorage["variable"] = variable;
    localStorage["restriction"] = restriction;
    return true;
}

function checkData(elements, mainFunction, n, m) {
    for (var i = 1; i < m * n; i++) {
        var q = parseInt(elements[i]);
        if (isNaN(q)) {
            alert('Некорректные данные');
            return false
        }
    }
    for (var i = 0; i < n - 1; i++) {
        var q = parseInt(mainFunction[i]);
        if (isNaN(q)) {
            alert('Некорректные данные');
            return false
        }
    }
    return true;
}