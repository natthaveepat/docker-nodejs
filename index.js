const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const session = require("express-session");
const cors = require("cors");
let RedisStore = require("connect-redis")(session);

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

let redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT,
    }
});
redisClient.connect().catch(console.error)

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
console.log(`mongoURL: ${mongoURL}`);

const connectWithRetry = () => {
  mongoose
    .connect(
      mongoURL
      // {
      // useNewUrlParams: true,
      // userUnifiedTopology: true,
      // useFindAndModify: false,
      // }
    )
    .then(() => console.log("Successfully Connected to MongoDB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi There!#$!</h2>");
  console.log("yeah it ran");
});

//localhost:3000/api/v1/posts/
app.use("/api/v1/posts", postRouter);

app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on Port${port}`));