/* ==========================================================
   LiverCare Pro
   water.js
========================================================== */

const Water = {

    storageKey: "livercare_water",

    goal: 8,

    count: 0,

    init() {

        this.loadToday();

        this.render();

        this.events();

    },

    events() {

        const add = document.getElementById("addWater");
        const remove = document.getElementById("removeWater");

        if (add)
            add.onclick = () => this.add();

        if (remove)
            remove.onclick = () => this.remove();

    },

    add() {

        if (this.count >= this.goal) return;

        this.count++;

        this.save();

    },

    remove() {

        if (this.count <= 0) return;

        this.count--;

        this.save();

    },

    save() {

        LiverCare.storage.save(
            this.storageKey,
            {
                date: LiverCare.dates.today(),
                count: this.count
            }
        );

        this.render();

        Dashboard.refresh();

        LiverCare.reminders.check();

        LiverCare.ui.toast(
            `💧 ${this.count}/${this.goal} Glasses`
        );

    },

    render() {

        const count =
            document.getElementById("waterCount");

        if (count)
            count.innerText =
                `${this.count}/${this.goal}`;

        const progress =
            document.getElementById("waterProgress");

        if (progress) {

            progress.style.width =
                `${(this.count / this.goal) * 100}%`;

        }

    },

    loadToday() {

        const stored =
            LiverCare.storage.load(
                this.storageKey,
                0
            );

        if (typeof stored === "number") {
            this.count = stored;
            return;
        }

        if (stored && stored.date === LiverCare.dates.today()) {
            this.count = stored.count || 0;
            return;
        }

        this.count = 0;

    }

};
