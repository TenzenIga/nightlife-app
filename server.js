const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser')
const cookie = require('cookie-session');
const mongoose = require('./mongoose');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const router = express.Router();
const TwitterTokenStrategy = require('passport-twitter-token');
const request = require('request')
const Place = require('./places');
const twitterConfig = require('./src/config.js');
mongoose();
const User = require('mongoose').model('User');
const passportConfig = require('./passport');

const normalizePort = port => parseInt(port, 10);
const dev = app.get('env') !== 'production';
const PORT =  normalizePort(process.env.PORT || 5000);
passportConfig();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
let createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

let generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

let sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};



  app.disable('x-powered-by');
  app.use(compression())
  app.use(morgan('common'))

  app.use(express.static(path.resolve(__dirname, 'build')));




router.route('/auth/twitter/reverse')
  .post(function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
  });

router.route('/auth/twitter')
  .post((req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
    console.log(req.user);
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      return next();
    }, generateToken, sendToken);

    //token handling middleware
let authenticate = expressJwt({
      secret: 'my-secret',
      requestProperty: 'auth',
      getToken: function(req) {
        if (req.headers['x-auth-token']) {
          return req.headers['x-auth-token'];
        }
        return null;
      }
    });

let getCurrentUser = function(req, res, next) {
      User.findById(req.auth.id, function(err, user) {
        if (err) {
          next(err);
        } else {
          req.user = user;
          next();
        }
      });
  };

let getOne = function (req, res) {
    let user = req.user.toObject();

    delete user['twitterProvider'];
    delete user['__v'];

    res.json(user);
  };

//add place id and user to database
//if place already in list check for users
//if user is in array too then do nothing
//else add new user to array of users
app.post('/',authenticate,(req, res, next)=>{
    let user = req.body.user;
    let newPlace = new Place({
      name:req.body.name,
      id:req.body.id
    });
    newPlace.votedUsers.push(user);
    Place.findOne({id:req.body.id}, (err, result)=>{
      if(err){
        console.log(err);
      }
      if(!result){// placeid is not in the databse create new place database
        Place.addPlace(newPlace, (err, data)=>{
          if(err){
            res.json({success:false, msg:'Failed to add vote'});
          }else{
            res.json(data);
          }
        })
      }else{//if place already in database add only  user id to votedUsers
        result.votedUsers.push(user)
        result.save((err) =>{
    if (err) return handleError(err);
    res.json(result)
  });
      }

    })
  })

  //delete user id from votedusers
app.delete('/', authenticate, (req, res, next)=>{

    let user = req.body.user; //user id
    Place.findOne({id:req.body.id}, (err, result)=>{
      if(err){
        console.log(err);
      }//if place already in database add only  user id to votedUsers
      console.log(result.votedUsers);
        result.votedUsers.splice(result.votedUsers.indexOf(user), 1)
        result.save((err) =>{
    if (err) return handleError(err);
    res.json(result)
        });
      })
  })
  app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
app.get('/data',(req,res, next)=>{
  console.log(123);
    Place.find({}, (err, data)=>{
    if(err) res.send(err);
    res.send(data);
  })
  })

app.use('/api/v1', router);

app.listen(PORT, err=>{
  if(err) throw err;

  console.log('server started');
})
