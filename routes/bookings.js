const express = require("express");
const router = express.Router();

const db = require("../data");
const ret = require("../lib/return");

router.get("/", function(req, res) {
    db.Booking.findAll().then(function(bookings) {
        ret.json(bookings, res);
    });
});

router.get("/:bookingID", function(req, res) {
    db.Booking.findByPk(req.params.bookingID).then(function(booking) {
        if (booking) {
            ret.json(booking, res);
        } else {
            res.end();
        }
    });
});

router.put("/:bookingID", function(req, res) {
    db.Booking.findByPk(req.params.bookingID).then(function(booking) {
        if (booking) {
            booking.timeBooked = new Date(req.body.timeBooked);
            console.log(req.body.timeBooked);
            booking.save().then(function(booking) {
                ret.json(booking, res);
            });
        } else {

            res.end();
        }
    });
});

router.delete("/:bookingID", function(req, res) {
    db.Booking.findByPk(req.params.bookingID)
        .then(function(booking) {
            if (booking) {
                return booking.destroy();
            } else {
                res.end();
            }
        })
        .then(function() {
            res.end();
        });
});

module.exports = router;
