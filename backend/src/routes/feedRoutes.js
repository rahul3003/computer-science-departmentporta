const express = require('express');
const router = express.Router();
const {
  getFeedPosts,
  createFeedPost,
  toggleLikePost,
  votePollOption,
  addCommentToPost,
  deleteFeedPost
} = require('../controllers/feedController');

router.get('/', getFeedPosts);
router.post('/', createFeedPost);
router.delete('/:id', deleteFeedPost);
router.post('/:id/like', toggleLikePost);
router.post('/:id/vote', votePollOption);
router.post('/:id/comment', addCommentToPost);

module.exports = router;
