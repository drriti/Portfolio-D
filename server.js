const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ──
app.use(express.static(path.join(__dirname, 'public')));

// Serve existing asset directories directly (no need to copy them into public/)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/videos', express.static(path.join(__dirname, 'vidoes'))); // original folder is "vidoes"
app.use('/files', express.static(path.join(__dirname, 'images')));  // for resume PDF etc.

// ── Body parser (for future contact form) ──
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─────────────────────────────────
//  ROUTES
// ─────────────────────────────────

// Home
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Drriti Pasrija — Portfolio',
        page: 'home'
    });
});

// Project: UniPath
app.get('/unipath', (req, res) => {
    res.render('projects/unipath', {
        title: 'UniPath — Case Study',
        page: 'unipath'
    });
});

// Project: Oton
app.get('/oton', (req, res) => {
    res.render('projects/oton', {
        title: 'OTON — Brand Identity',
        page: 'oton'
    });
});

// Project: MRITTIKA
app.get('/mittrika', (req, res) => {
    res.render('projects/mittrika', {
        title: 'MITTRIKA — Branding',
        page: 'mittrika'
    });
});

// Project: 3D Model
app.get('/3d-model', (req, res) => {
    res.render('projects/3d-model', {
        title: '3D Modeled Tape Dispenser',
        page: '3d-model'
    });
});

// Project: Motion Graphics
app.get('/motion-graphics', (req, res) => {
    res.render('projects/motion-graphics', {
        title: 'Motion Graphics',
        page: 'motion-graphics'
    });
});

// Contact form handler (POST)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    // For now, just log it. You can add email sending later (e.g., nodemailer).
    console.log('📩 New contact message:', { name, email, message });
    res.redirect('/#contact');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 — Page Not Found',
        page: '404'
    });
});

// ── Start server (local dev only — Vercel uses the export below) ──
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🚀 Portfolio running at http://localhost:${PORT}\n`);
    });
}

// ── Export for Vercel serverless ──
module.exports = app;
