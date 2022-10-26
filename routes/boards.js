import express from 'express';

const router = express.Router();

let boards = [];

router.get('/', (req, res) => {
    res.send(boards);
    //res.render("index", {board: "boar"});
})

/*router.get('/:boardId', (req, res) => {
    let board = (boards.find((tag) => {return tag.id == req.query.boardId}));
    res.render("index");
});*/

router.get('/get', (req, res) => {
    res.send(boards.find((tag) => {return tag.id == req.query.board}));
});

router.get('/play', (req, res) => {
    res.render("index", {board: boards.find((tag) => {return tag.id == req.query.board}),
    yourname: req.query.player});
});

router.post ("/new", (req, res) => {
    const board = {
        id: req.query.board,
        settings: {
            columns: 10,
            rows: 10,
            required: 5,
            stepTime: 30,
            maxPlayers: 2
        },
        board: [],
        currentPlayerId: 1,
        players: [],
        moves: [],
        hasWinner: false,
        winner: undefined
    }

    for (let i = 0; i < board.settings.rows; i++) {
        board.board.push([]);
        for (let j = 0; j < board.settings.columns; j++) {
            board.board[i].push(0);

        }
        
    }

    boards.push(board);

    res.send({response:`Board with ID ${req.query.boardId} created`,body:board});
    //res.render("index");
});

router.post("/join", (req, res) => {
    let board = boards.find((tag) => {return tag.id == req.query.board});
    if (board.players.length == board.settings.maxPlayers) {
        res.status(403).send({response: "room already full"});
    } else {
        const playerNum = boards.find((tag) => {return tag.id == req.query.board}).players.length+1;

        let player = {
            gamerId: playerNum,
            icon: playerNum,
            name: req.query.player,
            boardId: board.id
        };

        boards.find((tag) => {return tag.id == req.query.board}).players.push(player);

        res.send({response:`Player named ${req.query.player} joined`,body:player,status:200});
    }
});

router.post('/move', (req, res) => {

    let board = boards.find((tag) => {return tag.id == req.query.board});
    let player = board.players.find((tag) => {return tag.name == req.query.player});
    if (board.board[parseInt(req.query.column)][parseInt(req.query.row)] != 0) {
        res.status(403).send({response:"Already occupied"});
        return;
    }
    if (board.currentPlayerId != parseInt(player.gamerId)) {
        res.status(403).send({response:"Not your turn"});
        return;
    }
    board.board[req.query.column][req.query.row] = player.icon;
    board.moves.push({
        turnNo: board.moves.length,
        playerId: board.currentPlayerId,
        tilePos: `${req.query.column};${req.query.row}`
    });


    let directions = [
        [0 , 1],
        [1 , 1],
        [1 , 0],
        [-1 , 1]
    ]

    let required = board.settings.required;
    let rows = board.settings.rows;
    let columns = board.settings.columns;
    //let tilesToCheck = rows * columns - (required-1) * (required-1);
    //let currentTileNumber = 0;

    for (let checkedRow = 0; checkedRow < rows-2; checkedRow++) {
        for (let checkedColumn = 0; checkedColumn < columns-2; checkedColumn++) {
            
            directions.forEach(element => {
                let correctTiles = 0;
                for (let i = 0; i < rows; i++) {
                    if (board.board[checkedRow + element[0] * i ] === undefined) {
                        break;
                    }
                    let tile = board.board[checkedRow + element[0] * i ][checkedColumn + element[1] * i];
                    console.log(tile);
                    if (tile == player.icon) {
                        correctTiles++;
                    }
                    if (correctTiles == required) {
                        board.hasWinner = true;
                        board.winner = player;
                    }
                    
                }
            });

            

        }
        
    }


    if (board.currentPlayerId != board.settings.maxPlayers) {
        board.currentPlayerId++;
    } else {
        board.currentPlayerId = 1;
    }
    res.status(200).send({response:"step done"});
});

export default router;