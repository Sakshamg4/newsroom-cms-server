// controllers/articleController.js
const sanitizeHtml = require('sanitize-html');
const Article = require('../models/Article');
const User = require('../models/User');

exports.getApproved = async (req, res) => {
  try {
    const q = req.query.q;
    let filter = { status: 'Approved' };
    if (q) {
      const authors = await User.find({ name: new RegExp(q, 'i') }).select('_id');
      const authorIds = authors.map(a => a._id);
      filter.$or = [{ title: new RegExp(q, 'i') }, { author: { $in: authorIds } }];
    }
    
    const list = await Article.find(filter).populate('author', 'name email').populate('approvedBy', 'name');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, assignedEditorId, submit } = req.body;

    console.log(req.body);
    
    if (!title || !content) return res.status(400).json({ msg: 'Title and content required' });

    const clean = sanitizeHtml(content);
    const article = new Article({
      title,
      content: clean,
      author: req.user._id,
      assignedEditor: assignedEditorId || null,
      status: submit ? 'Submitted' : 'Draft'
    });
    await article.save();
    res.json(article);
    console.log(article);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMine = async (req, res) => {
  try {
    const list = await Article.find({ author: req.user._id }).populate('assignedEditor', 'name').sort({ createdAt: -1 });
    res.json(list);
    console.log(list);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const art = await Article.findById(req.params.id);
  

    if (!art) return res.status(404).json({ msg: 'Not found' });
    if (art.author.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'Not author' });
    if (!['Draft', 'Rejected'].includes(art.status)) return res.status(400).json({ msg: 'Cannot edit unless Draft/Rejected' });

    art.title = req.body?.title || art.title;
    art.content = req.body?.content ? sanitizeHtml(req.body.content) : art.content;

    if (req.body?.submit) art.status = 'Submitted';
    await art.save();
    res.json(art);    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAssigned = async (req, res) => {
  try {
    const list = await Article.find({ assignedEditor: req.user._id, status: 'Submitted' }).populate('author', 'name');
    res.json(list);
    console.log("This is List:", list);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.review = async (req, res) => {
  try {
    const { action, comment } = req.body;

    console.log(req.body);

    const art = await Article.findById(req.params.id);

    console.log(art);
    

    if (!art) return res.status(404).json({ msg: 'Not found' });

    if (art.assignedEditor && art.assignedEditor.toString() !== req.user._id.toString() && req.user.role !== 'Admin')
      return res.status(403).json({ msg: 'Not assigned' });

    if (action === 'approve') {
      art.status = 'Approved';
      art.approvedBy = req.user._id;
      art.editorComment = comment || '';
      await art.save();
      return res.json(art);
    } else if (action === 'reject') {
      if (!comment) return res.status(400).json({ msg: 'Comment required' });
      art.status = 'Rejected';
      art.editorComment = comment;
      await art.save();
      return res.json(art);
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getReviewed = async (req, res) => {
  try {
    const list = await Article.find({ assignedEditor: req.user._id, status: { $in: ['Approved', 'Rejected'] } })
      .populate('author', 'name')
      .populate('approvedBy', 'name');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
