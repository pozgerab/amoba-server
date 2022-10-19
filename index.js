import express from 'express';

import playerRouter from './routes/boards.js';

const app = express();
const PORT = 8080;

app.use(express.static('public'));
app.use( express.json() );
app.set("view engine", "ejs");

app.use("/boards", playerRouter);

app.get("/", (req, res) => {
    //res.send("MAIN PAGE");
    res.render("main");
});

app.listen(
    PORT,
    () => console.log(`its alive on http://localhost:${PORT}`)
)