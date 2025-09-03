document.addEventListener('DOMContentLoaded', async () => {
    const select = document.getElementById('emailSelect');
    try {
      const res = await fetch('/api/emails');
      const list = await res.json();
      select.innerHTML = list.map(o =>
        `<option value="${o.email}">${o.email}</option>`
      ).join('');
    } catch (e) {
      console.error(e);
      select.innerHTML = '<option value="">(error loading)</option>';
    }
  });
  