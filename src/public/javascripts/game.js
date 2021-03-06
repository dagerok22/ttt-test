(function() {
    let PLAYER_ONE_CLASS = 'cross';
    let PLAYER_TWO_CLASS = 'zero';
    let isMyTurn = true;
    let socket = io({
        transports: ['websocket'],
        upgrade: false,
    });
    let table = $('table');

    let field = getBaseField();

    function getBaseField() {
        let field = [table.find('td').slice(0, 3), table.find('td').slice(3, 6), table.find('td').slice(6, 9)];

        field = field.map(function(row) {
            row = row.map(function(cell) {
                cell = $('#' + row[cell].id);
                cell.click(cellClicked);
                return cell;
            });
            return row;
        });

        return field;
    }

    function cellClicked(e) {
        console.log('cellClicked');
        if (isMyTurn && e.currentTarget.className.length === 0) {
            isMyTurn = false;
            let idSplitted = e.currentTarget.id.split('-');
            socket.emit('player-turn', {
                row: idSplitted[1],
                column: idSplitted[2],
            });
        }
    }

    function updateUI({
        field: newField,
        winner,
    }) {
        console.log('updateUI');
        console.log(newField);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                switch (newField[i][j]) {
                    case 'X':
                        if (!field[i][j].hasClass(PLAYER_TWO_CLASS)) {
                            field[i][j].addClass(PLAYER_ONE_CLASS);
                        }
                        break;
                    case 'O':
                        if (!field[i][j].hasClass(PLAYER_ONE_CLASS)) {
                            field[i][j].addClass(PLAYER_TWO_CLASS);
                        }
                        break;
                    default:
                        field[i][j].removeClass(PLAYER_ONE_CLASS);
                        field[i][j].removeClass(PLAYER_TWO_CLASS);
                        break;
                }
            }
        }
        if (winner) {
            isMyTurn = false;
            $('#result-modal').modal();
            $('.modal-body').html(winner === 'X' ? 'Winner: You' : winner === 'O' ? 'Winner: AI' : 'Draw');
            $('#retry-button').click(function() {
                console.log('retry');
                socket.emit('retry');
            });
            $('#get-stats-button').click(function() {
                socket.emit('save-stats');
            });
        } else {
            isMyTurn = true;
        }
    }


    socket.on('connection-status', function(status) {
        console.log('connection-status');
        $('#status').html(status);
    });
    socket.on('update-field', function(result) {
        console.log('update-field');
        console.log(result);
        if (result) {
            updateUI(result);
        }
    });
    socket.on('update-field-retry', function(result) {
        console.log('update-field-retry');
        if (result) {
            updateUI(result);
        }
    });
    socket.on('stats-saved', function(result) {
        $('#result-modal').modal('hide');
        socket.disconnect();
        window.location.href += `/statistics/${result}`;
        console.log(result);
    });

    $(window).on('beforeunload', function() {
        socket.disconnect();
    });
})();
