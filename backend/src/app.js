import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(helmet());

app.use(cors({
    origin: [
        "http://localhost:8443",
        "http://localhost:3000"
    ],
    credentials: true
}));

app.use(compression());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});

app.use(limiter);

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.get("/", (req,res)=>{
    res.json({
        success:true,
        message:"Backend Running"
    });
});

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    });
});

export default app;