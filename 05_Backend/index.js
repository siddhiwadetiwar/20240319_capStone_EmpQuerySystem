const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const cors= require('cors')
app.use(cors())
const { connectToDatabase } = require("./database/db");

const authRouter = require("./router/authRouter");
const postRouter = require('./router/postRouter');
const commentRouter = require('./router/commentRouter');

app.use(bodyParser.json());

// Routes
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/comment', commentRouter);


async function startServerAndDatabase() {
    await connectToDatabase();
    app.listen(process.env.PORT || 3000, () =>
        console.log(`Server live at ${process.env.PORT || 3000}`)
    );
}

startServerAndDatabase();