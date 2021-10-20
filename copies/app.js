var createError = require("http-errors")
var express = require("express")
var path = require("path")
var logger = require("morgan")
const mongoose = require("mongoose")
const passport = require("passport")
const config = require("./config")

const url = config.mongoUrl
const connect = mongoose.connect(url, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

connect.then(
	() => console.log("Connected correctly to server"),
	(err) => console.log(err)
)

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
const campsiteRouter = require("./routes/campsiteRouter")
const promotionRouter = require("./routes/promotionRouter")
const partnerRouter = require("./routes/partnerRouter")

var app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())

app.use("/", indexRouter)
app.use("/users", usersRouter)

app.use(express.static(path.join(__dirname, "public")))

app.use("/campsites", campsiteRouter)
app.use("/promotions", promotionRouter)
app.use("/partners", partnerRouter)

app.use(function (req, res, next) {
	next(createError(404))
})

app.use(function (err, req, res, next) {
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	res.status(err.status || 500)
	res.render("error")
})

module.exports = app
