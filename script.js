document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Custom Scissor Cursor with Click Snip & Hair Particle Mechanics
  initScissorCursor();

  // 3. Live Hours Status
  initShopHoursStatus();
});

function initScissorCursor() {
  const cursor = document.getElementById('scissor-cursor');
  const particlesContainer = document.getElementById('snip-particles');
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Snip & Spawn Hair particles on Click
  window.addEventListener('mousedown', (e) => {
    cursor.classList.add('snipping');
    spawnHairParticles(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('snipping');
  });

  function spawnHairParticles(x, y) {
    if (!particlesContainer) return;
    const count = 4 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hair-particle';
      
      const width = 8 + Math.random() * 10;
      const height = 2;
      const randX = (Math.random() - 0.5) * 50;
      const randY = 25 + Math.random() * 35;
      const randR = (Math.random() - 0.5) * 120;

      p.style.width = `${width}px`;
      p.style.height = `${height}px`;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty('--rand-x', `${randX}px`);
      p.style.setProperty('--rand-y', `${randY}px`);
      p.style.setProperty('--rand-r', `${randR}deg`);

      particlesContainer.appendChild(p);

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 700);
    }
  }
}

function initShopHoursStatus() {
  const statusElement = document.getElementById('live-status');
  if (!statusElement) return;

  function updateStatus() {
    const now = new Date();
    const saTimeStr = now.toLocaleString("en-US", { timeZone: "America/Chicago" });
    const saTime = new Date(saTimeStr);
    
    const day = saTime.getDay();
    const hour = saTime.getHours();
    const minutes = saTime.getMinutes();
    const timeDecimal = hour + minutes / 60;

    let isOpen = false;
    let text = "CLOSED";

    if (day >= 1 && day <= 5) {
      if (timeDecimal >= 9 && timeDecimal < 18) {
        isOpen = true;
        text = "OPEN NOW";
      } else {
        text = "OPENS 9 AM";
      }
    } else if (day === 6) {
      if (timeDecimal >= 9 && timeDecimal < 17) {
        isOpen = true;
        text = "OPEN NOW";
      } else {
        text = "OPENS 9 AM";
      }
    } else {
      text = "CLOSED TODAY";
    }

    const textEl = statusElement.querySelector('.status-text');
    const indicator = statusElement.querySelector('.status-indicator');

    if (textEl) textEl.textContent = text;
    if (indicator) {
      indicator.className = isOpen ? 'status-indicator live' : 'status-indicator';
      indicator.style.backgroundColor = isOpen ? '#10b981' : '#9ca3af';
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}
