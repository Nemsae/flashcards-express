const PORT = 8000;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const FlashCard = require('./models/flashcard');

const app = express();

//  _____________________________MIDDLEWARE_____________________________//
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//  ______________________________ROUTES______________________________//

//  GET for home page
app.get('/', (req, res) => {
  let obj = {
    message: "Welcome to FlashCap! Type /flashcards w/ GET to grab all flashcards. Type /flashcards/?'question' w/ GET to get the answer. Type /flashcards/'category' w/ GET to recieve a random question. Type /flashcards/'category' w/ POST to create a new card."
    // message: "Welcome to FlashCap!\nType /flashcards w/ GET to grab all flashcards.\nType /flashcards/?'question' w/ GET to get the answer.\nType /flashcards/'category' w/ GET to recieve a random question.\nType /flashcards/'category' w/ POST to create a new card."
  };
  let string = JSON.stringify(obj);
  let arr = string.split('"');
  let welcomeString = arr[3].toString();
  res.send(welcomeString);
});

//  GET answer by ID
app.get('/flashcards/:id', (req, res) => {
  let id = req.params.id;
  console.log('id: ', id);
  FlashCard.getAnswerById(id, (err, answer) => {
    if (err) return res.status(400).send(err);

    res.send(`The answer is: ${answer}`);
  });
});

//  GET answer by question/query string
//  Or
//  GET all cards
app.get('/flashcards/', (req, res) => {
  let question = JSON.stringify(req.query);

  if (question !== '{}') {
    FlashCard.getAnswer(question, (err, answer) => {
      if (err) return res.status(400).send(err);

      res.send(`The answer is: ${answer}`);
    });
  } else {
    FlashCard.getAll((err, flashcards) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.send(flashcards);
    });
  }
});

//  GET random card w/o answer
app.get('/flashcards/:category', (req, res) => {
  let currCategory = req.params.category;

  FlashCard.getRandomCard(currCategory, (err, randomCard) => {
    if (err) return res.status(400).send(err);
    res.send(randomCard);
  });
});

//  PUT update a card by ID
app.put('/flashcards/:id/', (req, res) => {
  let id = req.params.id;

  FlashCard.updateCard(id, req.body, (err, updatedCards) => {
    if (err) return res.status(400).send(err);

    res.send(updatedCards);
  });
});

//  DELETE by ID
app.delete('/flashcards/:id', (req, res) => {
  let id = req.params.id;
  console.log('id in app: ', id);
  FlashCard.deleteCard(id, (err, undeletedCards) => {
    if (err) return res.status(400).send(err);

    res.send(undeletedCards);
  });
});

//  POST by category w/ a body
app.post('/flashcards/:category', (req, res) => {
  let currCategory = req.params.category;
  FlashCard.create(currCategory, req.body, (err) => {
    if (err) return res.status(400).send(err);

    res.send();
  });

  res.send('Added new flashcard!\n');
});

app.listen(PORT, (err) => {
  console.log(err || `Express listening on port ${PORT}`);
});
