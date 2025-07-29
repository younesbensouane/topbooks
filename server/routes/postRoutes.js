const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// ---------- Helpers ----------
function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove non-alphanumeric
    .replace(/\s+/g, '-')          // spaces to hyphens
    .replace(/-+/g, '-');          // collapse multiple hyphens
}

async function generateUniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let counter = 1;
  while (await Post.findOne({ slug })) {
    counter += 1;
    slug = `${base}-${counter}`;
  }
  return slug;
}
// --------------------------------

// --- DEV ONLY: seed sample posts once ---
router.get('/seed', async (req, res) => {
  try {
    const sample = [
      {
        title: "The Alchemist",
        slug: "the-alchemist",
        content: "A spiritual journey of self-discovery by Paulo Coelho.",
        tags: ["fiction", "inspiration"],
        imageUrl: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg",
        status: "published",
      },
      {
        title: "Atomic Habits",
        slug: "atomic-habits",
        content: "Tiny changes, remarkable results — a system for building good habits and breaking bad ones.",
        tags: ["self-help", "productivity"],
        imageUrl: "https://m.media-amazon.com/images/I/81bGKUa1e0L.jpg",
        status: "published",
      },
      {
        title: "Deep Work",
        slug: "deep-work",
        content: "Rules for focused success in a distracted world.",
        tags: ["self-help", "focus"],
        imageUrl: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
        status: "published",
      },
    ];
    const count = await Post.countDocuments();
    if (count === 0) {
      await Post.insertMany(sample);
      return res.json({ inserted: sample.length });
    }
    return res.json({ message: "Collection not empty. No action taken." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Create (auto slug, basic validation)
router.post('/', async (req, res) => {
  try {
    let { title, content, tags, status, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    // tags may be a comma string
    if (typeof tags === 'string') {
      tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (!Array.isArray(tags)) tags = [];

    const slug = await generateUniqueSlug(title);

    const post = new Post({
      title,
      slug,
      content,
      tags,
      imageUrl: imageUrl || "",
      status: status || 'published',
    });

    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});


// READ: distinct tags (for filter UI)
router.get('/tags', async (req, res) => {
  try {
    const tags = await Post.distinct('tags', { status: 'published' });
    // sort A-Z, remove empty
    const clean = tags.filter(Boolean).sort((a, b) => a.localeCompare(b));
    res.json(clean);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: list with search + tags + pagination
// Query params: status, search, tags, page, limit
// Example: /api/posts?status=published&search=habit&tags=self-help,productivity&page=1&limit=9
router.get('/', async (req, res) => {
  try {
    const {
      status = 'published',
      search = '',
      tags = '',
      page = 1,
      limit = 9,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 9, 1), 50);

    const filter = {};
    if (status) filter.status = status;

    // tags filter
    let tagsArr = [];
    if (typeof tags === 'string' && tags.trim().length > 0) {
      tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagsArr.length > 0) {
        filter.tags = { $in: tagsArr };
      }
    }

    // search filter (uses text index if search provided)
    let sort = { createdAt: -1 };
    if (search && search.trim().length > 0) {
      filter.$text = { $search: search.trim() };
      sort = { score: { $meta: 'textScore' } }; // rank by text score
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter, search ? { score: { $meta: 'textScore' } } : {})
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.json({
      data: posts,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(Math.ceil(total / limitNum), 1),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ: by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const update = { ...req.body };
    if (title) update.slug = await generateUniqueSlug(title);
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
