document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.menu-btn');
    var nav = document.querySelector('.nav');

    if (btn && nav) {
        btn.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.textContent = open ? 'Close' : 'Menu';
        });
    }

    // Featured carousel on the home page
    var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    var count = document.getElementById('slide-count');
    var current = 0;

    function show(i) {
        current = (i + slides.length) % slides.length;
        slides.forEach(function (el, n) { el.hidden = n !== current; });
        if (count) count.textContent = (current + 1) + ' / ' + slides.length;
    }

    if (slides.length) {
        slides.forEach(function (slide) {
            slide.querySelector('.slide-btn.prev').addEventListener('click', function () { show(current - 1); });
            slide.querySelector('.slide-btn.next').addEventListener('click', function () { show(current + 1); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.target.closest && e.target.closest('input, textarea')) return;
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });
    }

    // Contact form: submit to Netlify Forms via fetch, show inline status
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');

    function encode(data) {
        return Object.keys(data)
            .map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            })
            .join('&');
    }

    if (form && status) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var formData = new FormData(form);
            var payload = {};
            formData.forEach(function (value, key) { payload[key] = value; });

            status.textContent = 'Sending…';
            status.className = 'form-status';

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encode(payload)
            })
                .then(function () {
                    status.textContent = 'Thanks — I\'ll get back to you soon.';
                    status.className = 'form-status success';
                    form.reset();
                })
                .catch(function () {
                    status.textContent = 'Something went wrong. Email me directly instead.';
                    status.className = 'form-status error';
                });
        });
    }
});
