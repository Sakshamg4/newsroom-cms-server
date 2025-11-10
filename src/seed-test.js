// server/seed-test.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Article = require('./models/Article');

async function main() {
  const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/newsroom';
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGO);

  const password = 'pass123';
  const hashed = await bcrypt.hash(password, 10);

  // Create or find users
  async function findOrCreateUser({ name, email, role }) {
    let u = await User.findOne({ email });
    if (!u) {
      u = await User.create({ name, email, password: hashed, role });
      console.log(`Created user: ${email} (${role}) -> ${u._id.toString()}`);
    } else {
      console.log(`Found user: ${email} (${role}) -> ${u._id.toString()}`);
    }
    return u;
  }

  const admin = await findOrCreateUser({ name: 'Admin Bob', email: 'admin@test.com', role: 'Admin' });
  const editor = await findOrCreateUser({ name: 'Editor Bob', email: 'editor@test.com', role: 'Editor' });
  const writer = await findOrCreateUser({ name: 'Writer Alice', email: 'writer@test.com', role: 'Writer' });
  const reader = await findOrCreateUser({ name: 'Reader', email: 'reader@test.com', role: 'Reader' });

  // Helper to create an article only if not exists by title
  async function findOrCreateArticle(payload) {
    let a = await Article.findOne({ title: payload.title });
    if (!a) {
      a = await Article.create(payload);
      console.log(`Created article: "${a.title}" -> ${a._id.toString()}`);
    } else {
      console.log(`Found article: "${a.title}" -> ${a._id.toString()}`);
    }
    return a;
  }

  // Draft article (writer)
  await findOrCreateArticle({
    title: 'Seed: Draft Article',
    content: '<p>This is a draft article. Writer is still editing.</p>',
    author: writer._id,
    assignedEditor: editor._id,
    status: 'Draft'
  });

  // Submitted article (writer -> editor)
  await findOrCreateArticle({
    title: 'Seed: Submitted Article',
    content: '<p>This article has been submitted to the editor for review.</p>',
    author: writer._id,
    assignedEditor: editor._id,
    status: 'Submitted'
  });

  // Rejected article (editor rejected with comment)
  await findOrCreateArticle({
    title: 'Seed: Rejected Article',
    content: '<p>This article was rejected. Please expand the introduction and add sources.</p>',
    author: writer._id,
    assignedEditor: editor._id,
    status: 'Rejected',
    editorComment: 'Please add more sources and expand the introduction.'
  });

  // Approved article (editor approved)
  await findOrCreateArticle({
    title: 'Seed: Approved Article',
    content: '<p>This article has been approved and is visible to readers.</p>',
    author: writer._id,
    assignedEditor: editor._id,
    status: 'Approved',
    editorComment: 'Good to publish.',
    approvedBy: editor._id
  });

  console.log('\nSeed complete. Credentials:');
  console.log('Admin   -> admin@test.com / pass123');
  console.log('Editor  -> editor@test.com / pass123');
  console.log('Writer  -> writer@test.com / pass123');
  console.log('Reader  -> reader@test.com / pass123');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
