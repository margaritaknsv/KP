/*jshint esversion: 6 */

const PORT = 5555,
    express = require('express'),
    path = require('path'),
    app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	u = require('./users'),
	_ = require('lodash');

const checkAuth = (req, res, next) => {
	console.log( req.session.auth);
	if (req.session.auth=='ok') {
		next();
	} else {
		res.redirect('/login');
	}
};
	
module.exports = new Promise( resolve=>{      

		  app
		     .use(express.static(path.join(__dirname, 'public')))
		     .use((req, res, next) => next())
			 .use ( bodyParser.json() )
			 .use ( bodyParser.urlencoded({ extended: true}) )
			 .use(session({ secret: 'mysecret', resave: true, saveUninitialized: true }))			 
   		  .get('/', (req, res) => {
   			  res
   			     .send('<h1>Welcome to Express!</h1>');
   			     //res.sendFile(__dirname + '/index.html');  or res.redirect('/index.html');
   		  }) 
   		  .get('/api', checkAuth, (req, res) => {
			     res
			        .set({'Access-Control-Allow-Origin': '*', 'elias': 'goss'})
   			     .json({'gossApi':'started ok!'});
   		  })
			.get('/login', (req,res)=>{
				res.sendFile( path.join(__dirname, 'public/login.html') );
			})
			.post('/login/check/', (req, res)=>{
				const login = req.body.login,
				user = _.find(u.users, {login});
				if (user) {
					if ( user.password == req.body.pass ) {
						req.session.auth='ok';
						console.log('link: '+link);
						res.redirect(link);
						
					} else {
						res.send('Wrong pass!');
					}
				} else {
					res.send('No user!') ;
				}
			})	
            .get('/logout', (req,res)=>{ 
             req.session.destroy(err => {
            console.log('Goodbye!'); 
			});
            });

            .get('/name', (req,res)=>{ 
             res.send('Конусова Рита'); 
            })			
			
		     .set('port',  process.env.port||PORT )		  
		     .listen( app.get('port') ,()=>resolve(`--> Port ${ app.get('port') } listening!!!`));
			
});
 
// http://kodaktor.ru/api/req - demo client, test CORS
// process.env.port  - for cloud9 or ... port=8765 npm start