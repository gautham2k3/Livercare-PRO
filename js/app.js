/* ==========================================================
   LiverCare Pro
   app.js
   Core Application
========================================================== */

const LiverCare = {

    version: "1.0.0",

    init() {

        console.log(`LiverCare Pro v${this.version}`);

        this.theme.init();

        this.ui.init();

        this.events();

        this.reminders.init();

    },

    events() {

        window.addEventListener("storage", (e) => {

            console.log("Storage Updated:", e.key);

        });

    },

    dates: {

        today() {

            const now = new Date();
            const offset = now.getTimezoneOffset();

            return new Date(now.getTime() - offset * 60000)
                .toISOString()
                .split("T")[0];

        }

    },

    theme: {

        init() {

            const button = document.getElementById("themeBtn");

            const savedTheme =
                localStorage.getItem("theme") || "light";

            if (savedTheme === "dark") {

                document.body.classList.add("dark");

                this.updateIcon(true);

            }

            button.addEventListener("click", () => {

                document.body.classList.toggle("dark");

                const dark =
                    document.body.classList.contains("dark");

                localStorage.setItem(
                    "theme",
                    dark ? "dark" : "light"
                );

                this.updateIcon(dark);

                LiverCare.ui.toast(
                    dark
                        ? "Dark Mode Enabled"
                        : "Light Mode Enabled"
                );

            });

        },

        updateIcon(dark) {

            const icon =
                document.querySelector("#themeBtn i");

            icon.className = dark
                ? "bi bi-sun-fill"
                : "bi bi-moon-stars-fill";

        }

    },

    ui: {

        init() {

            this.fadeIn();

        },

        fadeIn() {

            document.body.animate(

                [
                    {
                        opacity: 0,
                        transform: "translateY(15px)"
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)"
                    }

                ],

                {
                    duration: 500,
                    easing: "ease-out"
                }

            );

        },

        toast(message) {

            let toast =
                document.createElement("div");

            toast.className = "lc-toast";

            toast.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                <span>${message}</span>
            `;

            document.body.appendChild(toast);

            requestAnimationFrame(() => {

                toast.classList.add("show");

            });

            setTimeout(() => {

                toast.classList.remove("show");

                setTimeout(() => {

                    toast.remove();

                }, 300);

            }, 2500);

        }

    },

    storage: {

        save(key, value) {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        },

        load(key, fallback = null) {

            const value =
                localStorage.getItem(key);

            if (!value) return fallback;

            try {
                return JSON.parse(value);
            } catch (error) {
                console.warn(`Invalid storage value for ${key}`, error);
                return fallback;
            }

        },

        remove(key) {

            localStorage.removeItem(key);

        }

    },

    reminders: {

        intervalId: null,

        init() {

            this.check();

            if (this.intervalId) {
                clearInterval(this.intervalId);
            }

            this.intervalId = setInterval(
                () => this.check(),
                60000
            );

        },

        check() {

            const today =
                LiverCare.dates.today();

            const hour =
                new Date().getHours();

            const notifications =
                LiverCare.storage.load(
                    "livercare_notifications",
                    {}
                );

            const waterData =
                LiverCare.storage.load(
                    "livercare_water",
                    0
                );

            const medicineData =
                LiverCare.storage.load(
                    "livercare_medicine",
                    {}
                );

            const waterCount =
                typeof waterData === "number"
                    ? waterData
                    : waterData.date === today
                    ? waterData.count || 0
                    : 0;

            const medicine =
                medicineData.date === today
                    ? medicineData.schedule || {}
                    : {};

            const messages = [];

            if (hour >= 9 && hour < 12 && !medicine.morning) {
                messages.push({
                    id: `${today}-morning-med`,
                    text: "Morning medicine is still pending."
                });
            }

            if (hour >= 14 && hour < 17 && !medicine.afternoon) {
                messages.push({
                    id: `${today}-afternoon-med`,
                    text: "Afternoon medicine is still pending."
                });
            }

            if (hour >= 20 && hour < 23 && !medicine.night) {
                messages.push({
                    id: `${today}-night-med`,
                    text: "Night medicine is still pending."
                });
            }

            if (hour >= 13 && waterCount < 4) {
                messages.push({
                    id: `${today}-water-midday`,
                    text: "Hydration is low today. Try another glass of water."
                });
            }

            if (hour >= 18 && waterCount < 6) {
                messages.push({
                    id: `${today}-water-evening`,
                    text: "Water goal is behind schedule for today."
                });
            }

            for (const message of messages) {
                if (notifications[message.id]) {
                    continue;
                }

                LiverCare.ui.toast(message.text);
                notifications[message.id] = true;
            }

            LiverCare.storage.save(
                "livercare_notifications",
                notifications
            );

        }

    }

};

document.addEventListener("DOMContentLoaded", () => {

    LiverCare.init();

});
