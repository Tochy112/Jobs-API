require("dotenv").config()
require("express-async-errors")

//security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

//require express
const express = require("express")
const app = express()

//DB connection
const connectDB = require("./db/connect")
const AuthMiddleware = require("./middleware/aunthentication")


//routers
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")

//middlewares
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware =  require("./middleware/error-handler")

// enables us to read our json files
app.use(express.json())

// secutity packages
app.set("trust proxy", 1)
// app.use(rateLimiter({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	// store: ... , // Redis, Memcached, etc. See below.
// }))
app.use(helmet())
app.use(cors())
app.use(xss())


//routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", AuthMiddleware, jobsRouter)


//call the middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



const port = process.env.PORT | 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        console.log("connected to the db....");
        app.listen(port, () => {
            console.log(`server is running on port ${port}`)
        })
    }catch(e) {
        console.error(e)
    }
}

start()

