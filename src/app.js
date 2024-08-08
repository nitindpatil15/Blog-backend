import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["https://writestoryblog.netlify.app","http://localhost:3000"],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  headers: ["Content-Type", 'Authorization', 'auth-token'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Config settings In CORS() middleware
// for setting limits on data
app.use(express.json({ limit: "50mb" }));

// parse incoming requests in url of browser
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// for any kind of static files, public is folder
app.use(express.static("public"));

// Accessing cookies from user browser which can only  be accessed by server side code using the following method
app.use(cookieParser());

// Routes import
import userRouter from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import commentRouter from "./routes/commentRoutes.js"
import likeRouter from './routes/likeRoutes.js'

// Router Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

export { app };