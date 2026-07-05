// Loader
document.addEventListener('DOMContentLoaded', async () => {
    await document.fonts.ready;

    document.getElementById('loading').style.display = 'none';
    document.querySelector('form').style.display = 'flex';
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
