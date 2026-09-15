// --- State and persistence ---

const STORAGE_KEY = 'todo-items';

let todos = loadTodos();
let currentFilter = 'all';
let draggedId = null;

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Invalid or missing saved data should leave the app usable with an empty list.
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read saved tasks:', err);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// --- DOM references ---

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const itemsLeftEl = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filtersNav = document.getElementById('filters');
const dateEl = document.getElementById('today-date');

// --- Current date ---

dateEl.textContent = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date());

// --- Add a task ---

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: Date.now(),
  });

  input.value = '';
  saveTodos();
  render();
});

// --- Per-item actions (toggle / delete) via event delegation ---

list.addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (!item) return;
  const id = item.dataset.id;

  if (event.target.matches('.item__checkbox')) {
    toggleTodo(id);
  }

  if (event.target.matches('.item__delete')) {
    deleteTodo(id);
  }
});

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

// --- Filters ---

filtersNav.addEventListener('click', (event) => {
  const btn = event.target.closest('.filters__btn');
  if (!btn) return;

  currentFilter = btn.dataset.filter;

  document
    .querySelectorAll('.filters__btn')
    .forEach((b) => b.classList.toggle('is-active', b === btn));

  render();
});

function getVisibleTodos() {
  if (currentFilter === 'active') return todos.filter((t) => !t.done);
  if (currentFilter === 'completed') return todos.filter((t) => t.done);
  return todos;
}

// --- Clear completed tasks ---

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  render();
});

// --- Reordering via drag and drop ---

list.addEventListener('dragstart', (event) => {
  const item = event.target.closest('.item');
  if (!item) return;
  draggedId = item.dataset.id;
  item.classList.add('dragging');
});

list.addEventListener('dragend', (event) => {
  const item = event.target.closest('.item');
  if (item) item.classList.remove('dragging');
  draggedId = null;
});

list.addEventListener('dragover', (event) => {
  event.preventDefault();
  const overItem = event.target.closest('.item');
  if (!overItem || overItem.dataset.id === draggedId) return;

  const overId = overItem.dataset.id;
  const fromIndex = todos.findIndex((t) => t.id === draggedId);
  const toIndex = todos.findIndex((t) => t.id === overId);
  if (fromIndex === -1 || toIndex === -1) return;

  const [moved] = todos.splice(fromIndex, 1);
  // Reorder the full state array so the new order survives filtering and refreshes.
  todos.splice(toIndex, 0, moved);
  render();
});

list.addEventListener('drop', () => {
  saveTodos();
});

// --- Render ---

function render() {
  const visible = getVisibleTodos();

  // Rebuilding only the visible items keeps filtering and state changes in one render path.
  list.innerHTML = visible
    .map(
      (todo) => `
      <li class="item ${todo.done ? 'is-done' : ''}" data-id="${todo.id}" draggable="true">
        <input type="checkbox" class="item__checkbox" ${todo.done ? 'checked' : ''} aria-label="Mark as done">
        <span class="item__text">${escapeHtml(todo.text)}</span>
        <button class="item__delete" aria-label="Delete task">&times;</button>
      </li>
    `
    )
    .join('');

  emptyState.style.display = visible.length === 0 ? 'block' : 'none';

  const remaining = todos.filter((t) => !t.done).length;
  itemsLeftEl.textContent = `${remaining} ${remaining === 1 ? 'item left' : 'items left'}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Init ---

render();
