document.querySelectorAll('.add-card-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    const card = createCard(text);
    form.previousElementSibling.appendChild(card);
    input.value = '';
  });
});

function createCard(text) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.innerHTML = `
    <span class="label low">Task</span>
    <h4>${text}</h4>
    <p>Added manually</p>
  `;
  addDragEvents(card);
  return card;
}

function addDragEvents(card) {
  card.addEventListener('dragstart', () => card.classList.add('dragging'));
  card.addEventListener('dragend', () => card.classList.remove('dragging'));
}

document.querySelectorAll('.card').forEach(addDragEvents);

document.querySelectorAll('.card-list').forEach(column => {
  column.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(column, e.clientY);
    if (!afterElement) {
      column.appendChild(dragging);
    } else {
      column.insertBefore(dragging, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll('.card:not(.dragging)')];
  return elements.reduce((closest, el) => {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: el };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
