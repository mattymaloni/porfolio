document.addEventListener('DOMContentLoaded', function () {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = [];

    navLinks.forEach(function (link) {
        var hash = link.getAttribute('href');
        if (!hash || hash.charAt(0) !== '#') return;
        var section = document.querySelector(hash);
        if (section) sections.push(section);
    });

    var linkById = navLinks.reduce(function (acc, link) {
        var id = (link.getAttribute('href') || '').replace('#', '');
        if (id) acc[id] = link;
        return acc;
    }, {});

    function setActiveNav(id) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        if (id && linkById[id]) {
            linkById[id].classList.add('active');
        }
    }

    var navbar = document.querySelector('.navbar');
    var navbarHeight = navbar ? navbar.offsetHeight : 0;

    function onScroll() {
        navbarHeight = navbar ? navbar.offsetHeight : 0;
        var scrollPos = window.scrollY + navbarHeight + 20;
        var currentId = sections.length > 0 ? sections[0].id : '';

        for (var i = 0; i < sections.length; i++) {
            var sec = sections[i];
            var top = sec.offsetTop;
            if (scrollPos >= top) {
                currentId = sec.id;
            }
        }

        var viewportBottom = window.scrollY + window.innerHeight;
        var docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        if (viewportBottom >= docHeight - 2 && linkById['contact']) {
            currentId = 'contact';
        }
        setActiveNav(currentId);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');

    var navBackdrop = document.querySelector('.nav-backdrop');

    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        if (navBackdrop) navBackdrop.classList.remove('active');
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (navBackdrop) navBackdrop.classList.toggle('active', isOpen);
        });
        navLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMenu);
        }
    }

    window.addEventListener('hashchange', function () {
        var id = (window.location.hash || '').replace('#', '');
        setActiveNav(id);
    });

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
