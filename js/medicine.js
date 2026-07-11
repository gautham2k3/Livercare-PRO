/* ==========================================================
   LiverCare Pro
   medicine.js
========================================================== */

const Medicine = {

    storageKey: "livercare_medicine",

    schedule: {
        morning: false,
        afternoon: false,
        night: false
    },

    init() {

        this.loadToday();

        this.render();

        this.events();

    },

    events() {

        document
            .querySelectorAll(".medicine-check")
            .forEach(box => {

                box.onchange = () => {

                    const key = box.dataset.time;

                    this.schedule[key] = box.checked;

                    this.save();

                };

            });

    },

    save() {

        LiverCare.storage.save(
            this.storageKey,
            {
                date: LiverCare.dates.today(),
                schedule: this.schedule
            }
        );

        Dashboard.refresh();

        this.render();

        LiverCare.reminders.check();

        LiverCare.ui.toast("Medicine updated");

    },

    completed() {

        return Object.values(this.schedule)
            .filter(Boolean)
            .length;

    },

    render() {

        document
            .querySelectorAll(".medicine-check")
            .forEach(box => {

                box.checked =
                    this.schedule[box.dataset.time];

            });

        const progress =
            document.getElementById("medicineCount");

        if(progress){

            progress.innerText =
                `${this.completed()}/3`;

        }

    },

    loadToday() {

        const fallback = {
            morning: false,
            afternoon: false,
            night: false
        };

        const stored =
            LiverCare.storage.load(
                this.storageKey,
                fallback
            );

        if (stored && stored.date && stored.date !== LiverCare.dates.today()) {
            this.schedule = fallback;
            return;
        }

        this.schedule =
            stored && stored.schedule
                ? { ...fallback, ...stored.schedule }
                : { ...fallback, ...stored };

    }

};
