require("dotenv").config();

let mongoose = require("mongoose");

mongoose.connect(process.env["MONGO_URI"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  favoriteFoods: {
    type: [String],
  },
});

let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  var nedalBenelmekki = new Person({
    name: "Nedal Benelmekki",
    age: 20,
    favoriteFoods: ["Steak", "Cous Cous", "Lamb"],
  });
  nedalBenelmekki.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

var arrayOfPeople = [
  {
    name: "Maria Benelmekki",
    age: 54,
    favoriteFoods: ["Pizza", "Burger", "Fries"],
  },
  { name: "Lluis Miquel Martinez", age: 57, favoriteFoods: ["Bread"] },
  { name: "Amal Martinez", age: 24, favoriteFoods: ["Pasta"] },
  { name: "Inca Torres", age: 24, favoritFoods: ["Pasta"] },
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.error(err);
    done(null, people);
  });
};

var personName = "Nedal Benelmekki";

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function (err, personFound) {
    if (err) return console.error(err);
    done(null, personFound);
  });
};

var food = "Cous Cous";

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function (err, foodFound) {
    if (err) return console.error(err);
    done(null, foodFound);
  });
};

var personId = "h4ndb81gqeoetw1ld63cgzmqw4kndkkv";

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, function (err, IdFound) {
    if (err) return console.error(err);
    done(null, IdFound);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson) => {
      if (err) return console.log(err);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    function (err, updatedDoc) {
      if (err) return console.log(err);
      done(null, updatedDoc);
    },
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function (err, removedDoc) {
    if (err) return console.log(err);
    done(null, removedDoc);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, function (err, response) {
    if (err) return console.log(err);
    done(null, response);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec(function (err, data) {
      if (err) return console.log(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
