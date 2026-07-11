/* ==========================================================
   LiverCare Pro
   meals.js
========================================================== */

const Meals = {

    storageKey: "livercare_meals",

    meals: {
        breakfast: false,
        morningSnack: false,
        lunch: false,
        eveningSnack: false,
        dinner: false
    },

    init() {

        this.loadToday();

        this.render();

        this.events();

    },

    events() {

        document
            .querySelectorAll(".meal-check")
            .forEach(box => {

                box.onchange = () => {

                    const key = box.dataset.meal;

                    this.meals[key] = box.checked;

                    this.save();

                };

            });

    },

    save() {

        LiverCare.storage.save(
            this.storageKey,
            {
                date: LiverCare.dates.today(),
                meals: this.meals
            }
        );

        Dashboard.refresh();

        LiverCare.reminders.check();

        this.render();

    },

    completed() {

        return Object.values(this.meals)
            .filter(Boolean)
            .length;

    },

    render() {

        document
            .querySelectorAll(".meal-check")
            .forEach(box => {

                box.checked =
                    this.meals[box.dataset.meal];

            });

        const total =
            document.getElementById("mealCount");

        if(total){

            total.innerText =
                `${this.completed()}/5`;

        }

    },

    loadToday() {

        const fallback = {
            breakfast: false,
            morningSnack: false,
            lunch: false,
            eveningSnack: false,
            dinner: false
        };

        const stored =
            LiverCare.storage.load(
                this.storageKey,
                fallback
            );

        if (stored && stored.date && stored.date !== LiverCare.dates.today()) {
            this.meals = fallback;
            return;
        }

        this.meals =
            stored && stored.meals
                ? { ...fallback, ...stored.meals }
                : { ...fallback, ...stored };

    }

};
