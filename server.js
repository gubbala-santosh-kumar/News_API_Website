//Using All the Modules express, path, firebase-admin, bcrypt, body-parser

const express = require('express');

const path = require('path');

const admin = require('firebase-admin');

const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

//Setting THE EJS Engine
app.set('view engine','ejs');

//Getting dynamic paths
app.use('/static',express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Firebase generated Key.

const serviceAccount = require('./key.json');

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Routes for LOGIN SIGNUP DASHBOARD

app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.get('/dashboard_',(req,res)=>{
    res.render('dashboard_');
})
//DASHBOARD NEWS API CALLING......
app.get('/dashboard', async (req, res) => {
    const API_KEY = '48e7137198ec4149bd8304dca04e4bf3';
    const ARTICLE_NAME = req.query.search;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(ARTICLE_NAME)}&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        
        res.render('dashboard', { articles: data.articles, search: ARTICLE_NAME }); // Pass articles and search query to template
        console.log(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the news');
    }
});

//Insertion Into Database
app.post('/signup', async (req,res)=>{
    const {name, email, password} = req.body;
    console.log(req.body);
    const userDoc = await db.collection('website').doc(email).get();
    if(userDoc.exists){
        res.send('email already exists');
    }
    const hashedPassword = await bcrypt.hash(password,5);
    await db.collection('website').doc(email).set({
        name,
        email,
        password: hashedPassword
    });
    res.render('login');
});

//Getting Details For Checking Authentication For the Login Process.

app.post('/login', async (req,res)=>{
    const { email, password} = req.body;
    console.log(req.body);
    const userDoc = await db.collection('website').doc(email).get();
    if(!userDoc.exists){
        res.send('Un Authorized Accsess');
    }
    const isValidPassword = await bcrypt.compare(password,userDoc.data().password);
    if(!isValidPassword){
        res.send("Invalid Password");
    }
    res.render('dashboard_');
})

//PORT LISTENING..... 
app.listen(PORT,()=>{
    console.log(`Port Is Listening http://localhost:${PORT}`);
});