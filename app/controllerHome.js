/*Home Controller*/

angular.module('AppControllers', [])
    .controller('controllerHome', ['RestClient', '$http', '$window',
        function(RestClient, $http, $window) {

            var game = this;
            var empty_cell = '-';

            game.blackboard = [
                [{
                    value: empty_cell
                }, {
                    value: empty_cell
                }, {
                    value: empty_cell
                }],
                [{
                    value: empty_cell
                }, {
                    value: empty_cell
                }, {
                    value: empty_cell
                }],
                [{
                    value: empty_cell
                }, {
                    value: empty_cell
                }, {
                    value: empty_cell
                }]
            ];
            //Disable Cells if we have a winner or if not '-'
            game.disableCell = function(cell) {
                return cell.value !== empty_cell || game.winner;
            };

            var checkForTris = function(cell1, cell2, cell3) {
                return cell1.value === cell2.value &&
                    cell1.value === cell3.value &&
                    cell1.value !== empty_cell;
            };
            //if all the cells are clicked and there is no winner, draw
            var checkForDraw = function() {
                var cellVal = [];

                function checkVal(val) {
                    return val;
                }
                for (var x = 0; x < game.blackboard.length; x++) {
                    for (var i = 0; i < game.blackboard[x].length; i++) {
                        cellVal.push(game.blackboard[x][i].value !== empty_cell);
                    }
                }
                return cellVal.every(checkVal);
            };
            //check row, columns and diags for tris if tris we have winner, if not we have draw
            var checkForEndOfGame = function() {

                for (var x = 0; x < game.blackboard.length; x++) {
                    if (checkForTris(game.blackboard[x][0], game.blackboard[x][1], game.blackboard[x][2])) {
                        var rowMatch = true;
                    }
                    if (checkForTris(game.blackboard[0][x], game.blackboard[1][x], game.blackboard[2][x])) {
                        var columnMatch = true;
                    }
                }
                //Find another way to check Diags
                var diagMatch1 = checkForTris(game.blackboard[0][0], game.blackboard[1][1], game.blackboard[2][2]);
                //Find another way to check Diags
                var diagMatch2 = checkForTris(game.blackboard[0][2], game.blackboard[1][1], game.blackboard[2][0]);


                var winner = rowMatch || columnMatch || diagMatch2 || diagMatch1;
                if (winner) {
                    game.winner = game.currentPlayer
                }
                game.draw = !game.winner && checkForDraw();
                if (game.winner || game.draw) {
                    var match_stats = {
                        date: new Date(),
                        winner_draw: game.winner ? game.winner : game.draw,
                        match: game.blackboard
                    };
                    //save match in DB
                    RestClient.save_match(match_stats, function(response) {
                        console.log(response.data)
                    })

                }
                return game.winner || game.draw;
            };

            var countResultsOverall = function(matches) {
                var winners = {
                    x: 0,
                    o: 0,
                    draw: 0,
                    tot: 0
                }
                for (var i = 0; i < matches.length; i++) {
                    switch (matches[i].winner_draw) {
                        case 'X':
                            winners.x += 1;
                            break;
                        case 'O':
                            winners.o += 1;
                            break;
                        default:
                            winners.draw += 1;
                            break;
                    }
                }
                winners.tot = winners.x + winners.o + winners.draw;
                return winners;

            };

            game.showOldMatches = function() {
                game.show = true;
            };
            game.hideOldMatches = function() {
                game.show = false;
            };
            //show alternitavely X or O
            game.move = function(cell) {
                cell.value = game.currentPlayer;
                if (checkForEndOfGame() === false) {
                    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
                }
            };
            //reset game
            game.restartMatch = function() {
                for (var x = 0; x < game.blackboard.length; x++) {
                    for (var i = 0; i < game.blackboard[x].length; i++) {
                        game.blackboard[x][i].value = empty_cell;
                    }
                }
                game.currentPlayer = 'X';
                game.winner = false;
                game.draw = false;
                RestClient.get_matches(function(response) {
                    game.matches = response.data;
                    var results = countResultsOverall(game.matches);
                    game.over_all = results;
                })
            };
            game.restartMatch();

        }
    ]);
