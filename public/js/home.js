// Loader
document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/active-question');
    const html = await res.text();

    document.getElementById('question').innerHTML = html;
    document.body.style.visibility = 'visible';
});

document.addEventListener('fx:before', (evt) => {
    const form = evt.target.closest('form') ?? evt.target;

    form.querySelectorAll('input, button, select, textarea').forEach((el) => (el.disabled = true));
});

document.addEventListener('fx:after', (evt) => {
    const form = evt.target.closest('form') ?? evt.target;

    form.querySelectorAll('input, button, select, textarea').forEach((el) => (el.disabled = false));

    document.getElementById('answer').value = '';
});
