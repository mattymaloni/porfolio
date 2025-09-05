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

        // Ensure Contact highlights when at (or near) the bottom of the page
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

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
            });
        });
    }

    window.addEventListener('hashchange', function () {
        var id = (window.location.hash || '').replace('#', '');
        setActiveNav(id);
    });
});
