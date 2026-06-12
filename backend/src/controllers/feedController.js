const { prisma } = require('../lib/prisma');

// Get all feed posts (with comments)
const getFeedPosts = async (req, res) => {
  try {
    const posts = await prisma.feedPost.findMany({
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new feed post (with optional poll, image, pdf, or reference link)
const createFeedPost = async (req, res) => {
  try {
    const { title, content, imageUrl, pdfUrl, linkUrl, authorName, authorRole, poll } = req.body;

    if (!content || !authorName || !authorRole) {
      return res.status(400).json({ error: 'Missing required fields: content, authorName, authorRole' });
    }

    const newPost = await prisma.feedPost.create({
      data: {
        title,
        content,
        imageUrl,
        pdfUrl,
        linkUrl,
        authorName,
        authorRole,
        poll // Stored directly as a JSON field
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating feed post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Like or unlike a feed post
const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const post = await prisma.feedPost.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    let likesChange = 1;
    if (action === 'unlike') {
      likesChange = -1;
    }

    // Ensure likes count never goes below 0
    const newLikesCount = Math.max(0, post.likesCount + likesChange);

    const updatedPost = await prisma.feedPost.update({
      where: { id },
      data: { likesCount: newLikesCount }
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error toggling like on post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Vote in a poll on a feed post
const votePollOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body; // 0-indexed option index

    if (optionIndex === undefined) {
      return res.status(400).json({ error: 'Missing optionIndex' });
    }

    const post = await prisma.feedPost.findUnique({ where: { id } });
    if (!post || !post.poll) {
      return res.status(404).json({ error: 'Post or poll not found' });
    }

    const pollData = typeof post.poll === 'string' ? JSON.parse(post.poll) : post.poll;

    if (!pollData.options || !pollData.options[optionIndex]) {
      return res.status(400).json({ error: 'Invalid optionIndex' });
    }

    // Increment votes for selected option
    pollData.options[optionIndex].votes += 1;

    const updatedPost = await prisma.feedPost.update({
      where: { id },
      data: { poll: pollData }
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error voting on poll:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a comment to a feed post
const addCommentToPost = async (req, res) => {
  try {
    const { id } = req.params; // post ID
    const { authorName, content } = req.body;

    if (!authorName || !content) {
      return res.status(400).json({ error: 'Missing required fields: authorName, content' });
    }

    const post = await prisma.feedPost.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = await prisma.feedComment.create({
      data: {
        postId: id,
        authorName,
        content
      }
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment to post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a feed post
const deleteFeedPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.feedPost.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.feedPost.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getFeedPosts,
  createFeedPost,
  toggleLikePost,
  votePollOption,
  addCommentToPost,
  deleteFeedPost
};
