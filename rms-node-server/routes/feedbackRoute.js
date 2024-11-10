const router = require('express').Router();
const { feedbackController } = require('../controllers/feedbackController');

router.post('/',feedbackController.createFeedback)
router.get('/',feedbackController.findAllFeedBack)
router.get('/:feedbackid',feedbackController.findFeedbackById);
router.delete('/:feedbackid',feedbackController.deleteFeedback);
router.get('/readed/:feedbackid',feedbackController.updateReaded);

module.exports = router;