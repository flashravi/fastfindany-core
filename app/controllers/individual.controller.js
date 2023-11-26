const db = require("../models");
const Individual = db.individuals;

// Create and Save a new Individual
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Individual
  const individual = new Individual({
    name: req.body.name,
    occupation: req.body.occupation,
    zipcode: req.body.zipcode,
    published: req.body.published ? req.body.published : false
  });

  // Save Individual in the database
  individual
    .save(individual)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Individual."
      });
    });
};

// Retrieve all Individuals from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Individual.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Individuals."
      });
    });
};

// Find a single Individual with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Individual.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Individual with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Individual with id=" + id });
    });
};

// Update an Individual by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Individual.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Individual with id=${id}. Maybe Individual was not found!`
        });
      } else res.send({ message: "Individual was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Individual with id=" + id
      });
    });
};

// Delete a Individual with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Individual.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Individual with id=${id}. Maybe Individual was not found!`
        });
      } else {
        res.send({
          message: "Individual was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Individual with id=" + id
      });
    });
};

// Delete all Individuals from the database.
exports.deleteAll = (req, res) => {
  Individual.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Individuals were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Individuals."
      });
    });
};

// Find all published Individuals
exports.findAllPublished = (req, res) => {
  Individual.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Individuals."
      });
    });
};
