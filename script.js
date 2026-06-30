/* ============================================================
   ADVAITH · SAN FRANCISCO ITINERARY — LOGIC
   NOTE: The passphrase gate is a light client-side lock for
   convenience/privacy only. It is NOT real security — anyone
   can read the page source. Do not store secrets here.
   ============================================================ */

(function () {
    "use strict";

    /* ---------- VALID PASSPHRASES (case-insensitive) ---------- */
    var VALID_PASSPHRASES = ["advaith", "guestjim", "guest1"];

    /* ============================================================
       1. AMBIENT DIGITAL RAIN
    ============================================================= */
    var canvas = document.getElementById("matrix");
    var ctx = canvas.getContext("2d");
    var glyphs = "アァカサタナ0123456789ABCDEF<>/=$#".split("");
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
        ctx.fillStyle = "rgba(6, 9, 11, 0.09)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#3fdf86";
        ctx.font = fontSize + "px monospace";
        for (var i = 0; i < drops.length; i++) {
            var text = glyphs[Math.floor(Math.random() * glyphs.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    initMatrix();
    setInterval(drawMatrix, 55);
    window.addEventListener("resize", initMatrix);

    /* ============================================================
       2. BOOT SEQUENCE
    ============================================================= */
    var bootLog = document.getElementById("boot-log");
    var authBlock = document.getElementById("auth-block");

    var bootLines = [
        "$ ssh advaith@sf-itinerary.secure",
        "Establishing encrypted channel ........ [ ok ]",
        "Verifying client certificate .......... [ ok ]",
        "Negotiating AES-256 session key ....... [ ok ]",
        "Loading itinerary manifest ............ [ locked ]",
        "",
        "Authentication required to continue.",
    ];

    var bootIndex = 0;
    function typeBoot() {
        if (bootIndex < bootLines.length) {
            bootLog.textContent += bootLines[bootIndex] + "\n";
            bootIndex++;
            setTimeout(typeBoot, 180 + Math.random() * 140);
        } else {
            authBlock.hidden = false;
            var input = document.getElementById("passphrase");
            if (input) input.focus();
        }
    }
    setTimeout(typeBoot, 300);

    /* ============================================================
       3. PASSPHRASE AUTHENTICATION
    ============================================================= */
    var authForm = document.getElementById("auth-form");
    var passInput = document.getElementById("passphrase");
    var authMessage = document.getElementById("auth-message");
    var lockScreen = document.getElementById("lock-screen");
    var toggleBtn = document.getElementById("toggle-visibility");
    var attempts = 0;

    toggleBtn.addEventListener("click", function () {
        if (passInput.type === "password") {
            passInput.type = "text";
            toggleBtn.textContent = "hide";
        } else {
            passInput.type = "password";
            toggleBtn.textContent = "show";
        }
        passInput.focus();
    });

    authForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var entered = passInput.value.trim().toLowerCase();
        if (entered === "") {
            setMessage("error", "Error: passphrase required.");
            return;
        }
        if (VALID_PASSPHRASES.indexOf(entered) !== -1) {
            grantAccess(entered);
        } else {
            attempts++;
            setMessage("error", "Access denied — invalid passphrase (attempt " + attempts + ").");
            lockScreen.classList.add("denied");
            passInput.value = "";
            setTimeout(function () { lockScreen.classList.remove("denied"); }, 420);
        }
    });

    function setMessage(type, text) {
        authMessage.className = "auth-message " + type;
        authMessage.textContent = text;
    }

    function grantAccess(user) {
        setMessage("success", "Access granted — decrypting itinerary…");
        passInput.disabled = true;
        var steps = [
            "Decrypting manifest ................... [ ok ]",
            "Verifying checksum .................... [ ok ]",
            "Mounting itinerary ................... [ ok ]",
            "Welcome, " + user + ".",
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
        }, 360);
    }

    function revealSite() {
        var mainSite = document.getElementById("main-site");
        lockScreen.style.transition = "opacity 0.5s ease";
        lockScreen.style.opacity = "0";
        setTimeout(function () {
            lockScreen.hidden = true;
            lockScreen.style.display = "none";
            mainSite.hidden = false;
            buildSite();
            window.scrollTo(0, 0);
        }, 500);
    }

    /* ============================================================
       4. DATA — FLIGHTS  (Lufthansa · PNR B39ITJ)
    ============================================================= */
    var FLIGHTS = [
        {
            label: "OUTBOUND",
            from: "BLR",
            to: "SFO",
            date: "Wed, Jul 22, 2026",
            segments: [
                { flight: "LH 765", depTime: "2:10 AM", depCode: "BLR", depCity: "Bengaluru", arrTime: "7:55 AM", arrCode: "MUC", arrCity: "Munich" },
                { flight: "LH 458", depTime: "4:20 PM", depCode: "MUC", depCity: "Munich", arrTime: "7:00 PM", arrCode: "SFO", arrCity: "San Francisco" },
            ],
            layover: "Layover · Munich (MUC) · ~8h 25m",
            foot: ["Lufthansa", "Economy · Y (ECOGREIC)", "PNR: B39ITJ"],
        },
        {
            label: "RETURN",
            from: "SFO",
            to: "BLR",
            date: "Wed, Jul 29, 2026",
            segments: [
                { flight: "LH 455", depTime: "2:40 PM", depCode: "SFO", depCity: "San Francisco", arrTime: "10:25 AM +1", arrCode: "FRA", arrCity: "Frankfurt" },
                { flight: "LH 754", depTime: "12:50 PM +1", depCode: "FRA", depCity: "Frankfurt", arrTime: "1:20 AM +2", arrCode: "BLR", arrCity: "Bengaluru" },
            ],
            layover: "Layover · Frankfurt (FRA) · ~2h 25m",
            foot: ["Lufthansa", "Economy · Y (ECOGREIC)", "PNR: B39ITJ"],
        },
    ];

    /* ============================================================
       5. DATA — ITINERARY (Jul 22 – 29, 2026)
    ============================================================= */
    var ITINERARY = [
        {
            day: "01", date: "Wed · Jul 22", title: "Arrival & Settle In",
            events: [
                { time: "7:00 PM", name: "Land at SFO", tag: "ARRIVAL", desc: "Arrive on LH 458 from Munich. Clear immigration & baggage." },
                { time: "8:00 PM", name: "Transfer to the city", tag: "TRANSIT", desc: "Grab a Clipper card; BART or rideshare to accommodation." },
                { time: "9:00 PM", name: "Check-in & freshen up", tag: "BASE", desc: "Drop bags, settle in, reset after the long haul." },
                { time: "9:30 PM", name: "Light dinner nearby", tag: "FOOD", desc: "Easy meal close to base, then early rest to beat jet lag." },
            ],
        },
        {
            day: "02", date: "Thu · Jul 23", title: "Golden Gate & Waterfront",
            events: [
                { time: "9:00 AM", name: "Golden Gate Bridge", tag: "ICONIC", desc: "Walk or bike across the most famous span in the world." },
                { time: "11:00 AM", name: "Battery Spencer viewpoint", tag: "PHOTO", desc: "Best panoramic shot of the bridge and skyline from Marin." },
                { time: "1:00 PM", name: "Lunch at Crissy Field", tag: "FOOD", desc: "Waterfront picnic with the bridge as your backdrop." },
                { time: "3:00 PM", name: "Palace of Fine Arts", tag: "EXPLORE", desc: "Roman-style rotunda and lagoon — calm and photogenic." },
                { time: "5:00 PM", name: "Fisherman's Wharf & Pier 39", tag: "EXPLORE", desc: "Sea lions, street performers, bay views." },
                { time: "7:30 PM", name: "Clam chowder sourdough bowl", tag: "FOOD", desc: "Classic SF dinner on the waterfront. Non-negotiable." },
            ],
        },
        {
            day: "03", date: "Fri · Jul 24", title: "Alcatraz, Cable Cars & Downtown",
            events: [
                { time: "9:00 AM", name: "Alcatraz Island tour", tag: "PRIORITY", desc: "Ferry to the legendary former federal prison. Book ahead!" },
                { time: "12:30 PM", name: "Lombard Street", tag: "EXPLORE", desc: "The famous crooked street — eight hairpin turns." },
                { time: "2:00 PM", name: "Cable car ride", tag: "TRANSIT", desc: "Powell–Hyde line up and over the hills." },
                { time: "3:30 PM", name: "Union Square", tag: "EXPLORE", desc: "Downtown shopping and the heart of the city." },
                { time: "5:00 PM", name: "Chinatown walk", tag: "CULTURE", desc: "Oldest Chinatown in North America — Dragon Gate & alleys." },
                { time: "7:00 PM", name: "Dinner in North Beach", tag: "FOOD", desc: "Little Italy: pasta, pizza, and people-watching." },
            ],
        },
        {
            day: "04", date: "Sat · Jul 25", title: "YC Startup School — Day 1",
            badge: "YC", yc: true,
            events: [
                { time: "All day", name: "YC Startup School", tag: "RESERVED", desc: "Reserved for Y Combinator Startup School. Talks, sessions & workshops." },
                { time: "Evening", name: "Founder networking", tag: "NETWORK", desc: "Meet founders & operators; trade notes over dinner." },
            ],
        },
        {
            day: "05", date: "Sun · Jul 26", title: "YC Startup School — Day 2",
            badge: "YC", yc: true,
            events: [
                { time: "All day", name: "YC Startup School", tag: "RESERVED", desc: "Reserved for Y Combinator Startup School. Final sessions & wrap-up." },
                { time: "Evening", name: "Decompress & explore", tag: "CHILL", desc: "Wind down with a relaxed evening near the venue." },
            ],
        },
        {
            day: "06", date: "Mon · Jul 27", title: "Parks, Museums & Culture",
            events: [
                { time: "9:30 AM", name: "Golden Gate Park", tag: "EXPLORE", desc: "Bigger than Central Park — gardens, trails & windmills." },
                { time: "10:30 AM", name: "California Academy of Sciences", tag: "INTEL", desc: "Aquarium, planetarium and a living rainforest under one roof." },
                { time: "1:00 PM", name: "Haight-Ashbury", tag: "CULTURE", desc: "Birthplace of 1960s counterculture; vinyl & vintage." },
                { time: "3:00 PM", name: "Painted Ladies, Alamo Square", tag: "PHOTO", desc: "The iconic Victorian row against the skyline." },
                { time: "5:00 PM", name: "Mission District", tag: "FOOD", desc: "Legendary burritos and vibrant murals on Clarion Alley." },
                { time: "8:00 PM", name: "Twin Peaks night view", tag: "CHILL", desc: "360° overlook of the whole illuminated city." },
            ],
        },
        {
            day: "07", date: "Tue · Jul 28", title: "Silicon Valley Tech Tour",
            events: [
                { time: "9:00 AM", name: "Head south to the Valley", tag: "TRANSIT", desc: "Caltrain or drive down the peninsula." },
                { time: "10:30 AM", name: "Stanford University", tag: "EXPLORE", desc: "Walk the campus, Memorial Church & the Dish trail." },
                { time: "12:30 PM", name: "Lunch on University Ave", tag: "FOOD", desc: "Palo Alto's startup-famous main street." },
                { time: "2:00 PM", name: "Googleplex & Android lawn", tag: "TECH", desc: "Mountain View — the classic tech-pilgrimage photo stop." },
                { time: "3:30 PM", name: "Apple Park Visitor Center", tag: "TECH", desc: "Cupertino — rooftop terrace, AR model & store." },
                { time: "6:30 PM", name: "Farewell dinner back in SF", tag: "FOOD", desc: "Last big night in the city." },
            ],
        },
        {
            day: "08", date: "Wed · Jul 29", title: "Departure",
            events: [
                { time: "9:00 AM", name: "Checkout & pack", tag: "BASE", desc: "Final sweep for belongings; grab any last souvenirs." },
                { time: "11:00 AM", name: "Farewell brunch", tag: "FOOD", desc: "One last SF meal before heading out." },
                { time: "12:00 PM", name: "Head to SFO", tag: "TRANSIT", desc: "Allow buffer time for an international departure." },
                { time: "2:40 PM", name: "Depart on LH 455", tag: "EXFIL", desc: "Wheels up to Frankfurt, onward to Bengaluru. Trip complete." },
            ],
        },
    ];

    /* ============================================================
       6. DATA — TRAVEL INTEL
    ============================================================= */
    var INTEL = [
        { title: "Weather", body: "SF summers are cool & foggy — pack layers and a jacket even in July. <span class='key'>Karl the Fog</span> is real." },
        { title: "Getting Around", body: "Get a <span class='key'>Clipper Card</span> for Muni, BART, cable cars & ferries. Hills are steep — comfortable shoes." },
        { title: "YC Startup School", body: "Jul 25–26 is reserved. Bring a laptop, business cards and a charged phone; line up <span class='key'>meetups</span> in advance." },
        { title: "Connectivity", body: "Grab a local eSIM on arrival. Most cafés have Wi-Fi; download offline maps of the city as backup." },
        { title: "Money & Tipping", body: "Cards accepted nearly everywhere. Tip <span class='key'>18–20%</span> at restaurants; carry a little cash for small vendors." },
        { title: "Must-Eat", body: "Sourdough bread bowl, a Mission burrito, dim sum in Chinatown, and a Ghirardelli sundae." },
        { title: "Book Ahead", body: "Reserve <span class='key'>Alcatraz</span> tickets weeks in advance — they sell out fast in summer." },
        { title: "Stay Safe", body: "Be aware downtown after dark and never leave valuables visible in a parked car." },
    ];

    /* ============================================================
       7. BUILD SITE
    ============================================================= */
    function buildSite() {
        document.getElementById("year").textContent = new Date().getFullYear();
        document.getElementById("logout-btn").addEventListener("click", function () {
            location.reload();
        });
        startClock();
        renderOverview();
        renderFlights();
        renderDayNav();
        renderItinerary();
        renderIntel();
    }

    /* ---- SF live clock ---- */
    function startClock() {
        var clock = document.getElementById("live-clock");
        function tick() {
            try {
                clock.textContent = new Date().toLocaleTimeString("en-US", {
                    timeZone: "America/Los_Angeles",
                    hour12: false,
                });
            } catch (e) {
                clock.textContent = new Date().toLocaleTimeString();
            }
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ---- Overview stats ---- */
    function renderOverview() {
        var grid = document.getElementById("overview-grid");

        // Countdown to BLR departure (Jul 22, 2026, 02:10 IST)
        var departure = new Date("2026-07-22T02:10:00+05:30");
        var msLeft = departure.getTime() - Date.now();
        var daysLeft = Math.ceil(msLeft / 86400000);
        var countdown, countdownSub;
        if (daysLeft > 0) {
            countdown = "T‑" + daysLeft + "d";
            countdownSub = "until wheels up";
        } else if (daysLeft <= 0 && Date.now() < new Date("2026-07-29T23:59:00-07:00").getTime()) {
            countdown = "In progress";
            countdownSub = "enjoy the city";
        } else {
            countdown = "Complete";
            countdownSub = "mission accomplished";
        }

        var stats = [
            { label: "Dates", value: "Jul 22 – 29", sub: "2026" },
            { label: "Duration", value: "8 days", sub: "7 nights" },
            { label: "Base", value: "San Francisco", sub: "California, USA" },
            { label: "Purpose", value: "YC + Explore", sub: "Startup School Jul 25–26" },
            { label: "Airline", value: "Lufthansa", sub: "PNR B39ITJ · Economy" },
            { label: "Countdown", value: countdown, sub: countdownSub },
        ];

        var html = "";
        stats.forEach(function (s) {
            html += '<div class="stat">';
            html += '<div class="stat-label">' + s.label + "</div>";
            html += '<div class="stat-value">' + s.value + "</div>";
            html += '<div class="stat-sub">' + s.sub + "</div>";
            html += "</div>";
        });
        grid.innerHTML = html;
    }

    /* ---- Flights ---- */
    function renderFlights() {
        var container = document.getElementById("flights");
        var html = "";
        FLIGHTS.forEach(function (f) {
            html += '<article class="flight-card">';
            html += '  <div class="flight-card-head">';
            html += '    <div class="fc-route"><span>' + f.from + '</span><span class="fc-arrow">&rarr;</span><span>' + f.to + "</span></div>";
            html += '    <div class="fc-meta"><span class="fc-label">' + f.label + '</span><span class="fc-date">' + f.date + "</span></div>";
            html += "  </div>";
            html += '  <div class="flight-segments">';
            f.segments.forEach(function (s, idx) {
                html += '<div class="segment">';
                html += '  <div class="seg-flight">' + s.flight + "</div>";
                html += '  <div class="seg-grid">';
                html += '    <div class="seg-point"><span class="seg-time">' + s.depTime + '</span><span class="seg-code">' + s.depCode + '</span><span class="seg-city">' + s.depCity + "</span></div>";
                html += '    <div class="seg-path"><span class="seg-plane">&#9992;</span></div>';
                html += '    <div class="seg-point end"><span class="seg-time">' + s.arrTime + '</span><span class="seg-code">' + s.arrCode + '</span><span class="seg-city">' + s.arrCity + "</span></div>";
                html += "  </div>";
                html += "</div>";
                if (idx === 0 && f.layover) {
                    html += '<div class="layover">&#8635; ' + f.layover + "</div>";
                }
            });
            html += "  </div>";
            html += '  <div class="flight-card-foot">';
            f.foot.forEach(function (item) { html += "<span>" + item + "</span>"; });
            html += "  </div>";
            html += "</article>";
        });
        container.innerHTML = html;
    }

    /* ---- Day nav ---- */
    function renderDayNav() {
        var nav = document.getElementById("day-nav");
        var html = "";
        ITINERARY.forEach(function (d) {
            html += '<a class="' + (d.yc ? "yc" : "") + '" href="#day-' + d.day + '">Day ' + d.day + (d.yc ? " · YC" : "") + "</a>";
        });
        nav.innerHTML = html;
    }

    /* ---- Itinerary ---- */
    function renderItinerary() {
        var container = document.getElementById("itinerary");
        var html = "";
        ITINERARY.forEach(function (d) {
            html += '<article class="day-card ' + (d.yc ? "yc" : "") + '" id="day-' + d.day + '">';
            html += '  <div class="day-head" role="button" tabindex="0">';
            html += '    <span class="day-num">DAY ' + d.day + "</span>";
            html += '    <span class="day-headings"><span class="day-title">' + d.title + '</span><br><span class="day-date">' + d.date + "</span></span>";
            if (d.badge) html += '    <span class="day-badge">' + d.badge + "</span>";
            html += '    <span class="day-toggle">[ &minus; ]</span>';
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

        var heads = container.querySelectorAll(".day-head");
        heads.forEach(function (head) {
            function toggle() {
                var card = head.closest(".day-card");
                card.classList.toggle("collapsed");
                var t = head.querySelector(".day-toggle");
                t.innerHTML = card.classList.contains("collapsed") ? "[ + ]" : "[ &minus; ]";
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

    /* ---- Intel ---- */
    function renderIntel() {
        var container = document.getElementById("intel-cards");
        var html = "";
        INTEL.forEach(function (item) {
            html += '<div class="intel-card"><h3>' + item.title + "</h3><p>" + item.body + "</p></div>";
        });
        container.innerHTML = html;
    }
})();
