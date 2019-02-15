const express = require('express');

const User = require('../models/User');
const Events = require('../models/Events');
const Comments = require('../models/Comment');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }
  res.redirect('/login');
});

router.get('/events', (req, res, next) => {
  Events.find()
    .then((returnedEvents) => {
      res.render('bikeClub/events', { eventsList: returnedEvents });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/events/:id', (req, res, next) => {
  const eventId = req.params.id;
  Events.findOne({ _id: eventId })
    .then((event) => {
      Comments.find({ event: eventId })
        .populate('user')
        .exec((err, comments) => {
          if (err) return 'Error populating User in Comments';
          // console.log('Comments: ', comments);
          res.render('event-detail', { event, comments });
        });
    })
    .catch(err => console.log(err));
});

router.post('/events/:id', (req, res, next) => {
  const { text } = req.body;
  const newComment = new Comments({
    user: req.session.currentUser._id,
    event: req.params.id,
    text
  });
  newComment
    .save()
    .then(() => {
      res.redirect(`/events/${req.params.id}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/events/del/:id/:eventID', (req, res, next) => {
  // delete comments
  Comments.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect(`/events/${req.params.eventID}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/event/add', (req, res, next) => {
  res.render('event-add');
});

router.post('/event/add', (req, res, next) => {
  const { title, description } = req.body;
  const location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };
  const newEvent = new Events({ title, description, location });
  newEvent
    .save()
    .then(() => {
      res.redirect('/events');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/api/:id', (req, res, next) => {
  const eventId = req.params.id;
  Events.findOne({ _id: eventId }, (error, oneEventFromDB) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ event: oneEventFromDB });
    }
  });
});

router.post('/event/edit', (req, res, next) => {
  // envia para o bd os dados
  const { title, description } = req.body;
  Events.update({ _id: req.query.eventId }, { $set: { title, description } }) // mongo function (CRUD)
    .then(() => {
      res.redirect('/events');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/event/edit/:id', (req, res, next) => {
  // faz alteracao dos dados da view edit do usuario no contexto
  Events.findOne({ _id: req.params.id }) // funcao do mongo (CRUD)
    .then((event) => {
      res.render('event-edit', { event });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/event/del/:id', (req, res, next) => {
  Events.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/events');
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/profile', (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .then((user) => {
      res.render('profile-detail', { user });
    })
    .catch((error) => {
      console.log(error);
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

    res.redirect('/events');
  });
});

module.exports = router;