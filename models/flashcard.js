const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filename = path.join(__dirname, '../data/flashcards.json');

exports.getAll = function (cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    try {
      var data = JSON.parse(buffer);
    } catch (e) {
      data = [];
    }

    cb(null, data);
  });
};

exports.write = function (newData, cb) {
  let json = JSON.stringify(newData);

  fs.writeFile(filename, json, cb);
};

exports.create = function (currCategory, newItem, cb) {
  exports.getAll((err, items) => {
    if (err) return cb(err);

    newItem.category = currCategory;
    newItem.id = uuid();

    items.push(newItem);

    exports.write(items, cb);
  });
};

exports.getRandomCard = function (currCategory, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    let cards = JSON.parse(buffer);
    let cardsCategorized = cards.filter((card) => {
      if (card.category === currCategory) {
        return card;
      } else return;
    });
    let randomNum = Math.floor(Math.random() * cardsCategorized.length);
    cardsCategorized[randomNum].answer = '';
    // console.log('random card: ', cardsCategorized[randomNum]);

    cb(null, cardsCategorized[randomNum]);
  });
};

exports.getAnswer = function (question, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);
    // console.log('question in model: ', question);
    let arr = question.split('"');
    let cleanedQuestion = arr[1].toString();
    // console.log('cleanedQuestion: ', cleanedQuestion);

    let cards = JSON.parse(buffer);
    let answerCard = cards.filter((card) => {
      if (card.question === cleanedQuestion) {
        return card;
      } else return;
    });

    let answer = answerCard[0].answer;
    // console.log('answer: ', answer);
    cb(null, answer);
  });
};

exports.getAnswerById = function (id, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);
    // console.log('question in model: ', question);

    let cards = JSON.parse(buffer);
    let answerCard = cards.filter((card) => {
      if (card.id === id) {
        return card;
      } else return;
    });

    let answer = answerCard[0].answer;
    // console.log('answer: ', answer);
    cb(null, answer);
  });
};

exports.updateCard = function (id, body, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);
    // console.log('id: ', id);
    // console.log('body: tof', body);
    let key = (Object.keys(body)).toString();
    // console.log('key:', key);
    let value = body[key];
    // console.log('value: ', typeof value);
    let cards = JSON.parse(buffer);
    let updatedCards = cards.map((card) => {
      if (card.id === id) {
        console.log('Sanity');
        card[key] = value;
        return card;
      } else {
        return card;
      }
    });
    // console.log('updatedCards: ', updatedCards);
    exports.write(updatedCards, cb);
    cb(null, updatedCards);
  });
};

exports.deleteCard = function (id, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);
    console.log('id of model: ', id);
    let cards = JSON.parse(buffer);
    let undeletedCards = cards.filter((card) => {
      if (card.id === id) {
        return;
      } else {
        return card;
      }
    });
    console.log('undeletedCards: ', undeletedCards);
    // console.log('cards: ', cards);
    exports.write(undeletedCards, cb);
    cb(null, undeletedCards);
  });
};
