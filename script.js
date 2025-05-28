// Simple mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
  
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  });
  