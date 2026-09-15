# Today's Tasks — To-Do List

A to-do list app built in vanilla JavaScript (no framework), practicing core fundamentals: DOM manipulation, event delegation, data persistence, and interactive UI.

## Features

- Add, toggle, and delete tasks
- Data persists in `localStorage` — tasks survive a page refresh
- Filtering: All / Active / Completed
- Reorder tasks via drag and drop
- Bulk-clear completed tasks
- Dynamic count of remaining items
- Custom design, no external CSS libraries

## Tech stack

- Semantic HTML5
- CSS3 (CSS variables, flexbox layout, `prefers-reduced-motion`)
- JavaScript ES6+ (`localStorage`, `crypto.randomUUID`, event delegation, Drag and Drop API)

## Running the project

No build step or install required. Open `index.html` directly in a browser, or, for a proper local environment (recommended for `crypto.randomUUID`):

```bash
# with Node
npx --yes http-server . -p 8000

# or the Live Server extension in VS Code
```

Then visit `http://127.0.0.1:8000`.

## Project structure

```
todo-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## What this project demonstrates

- Working with arrays of objects (map, filter, findIndex, splice)
- Keeping app state in sync with the UI (render() pattern)
- Handling events through delegation instead of one listener per element
- Basic XSS protection when rendering user-provided text

## How it works

The `todos` array is the single source of truth for the task list. Changes are
saved to `localStorage`, and `render()` rebuilds the visible items using the
current filter. A delegated listener on the list handles task actions even
after rendering replaces its child elements. User-entered task text is escaped
before it is inserted into the page.
