const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/events.controller');

router.get('/', ctrl.getEvents);
router.get('/:id', ctrl.getEventById);
router.post('/', requireAuth, requireRole('admin'), ctrl.createEvent);
router.patch('/:id', requireAuth, requireRole('admin'), ctrl.updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;