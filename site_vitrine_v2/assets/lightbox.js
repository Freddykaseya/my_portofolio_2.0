const lightbox = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lightbox img');
const closeBtn = document.querySelector('.lightbox .close');

if (lightbox && lbImg && closeBtn) {
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox');
      if (!src) return;
      lbImg.src = src;
      lightbox.classList.add('show');
    });
  });

  closeBtn.addEventListener('click', () => lightbox.classList.remove('show'));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('show');
    }
  });
}

const projectGalleries = new Map();

function updateProjectGallery(id, index) {
  const data = projectGalleries.get(id);
  if (!data) return;
  const total = data.images.length;
  if (total === 0) return;
  const normalized = ((index % total) + total) % total;
  data.index = normalized;
  const nextSrc = data.images[normalized];
  if (data.preview) {
    data.preview.src = nextSrc;
    data.preview.setAttribute('data-lightbox', nextSrc);
  }
  data.thumbs.forEach((btn, idx) => {
    btn.classList.toggle('is-active', idx === normalized);
  });
}

document.querySelectorAll('.project').forEach(project => {
  const galleryId = project.dataset.gallery;
  if (!galleryId) return;
  const previewImg = project.querySelector('.project-preview img');
  const thumbs = Array.from(project.querySelectorAll('.project-thumb'));
  const images = thumbs
    .map(btn => {
      const src = btn.dataset.src;
      if (src) {
        btn.style.backgroundImage = `url('${src}')`;
      }
      return src;
    })
    .filter(Boolean);

  projectGalleries.set(galleryId, {
    preview: previewImg,
    thumbs,
    images,
    index: 0
  });

  thumbs.forEach((btn, idx) => {
    btn.addEventListener('click', () => updateProjectGallery(galleryId, idx));
  });

  const navButtons = Array.from(project.querySelectorAll('.project-nav'));
  if (images.length <= 1) {
    navButtons.forEach(btn => (btn.style.display = 'none'));
  }
  navButtons.forEach(nav => {
    nav.addEventListener('click', () => {
      const data = projectGalleries.get(galleryId);
      if (!data) return;
      const dir = nav.classList.contains('next') ? 1 : -1;
      updateProjectGallery(galleryId, data.index + dir);
    });
  });

  updateProjectGallery(galleryId, 0);
});
