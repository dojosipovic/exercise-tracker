const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];
let exercises = [];

app.route('/api/users')
  .post((req, res) => {
    let username = req.body.username;
    let _id = users.length + 1;
    let user = { username: username, _id: "" + _id};
    users.push(user);
  
    res.json(user);
  })
  .get((req, res) => {
    res.json(users);
  })

app.route('/api/users/:_id/exercises')
  .post((req, res) => {
    let userID = req.params._id
    let desc = req.body.description
    let duration = req.body.duration
    let dateTxt = req.body.date
    let user = users.find(x => x._id == userID);

    let miliseconds = dateTxt ? Date.parse(dateTxt) : Date.now();
    let date = new Date(miliseconds)

    let exercise = {
      description: desc,
      duration: parseInt(duration),
      date: miliseconds,
      _id: user._id
    }
    exercises.push(exercise);

    exercise.username = user.username;
    exercise.date = date.toDateString()
    res.json(exercise);
  })
app.get('/api/users/:_id/logs', (req, res) => {
  let userID = req.params._id;
  let user = users.find(x => x._id == userID);
  let userExercises = exercises.filter(x => x._id == userID);

  /*if (req.query.from) {
    let from = Date.parse(req.query.from)
    userExercises = userExercises.filter(x => x.date >= from);
    console.log(userExercises.length);
  }
  if (req.params.to) {
    let to = Date.parse(req.params.to)
    userExercises = userExercises.filter(x => x.date < to);
  }*/
  if (req.query.limit) {
    let limit = parseInt(req.query.limit)
    if (limit <= userExercises.length)
      userExercises = userExercises.slice(0, limit);
  }
  
  let log = [];
  userExercises.forEach(x => {
    let logItem = {
      description: x.description,
      duration: x.duration,
      date: new Date(x.date).toDateString()
    }
    log.push(logItem);
  })

  let count = log.length;
  res.json({
    username: user.username,
    count: count,
    _id: user._id,
    log: log
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
