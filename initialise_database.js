const path = require("path");
const Sequelize = require("sequelize");

const db = require("./data");

// Add some dummy data to the database - in practice this should be in a different file
function addData() {
    let book1 = db.Book.create({
        title: "How to Draw Good",
        isbn: "3289589036"
    });
    let book2 = db.Book.create({
        title: "Making the Cake",
        isbn: "23567035"
    });
    let book3 = db.Book.create({
        title: "Laughing for No Reason",
        isbn: "3297806"
    });

    let author1 = db.Author.create({
        name: "Arthur James"
    });
    let author2 = db.Author.create({
        name: "Evelyn Dorothy"
    });
    let author3 = db.Author.create({
        name: "Lisa Jones"
    });

    let user1 = db.User.create({
        name: "Martin Chorley",
        barcode: 123456,
        memberType: "Staff"
    });

    let user2 = db.User.create({
        name: "Rhys Jones",
        barcode: 800669,
        memberType: "Student"
    });

    let loan1 = db.Loan.create({
        dueDate: new Date(2019, 3, 27)
    });

    let loan2 = db.Loan.create({
        dueDate: new Date(2019, 5, 28)
    });

    let room1 = db.Room.create({
        name: "Trevithick"
    });

    let room2 = db.Room.create({
        name: "Senghennydd"
    });

    let booking1 = db.Booking.create({
        timeBooked: new Date(2019, 3, 27)
    });

    // wait for all the objects to save and then instantiate relationships.
    Promise.all([book1, book2, book3, author1, author2, author3, user1, user2, loan1, loan2, room1, room2, booking1]).then(function(
        results
    ) {
        b1 = results[0];
        b2 = results[1];
        b3 = results[2];
        a1 = results[3];
        a2 = results[4];
        a3 = results[5];
        u1 = results[6];
        u2 = results[7];
        l1 = results[8];
        l2 = results[9];
        r1 = results[10];
        r2 = results[11];
        bk1 = results[12];
        b1.addAuthor(a1);
        b2.addAuthor(a3);
        b3.addAuthors([a1, a2]);

        u1.addLoan(l1);
        u1.addLoan(l2);
        b3.setLoan(l1);
        b2.setLoan(l2);

        //set a booking for a user
        u1.setBooking(bk1);
        //add a booking to the relevant room
        r1.addBooking(bk1);
    });
}

db.initialiseDatabase(true, addData);
