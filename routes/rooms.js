const express = require("express");
const router = express.Router();

const db = require("../data");
const ret = require("../lib/return");

router.get("/", function(req, res) {
    if (req.query.allEntities == "true") {
        db.Room.findAll({ include: [db.Booking] }).then(function(rooms) {
            ret.json(rooms, res);
        });
    } else {
        db.Room.findAll().then(function(rooms) {
            ret.json(rooms, res);
        });
    }
});

router.get("/:roomID", function(req, res) {
  db.Room.findByPk(req.params.roomID).then(function(room) {
    if (room) {
      ret.json(room, res);
    } else {
      res.end();
    }
  });
});

router.put("/:roomID", function(req, res) {
  db.Room.findByPk(req.params.roomID).then(function(room) {
    if (room) {
      room.name = req.body.name;
      room.save().then(function(room) {
        ret.json(room, res);
      });
    } else {
      res.end();
    }
  });
});

router.post("/", function(req, res) {
  db.Room.create({
    name: req.body.name
  }).then(function(room) {
    ret.json(room, res);
  });
});

router.delete("/:roomID", function(req, res) {
  db.Room.findByPk(req.params.roomID)
  .then(function(room) {
    if (room) {
      return room.destroy();
    } else {
      res.end();
    }
  })
  .then(function() {
    res.end();
  });
});

module.exports = router;
