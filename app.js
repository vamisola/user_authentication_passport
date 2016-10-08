var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");
    
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/auth_demo_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.use(require("express-session")({
    secret: "bellabelleMC is the best MC player",
    resave: false,
    saveUninitialized: false
}));
//need these two lines everytime we use passport 
app.use(passport.initialize());
app.use(passport.session());

//two methods on passport -responsible for reading the sessions (encoding and unencoding)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===============
//ROUTES
//===============



app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req,res){
    res.render("secret");
});


//===============
//Auth Routes
//===============


//show sign up form
app.get("/register",function (req,res){
    res.render("register");
});

//handling user sign up
app.post("/register", function(req,res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        //change to facebook or twitter --->> passport.authenticate("facebook")(req, res, function(){
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});


//Login Routes

//render login form

app.get("/login", function(req,res){
    res.render("login");
});

//post route - login logic
//middleware - code that run before callback
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req,res){
    
});

//logout Route

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});


//middleware to check if ur loggedin
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started...");
});