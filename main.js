$(document).ready(function() {
    for (var i = 1; i <= 10; i++) {
        if (i == 3) {
            $('#columns').append("<option selected>" + i);
            $('#rows').append("<option selected>" + i);
        }
        $('#columns').append("<option>" + i);
        $('#rows').append("<option>" + i);
    }
});

function setMatrixSize() {
    $('#matrix').empty();
    var needRows = $('#rows').val(),
        needColumns = $('#columns').val();
    for (var i = 0; i <= needRows; i++) {
        if (i === 0) {
            $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="">');
            $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="const">');
            for (var j = 1; j <= needColumns; j++) {
                $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="x' + j + '">');
            }
        } else {
            $('#matrix').append('<input type="text" size="3" class="matrix-input" disabled value="x' + i + '">');
            for (var j = 0; j <= needColumns; j++) {
                $('#matrix').append('<input type="text" size="3" class="matrix-input">');
            }
        }
        $('#matrix').append('<br>');
    }
}