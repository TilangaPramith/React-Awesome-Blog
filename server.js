const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://tilanga:<password>@cluster0.yubkqvp.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const app = express();

// form data access over api
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
}).then(() => {
  console.log('connected to db');
}).catch((error) => {
  console.log('error in connecting to db', error)
});


const User = mongoose.model('users', new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  phone: String,
  website: String
}));

app.get('/api/users', async (req, res) => {
  const {email, password} = req.query;
  const users = await User.find(email && password ? {email, password}: {});
  res.send(users);
});
app.get('/api/users/:id', async(req, res) => {
  const {id} = req.params;
  const user = await User.findOne({id});
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({message: 'User not found'});
  }
});
app.post('/api/users', async (req, res) => {
  console.log('come ==>', req.body);
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.send({message: 'Data is required. !'});
  }
  const user = new User(req.body);
  const createdUser = await user.save();
  res.send(createdUser);
});
app.put('/api/users/:id', async (req, res) => {
  const {id} = req.params;
  const {email, name, phone, password} = req.body;
  const user = await User.findOne({id});
  if (user) {
    user.email = email;
    user.name = name;
    user.phone = phone;
    user.password = password;

    const updateUser = await user.save();
    res.send(updateUser);
  } else {
    res.status(404).send({message: 'User not found'});
  }
});

// POST

const Post = mongoose.model('posts', new mongoose.Schema({
  id: Number,
  title: String,
  body: String,
  userId: Number,
}, {
  timestamps: true,
}));

app.get('/api/posts', async(req, res) => {
  const {userId} = req.query;
  const posts = await Post.find(userId ? {userId} : {});
  res.send(posts);
});
app.get('/api/posts/:id', async(req, res) => {
  const {id} = req.params;
  const post = await Post.findOne({id});
  if (post) {
    res.send(post);
  } else {
    res.status(404).send({message: 'Post not found'});
  }
});
app.post('/api/posts', async (req, res) => {
  if (!req.body.title || !req.body.body) {
    return res.send({message: 'Data is required. !'});
  }
  const post = new Post(req.body);
  const createdPost = await post.save();
  res.send(createdPost);
});

app.get('/api/seed', async (req, res) => {
  await User.deleteMany();
  await User.insertMany([
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@gmail.com',
      password: '123',
      phone: '07777777777',
      website: 'https://mywebsite.com',
    }
  ]);
  await Post.deleteMany();
  await Post.insertMany([
    {
      id: 1,
      title: 'Hello World!',
      body: 'Welcome to my awesome blog',
      userId: 1,
    }
  ])
  res.send({message: 'seeded successfully'});
});

const dirname = path.resolve();
app.use('/', express.static(dirname + '/build'));
app.get('/', (req, res) => res.sendFile(dirname + '/build/index.html'));

const port = process.eventNames.PORT || 5000;

app.listen(port, () => {
  console.log('api running in port:', port);
});