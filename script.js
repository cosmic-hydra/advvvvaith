/* ============================================================
   ADVAITH // SF ITINERARY — TERMINAL LOGIC
   NOTE: This is a client-side gate for fun/light privacy only.
   It is NOT real security — anyone can read the source.
   ============================================================ */

(function () {
    "use strict";

    /* ----------------------------------------------------------
       VALID PASSPHRASES (lowercase, case-insensitive match)
    ---------------------------------------------------------- */
    var VALID_PASSPHRASES = ["advaith", "guestjim", "guest1"];

    /* ----------------------------------------------------------
       1. MATRIX DIGITAL RAIN
    ---------------------------------------------------------- */
    var canvas = document.getElementById("matrix");
    var ctx = canvas.getContext("2d");
    var letters = "アァカサタナハマヤャラワガザダバパ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>=/\\".split("");
    var fontSize = 16;
    var columns, drops;

    function initMatrix() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = Math.floor((Math.random() * canvas.height) / fontSize);
        }
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(2, 8, 6, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff7b";
        ctx.font = fontSize + "px monospace";
        for (var i = 0; i < drops.length; i++) {
            var text = letters[Math.floor(Math.random() * letters.length)];
            var x = i * fontSize;
            var y = drops[i] * fontSize;
            // brighten the leading character occasionally
            if (Math.random() > 0.975) {
                ctx.fillStyle = "#caffea";
                ctx.fillText(text, x, y);
                ctx.fillStyle = "#00ff7b";
            } else {
                ctx.fillText(text, x, y);
            }
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    initMatrix();
    var matrixTimer = setInterval(drawMatrix, 45);
    window.addEventListener("resize", initMatrix);

    /* ----------------------------------------------------------
       2. BOOT SEQUENCE
    ---------------------------------------------------------- */
    var bootLog = document.getElementById("boot-log");
    var authBlock = document.getElementById("auth-block");

    var bootLines = [
        "[ BOOT ] initializing secure shell v4.2.1 ...",
        "[  OK  ] kernel modules loaded",
        "[  OK  ] mounting /dev/sf_trip ...",
        "[  OK  ] establishing encrypted uplink :: 256-bit AES",
        "[ SCAN ] probing for authorized operatives ...",
        "[ WARN ] itinerary payload is ENCRYPTED",
        "[ LOCK ] passphrase required to decrypt mission file",
        "",
    ];

    var bootIndex = 0;
    function typeBoot() {
        if (bootIndex < bootLines.length) {
            bootLog.textContent += bootLines[bootIndex] + "\n";
            bootIndex++;
            setTimeout(typeBoot, 230 + Math.random() * 180);
        } else {
            authBlock.hidden = false;
            var input = document.getElementById("passphrase");
            if (input) input.focus();
        }
    }
    setTimeout(typeBoot, 350);

    /* ----------------------------------------------------------
       3. PASSPHRASE AUTHENTICATION
    ---------------------------------------------------------- */
    var authForm = document.getElementById("auth-form");
    var passInput = document.getElementById("passphrase");
    var authMessage = document.getElementById("auth-message");
    var lockScreen = document.getElementById("lock-screen");
    var toggleBtn = document.getElementById("toggle-visibility");
    var attempts = 0;

    toggleBtn.addEventListener("click", function () {
        if (passInput.type === "password") {
            passInput.type = "text";
            toggleBtn.textContent = "[ ◎ ]";
        } else {
            passInput.type = "password";
            toggleBtn.textContent = "[ ◉ ]";
        }
        passInput.focus();
    });

    authForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var entered = passInput.value.trim().toLowerCase();

        if (entered === "") {
            showAuthMessage("error", "> ERR: empty passphrase. try again.");
            return;
        }

        if (VALID_PASSPHRASES.indexOf(entered) !== -1) {
            grantAccess(entered);
        } else {
            attempts++;
            denyAccess();
        }
    });

    function showAuthMessage(type, text) {
        authMessage.className = "auth-message " + type;
        authMessage.textContent = text;
    }

    function denyAccess() {
        showAuthMessage("error", "> ACCESS DENIED :: invalid passphrase [attempt " + attempts + "]");
        lockScreen.classList.add("denied");
        passInput.value = "";
        setTimeout(function () {
            lockScreen.classList.remove("denied");
        }, 500);
    }

    function grantAccess(user) {
        showAuthMessage("success", "> ACCESS GRANTED :: decrypting mission file ...");
        passInput.disabled = true;

        var steps = [
            "> decrypting payload ........ done",
            "> verifying checksum ........ ok",
            "> loading itinerary ......... ok",
            "> welcome, operative :: " + user.toUpperCase(),
        ];
        var i = 0;
        var iv = setInterval(function () {
            if (i < steps.length) {
                authMessage.textContent = steps[i];
                i++;
            } else {
                clearInterval(iv);
                revealSite();
            }
        }, 420);
    }

    function revealSite() {
        var mainSite = document.getElementById("main-site");
        lockScreen.style.transition = "opacity 0.6s ease";
        lockScreen.style.opacity = "0";
        setTimeout(function () {
            lockScreen.hidden = true;
            lockScreen.style.display = "none";
            mainSite.hidden = false;
            buildSite();
            window.scrollTo(0, 0);
        }, 600);
    }

    /* ----------------------------------------------------------
       4. LOCK SESSION (logout)
    ---------------------------------------------------------- */
    function attachLogout() {
        var btn = document.getElementById("logout-btn");
        if (!btn) return;
        btn.addEventListener("click", function () {
            location.reload();
        });
    }

    /* ----------------------------------------------------------
       5. ITINERARY DATA  (edit freely!)
    ---------------------------------------------------------- */
    var ITINERARY = [
        {
            day: "01",
            title: "ARRIVAL // DOWNTOWN RECON",
            date: "Day One",
            events: [
                { time: "10:00", name: "Touchdown @ SFO", tag: "TRANSIT", desc: "Land, grab a Clipper card, BART into the city." },
                { time: "12:30", name: "Check-in + drop bags", tag: "BASE", desc: "Settle into HQ, regroup, recharge." },
                { time: "13:30", name: "Ferry Building Marketplace", tag: "FOOD", desc: "Artisan eats along the Embarcadero waterfront." },
                { time: "15:30", name: "Union Square", tag: "EXPLORE", desc: "Shops, street performers, the heart of downtown." },
                { time: "18:00", name: "Chinatown dinner", tag: "FOOD", desc: "Oldest Chinatown in North America — dim sum + dragon gate." },
                { time: "20:30", name: "Night skyline walk", tag: "CHILL", desc: "Light recon of the city grid after dark." },
            ],
        },
        {
            day: "02",
            title: "THE ICONS // BRIDGE OPS",
            date: "Day Two",
            events: [
                { time: "08:30", name: "Golden Gate Bridge", tag: "PRIORITY", desc: "Walk or bike the most iconic span on the planet." },
                { time: "11:00", name: "Battery Spencer viewpoint", tag: "PHOTO", desc: "Best panoramic shot of the bridge + skyline." },
                { time: "13:00", name: "Sausalito lunch", tag: "FOOD", desc: "Ferry across the bay to a seaside town." },
                { time: "15:30", name: "Palace of Fine Arts", tag: "EXPLORE", desc: "Roman-style rotunda + lagoon, surprisingly serene." },
                { time: "17:30", name: "Lombard Street", tag: "EXPLORE", desc: "The crookedest street in the world — 8 hairpin turns." },
                { time: "19:30", name: "Fisherman's Wharf dinner", tag: "FOOD", desc: "Clam chowder in a sourdough bowl. Non-negotiable." },
            ],
        },
        {
            day: "03",
            title: "THE ROCK // BAY INFILTRATION",
            date: "Day Three",
            events: [
                { time: "09:00", name: "Alcatraz Island tour", tag: "PRIORITY", desc: "Ferry to the legendary former federal prison. Book ahead!" },
                { time: "12:30", name: "Pier 39 + sea lions", tag: "EXPLORE", desc: "Watch the famous sea lion colony bark and lounge." },
                { time: "14:00", name: "Musée Mécanique", tag: "HIDDEN", desc: "Vintage arcade machines + antique penny games." },
                { time: "16:00", name: "Cable car ride", tag: "TRANSIT", desc: "Powell-Hyde line — hang on tight up the hills." },
                { time: "18:00", name: "Ghirardelli Square", tag: "FOOD", desc: "Hot fudge sundae at the original chocolate factory." },
                { time: "20:00", name: "Coit Tower night view", tag: "CHILL", desc: "Telegraph Hill overlook of the glittering bay." },
            ],
        },
        {
            day: "04",
            title: "PARKS & CULTURE // GREEN ZONE",
            date: "Day Four",
            events: [
                { time: "09:30", name: "Golden Gate Park", tag: "EXPLORE", desc: "Bigger than Central Park — gardens, trails, windmills." },
                { time: "11:00", name: "California Academy of Sciences", tag: "INTEL", desc: "Aquarium, planetarium + living rainforest under one roof." },
                { time: "13:30", name: "Haight-Ashbury", tag: "CULTURE", desc: "Birthplace of 1960s counterculture, vinyl + vintage." },
                { time: "15:30", name: "Painted Ladies @ Alamo Sq", tag: "PHOTO", desc: "The iconic Victorian row — full House vibes." },
                { time: "17:30", name: "Mission District", tag: "FOOD", desc: "Legendary burritos + vibrant street murals on Clarion Alley." },
                { time: "20:00", name: "Twin Peaks summit", tag: "CHILL", desc: "360° night view of the entire illuminated city." },
            ],
        },
        {
            day: "05",
            title: "WILDCARD // EXFIL",
            date: "Day Five",
            events: [
                { time: "08:00", name: "Muir Woods redwoods", tag: "NATURE", desc: "Ancient towering redwoods just north of the bridge." },
                { time: "12:00", name: "Last burrito run", tag: "FOOD", desc: "One more for the road. You've earned it." },
                { time: "14:00", name: "Souvenir sweep", tag: "LOOT", desc: "Grab gifts, postcards, and a city pennant." },
                { time: "16:30", name: "Head to SFO", tag: "TRANSIT", desc: "Wrap the mission, BART back to the airport." },
                { time: "19:00", name: "Departure", tag: "EXFIL", desc: "Wheels up. Mission complete. Until next time, SF." },
            ],
        },
    ];

    var INTEL = [
        { title: "WEATHER", body: "Layers are key — SF is foggy & cool year-round. Pack a jacket even in summer (Karl the Fog is real)." },
        { title: "TRANSIT", body: "Get a <span class='key'>Clipper Card</span>. Use Muni, BART, cable cars + ferries. Hills are steep — wear good shoes." },
        { title: "MUST-EAT", body: "Sourdough bread bowl, Mission burrito, dim sum, Ghirardelli sundae, Dungeness crab." },
        { title: "PRO TIPS", body: "Book <span class='key'>Alcatraz</span> tickets weeks ahead. Carry a reusable bag. Tip 18-20%." },
        { title: "SAFETY", body: "Stay aware downtown at night. Don't leave anything visible in parked cars." },
        { title: "PHOTO OPS", body: "Battery Spencer, Twin Peaks, Baker Beach, Alamo Square, Coit Tower at golden hour." },
    ];

    /* ----------------------------------------------------------
       6. BUILD THE SITE
    ---------------------------------------------------------- */
    function buildSite() {
        document.getElementById("year").textContent = new Date().getFullYear();
        attachLogout();
        typeTagline();
        startClock();
        renderDayNav();
        renderItinerary();
        renderIntel();
    }

    /* ---- Tagline typewriter ---- */
    function typeTagline() {
        var el = document.getElementById("tagline");
        var full = ">> 5 days · 1 city · zero downtime — let's run it <<";
        var i = 0;
        el.textContent = "";
        var iv = setInterval(function () {
            el.textContent = full.slice(0, i) + (i % 2 ? "_" : "");
            i++;
            if (i > full.length) {
                el.textContent = full;
                clearInterval(iv);
            }
        }, 40);
    }

    /* ---- Live clock ---- */
    function startClock() {
        var clock = document.getElementById("live-clock");
        function tick() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, "0");
            var m = String(now.getMinutes()).padStart(2, "0");
            var s = String(now.getSeconds()).padStart(2, "0");
            clock.textContent = h + ":" + m + ":" + s;
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ---- Day navigation ---- */
    function renderDayNav() {
        var nav = document.getElementById("day-nav");
        var html = "";
        ITINERARY.forEach(function (d) {
            html += '<a href="#day-' + d.day + '">DAY ' + d.day + "</a>";
        });
        nav.innerHTML = html;
    }

    /* ---- Itinerary cards ---- */
    function renderItinerary() {
        var container = document.getElementById("itinerary");
        var html = "";
        ITINERARY.forEach(function (d) {
            html += '<article class="day-card" id="day-' + d.day + '">';
            html += '  <div class="day-head" role="button" tabindex="0">';
            html += '    <span class="day-num">DAY ' + d.day + "</span>";
            html += '    <span class="day-title">' + d.title + "</span>";
            html += '    <span class="day-date">' + d.date + "</span>";
            html += '    <span class="day-toggle">[ − ]</span>';
            html += "  </div>";
            html += '  <div class="day-body"><ul class="timeline">';
            d.events.forEach(function (ev) {
                html += "<li>";
                html += '<span class="evt-time">' + ev.time + "</span>";
                html += '<span class="evt-name">' + ev.name + "</span>";
                html += '<span class="evt-tag">' + ev.tag + "</span>";
                html += '<span class="evt-desc">' + ev.desc + "</span>";
                html += "</li>";
            });
            html += "</ul></div>";
            html += "</article>";
        });
        container.innerHTML = html;

        // collapse / expand
        var heads = container.querySelectorAll(".day-head");
        heads.forEach(function (head) {
            function toggle() {
                var card = head.closest(".day-card");
                card.classList.toggle("collapsed");
                var t = head.querySelector(".day-toggle");
                t.textContent = card.classList.contains("collapsed") ? "[ + ]" : "[ − ]";
            }
            head.addEventListener("click", toggle);
            head.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    }

    /* ---- Intel cards ---- */
    function renderIntel() {
        var container = document.getElementById("intel-cards");
        var html = "";
        INTEL.forEach(function (item) {
            html += '<div class="intel-card">';
            html += "  <h3>:: " + item.title + "</h3>";
            html += "  <p>" + item.body + "</p>";
            html += "</div>";
        });
        container.innerHTML = html;
    }
})();
