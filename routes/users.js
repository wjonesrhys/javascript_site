const express = require("express");
const router = express.Router();

const db = require("../data");
const ret = require("../lib/return");

router.get("/", function(req, res) {
    if (req.query.allEntities == "true") {
        db.User.findAll({ include: [db.Booking] }).then(function(users) {
            ret.json(users, res);
        });
    } else {
        db.User.findAll().then(function(users) {
            ret.json(users, res);
        });
    }
});

router.get("/:userID", function(req, res) {
  db.User.findByPk(req.params.userID).then(function(user) {
    if (user) {
      ret.json(user, res);
    } else {
      res.end();
    }
  });
});

router.get("/:userID/loans", function(req, res) {
  db.Loan.findAll({ where: { userId: req.params.userID } }).then(function(loans) {
    ret.json(loans, res);
  });
});

router.post("/:userID/loans/:bookID", function(req, res) {
  db.User.findByPk(req.params.userID).then(function(user) {
    if (user) {
      db.Book.findByPk(req.params.bookID).then(function(book) {
        if (book) {
          db.Loan.findOrCreate({
            where: { UserId: req.params.userID, BookId: req.params.bookID }
          }).spread(function(loan, created) {
            loan.dueDate = new Date(req.body.dueDate);
            loan.save().then(function(loan) {
              ret.json(loan, res);
            });
          });
        }
      });
    } else {
      res.end();
    }
  });
});

router.post("/:userID/bookings/:roomID", function(req, res) {
  db.User.findByPk(req.params.userID).then(function(user) {
    if (user) {
      db.Room.findByPk(req.params.roomID).then(function(room) {
        if (room) {
          db.Booking.findOrCreate({
            where: { UserId: req.params.userID, RoomId: req.params.roomID }
          }).spread(function(booking, created) {
            booking.timeBooked = new Date(req.body.timeBooked);
            booking.save().then(function(booking) {
              ret.json(booking, res);
            });
          });
        }
      });
    } else {
      res.end();
    }
  });
});

router.post("/", function(req, res) {
  db.User.create({
    name: req.body.name,
    barcode: req.body.barcode,
    memberType: req.body.memberType
  }).then(function(user) {
    ret.json(user, res);
  });
});

router.put("/:userID", function(req, res) {
  db.User.findByPk(req.params.userID).then(function(user) {
    if (user) {
      (user.name = req.body.name),
      (user.barcode = req.body.barcode),
      (user.memberType = req.body.memberType),
      user.save().then(function(user) {
        ret.json(user, res);
      });
    } else {
      res.end();
    }
  });
});

router.delete("/:userID", function(req, res) {
  db.User.findByPk(req.params.userID)
  .then(function(user) {
    if (user) {
      return user.destroy();
    } else {
      res.end();
    }
  })
  .then(function() {
    res.end();
  });
});

module.exports = router;
