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
        board: [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ],
        settings: {
            columns: 3,
            rows: 3,
            needed: 3,
            stepTime: 30,
            maxPlayers: 2
        },
        currentPlayerId: 1,
        players: [],
        moves: []
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
    if (board.currentPlayerId != board.settings.maxPlayers) {
        board.currentPlayerId++;
    } else {
        board.currentPlayerId = 1;
    }
    res.status(200).send({response:"step done"});
});

export default router;