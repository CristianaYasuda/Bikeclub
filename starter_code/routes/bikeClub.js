const express = require('express');

const User = require('../models/user');
const Events = require('../models/events');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});

router.get('/Events', (req, res, next) => {
  let query;

  if (req.session.currentUser.isLaunderer) {
    query = { member: req.session.currentUser._id };
  } else {
    query = { user: req.session.currentUser._id };
  }

  Events
    .find(query)
    .populate('user', 'name')
    .populate('member', 'name')
    .sort('eventDate')
    .exec((err, eventDocs) => {
      if (err) {
        next(err);
        return;
      }

      res.render('bikeClub/Events', {
        events: eventDocs
      });
    });
});


router.post('/member', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const memberInfo = {
    //fee: req.body.fee,
    isMember: true
  };

  User.findByIdAndUpdate(userId, memberInfo, { new: true }, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    req.session.currentUser = theUser;

    res.redirect('/Events');
  });
});


router.get('/member', (req, res, next) => {
  User.find({ isMember: true }, (err, membersList) => {
    if (err) {
      next(err);
      return;
    }

    res.render('bikeClub/member', {
      members: membersList
    });
  });
});

router.get('/member/:id', (req, res, next) => {
  const memberId = req.params.id;

  User.findById(memberId, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    res.render('bikeClub/member-profile', {
      theMember: theUser
    });
  });
});

router.post('/events', (req, res, next) => {
  const eventInfo = {
    eventDate: req.body.pickupDate,
    member: req.body.laundererId,
    user: req.session.currentUser._id
  };

  const theEvent = new Events(eventInfo);

  theEvent.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/Events');
  });
});

module.exports = router;