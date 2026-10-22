/**
 * projects.js — Filter bar, detail modal, and card interactions for projects.html
 * NatWorks Transformation
 */

(function () {
  'use strict';

  // ── Filter bar ──────────────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-detail-card');
  const noResults  = document.getElementById('noResults');

  /**
   * Apply the chosen filter.
   * @param {string} filter - the data-filter value of the active button.
   */
  function applyFilter(filter) {
    let visible = 0;

    cards.forEach(function (card) {
      const categories = (card.dataset.categories || '').toLowerCase();
      const show = filter === 'all' || categories.includes(filter.toLowerCase());
      card.classList.toggle('hidden', !show);
      if (show) visible += 1;
    });

    if (noResults) {
      noResults.hidden = visible > 0;
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      applyFilter(btn.dataset.filter || 'all');
    });
  });

  // ── Modal ────────────────────────────────────────────────────────────────────
  const modal      = document.getElementById('projectModal');
  const modalBody  = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  /** Open the modal and populate it from the card's data attributes. */
  function openModal(card) {
    const title       = card.dataset.title       || '';
    const projectId   = card.dataset.projectId   || '';
    const methodology = card.dataset.methodology || '';
    const type        = card.dataset.type        || '';
    const country     = card.dataset.country     || '';
    const volume      = card.dataset.volume      || '';
    const status      = card.dataset.status      || '';
    const desc        = card.dataset.desc        || '';

    // Build tags from .pdc-tag elements inside this card
    const tagEls = card.querySelectorAll('.pdc-tag');
    const tagsHtml = Array.from(tagEls).map(function (t) {
      return '<span class="pdc-tag">' + escapeHtml(t.textContent) + '</span>';
    }).join('');

    // Build optional status row
    const statusRow = status
      ? '<div class="modal-meta-item"><span>Status</span><span>' + escapeHtml(status) + '</span></div>'
      : '';

    modalBody.innerHTML =
      '<h2 id="modalTitle">' + escapeHtml(title) + '</h2>' +
      '<div class="modal-meta-grid">' +
        '<div class="modal-meta-item"><span>Project ID</span><span>' + escapeHtml(projectId) + '</span></div>' +
        '<div class="modal-meta-item"><span>Methodology</span><span>' + escapeHtml(methodology) + '</span></div>' +
        '<div class="modal-meta-item"><span>Type</span><span>' + escapeHtml(type) + '</span></div>' +
        '<div class="modal-meta-item"><span>Country</span><span>' + escapeHtml(country) + '</span></div>' +
        '<div class="modal-meta-item"><span>Annual Volume</span><span>' + escapeHtml(volume) + '</span></div>' +
        statusRow +
      '</div>' +
      '<p>' + escapeHtml(desc) + '</p>' +
      '<div class="pdc-benefits">' + tagsHtml + '</div>';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open on "Details →" button click
  document.getElementById('projectsGrid').addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-detail');
    if (btn) {
      const card = btn.closest('.project-detail-card');
      if (card) openModal(card);
    }
  });

  // Close via × button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // ── Utility ─────────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
