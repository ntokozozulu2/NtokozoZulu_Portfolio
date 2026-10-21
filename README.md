# Ntokozo Zulu – Personal Portfolio Website

A modern, responsive personal portfolio website built from scratch using only HTML5, CSS3, and vanilla JavaScript.

---

## 🚀 How to Run

This is a static website — no build tools or servers required.

1. Download or clone the project folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
3. That's it. Everything runs locally.

---

## 📁 Project Structure

```
NtokozoZulu_Portfolio/
├── index.html      ← Main HTML structure
├── style.css       ← All styles (variables, layout, animations, responsive)
├── script.js       ← Vanilla JavaScript (nav, typing animation, form, scroll reveal)
├── assets/         ← Folder for images and icons (currently empty)
│   └── icons/
└── README.md       ← This file
```

---

## ✏️ How to Customise

### Replace placeholder content

Search for `<!-- PLACEHOLDER` comments in `index.html` — each one marks something that needs a real value:

| Placeholder | Where | What to add |
|---|---|---|
| `[Add Institution Name]` | Education section | Your actual institution |
| `your.email@example.com` | Contact section + footer | Your real email address |
| `github.com/yourusername` | Contact section + footer | Your GitHub URL |
| `linkedin.com/in/yourusername` | Contact section + footer | Your LinkedIn URL |

### Add or edit projects

In `index.html`, find the `projects-grid` div. Each project is an `<article>` block. To:

- **Add a project** — copy an existing `<article>` block and fill in the details.
- **Edit a project** — update the title, description, tech tags, and `href` links.
- **Remove a project** — delete the entire `<article>` block.

### Change colors or fonts

All design tokens live at the top of `style.css` inside `:root { }`. Change `--color-accent` to any hex value to switch the primary accent color across the entire site.

---

## 📬 Connecting the Contact Form

The contact form validates inputs in the browser but does **not** send emails without a backend service. To wire it up:

**Option 1 – Formspree (easiest)**
1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and copy your form ID.
3. In `script.js`, inside `initContactForm()`, replace the `setTimeout` simulation block with:

```js
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' },
})
.then(res => res.ok ? showSuccess() : showError())
.catch(() => showError());
```

**Option 2 – EmailJS**
See [emailjs.com/docs](https://www.emailjs.com/docs/) for their JavaScript SDK.

**Option 3 – Netlify Forms**
If you host on Netlify, add `netlify` attribute to the `<form>` tag — no code change required.

---

## ♿ Accessibility

- Semantic HTML elements throughout
- Keyboard-navigable (Tab, Enter, Escape)
- ARIA labels on interactive elements
- Visible focus states
- `aria-live` regions for dynamic content (typing animation, form errors)
- Respects `prefers-reduced-motion` OS setting

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Desktop (> 900px) | Two-column hero, three-column footer grid |
| Tablet (≤ 900px) | Single-column hero, stacked contact, two-column footer |
| Mobile (≤ 600px) | Single column throughout, hamburger menu |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript** — No frameworks or dependencies

---

## 📝 License

Feel free to use this as a starting template. If you share or publish it, a credit mention is appreciated but not required.

---

*Built by Ntokozo Zulu — 2026*
