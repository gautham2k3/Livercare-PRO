/* ==========================================================
   LiverCare Pro
   dashboard.js
========================================================== */

const Dashboard = {

    data: {
        recoveryScore: 82,
        water: 0,
        waterGoal: 8,
        meals: 0,
        mealGoal: 5,
        medicine: false,
        sleep: 0,
        weight: "--",
        bilirubin: "--",
        streak: 0,
        status: "No records yet",
        trendTitle: "Add health entries to see recovery trends.",
        trendText: "We will compare your latest records and highlight changes."
    },

    init() {

        this.load();

        this.render();

    },

    load() {

        // ---------- Tracker ----------
        const health =
            LiverCare.storage.load(
                "livercare_health",
                []
            );

        const waterData =
            LiverCare.storage.load(
                "livercare_water",
                0
            );

        const mealsData =
            LiverCare.storage.load(
                "livercare_meals",
                {}
            );

        const medicineData =
            LiverCare.storage.load(
                "livercare_medicine",
                {}
            );

        this.data.water =
            typeof waterData === "number"
                ? waterData
                : waterData.date === LiverCare.dates.today()
                ? waterData.count || 0
                : 0;

        if (health.length > 0) {

            const latest = health[0];

            this.data.bilirubin =
                latest.bilirubin;

            this.data.weight =
                latest.weight;

            this.data.sleep =
                latest.sleep;

            this.data.recoveryScore =
                Tracker.calculateScore(latest);

            this.data.streak =
                this.calculateStreak(health);

            const trend =
                this.calculateTrend(health);

            this.data.trendTitle =
                trend.title;

            this.data.trendText =
                trend.text;

        }
        else {
            this.data.status = "No records yet";
        }

        this.data.meals =
            Object.values(
                mealsData.date === LiverCare.dates.today()
                    ? mealsData.meals || {}
                    : mealsData
            )
                .filter(Boolean)
                .length;

        this.data.medicine =
            Object.values(
                medicineData.date === LiverCare.dates.today()
                    ? medicineData.schedule || {}
                    : medicineData
            )
                .filter(Boolean)
                .length;

        // ---------- Streak ----------
        if (health.length === 0) {
            this.data.streak =
                LiverCare.storage.load(
                    "recoveryStreak",
                    0
                );
        }

    },

    render() {

        this.set("score", `${this.data.recoveryScore}%`);
        this.set("dashboardBilirubin", this.data.bilirubin);
        this.set("dashboardWeight", `${this.data.weight} kg`);
        this.set("dashboardStreak", `🔥 ${this.data.streak} Days`);
        this.set("dashboardTrendTitle", this.data.trendTitle);
        this.set("dashboardTrendText", this.data.trendText);
        this.set("dashboardStatus", this.data.status);
        this.set("dashboardScoreCaption", this.getScoreCaption());
        this.set("dashboardHydration", `${this.data.water}/${this.data.waterGoal} glasses`);
        this.set("dashboardMeals", `${this.data.meals}/${this.data.mealGoal} meals`);
        this.set("dashboardSleep", `${this.data.sleep} hrs sleep`);

        this.setRing(this.data.recoveryScore);

        this.updateCard(
            "Water",
            `${this.data.water}/${this.data.waterGoal} Glasses`
        );

        this.updateCard(
            "Meals",
            `${this.data.meals}/${this.data.mealGoal} Meals`
        );

        this.updateCard(
            "Medicine",
            `${this.data.medicine}/3`
        );

        this.updateCard(
            "Sleep",
            `${this.data.sleep} hrs`
        );

    },

    updateCard(title, value) {

        document
            .querySelectorAll(".info-card")
            .forEach(card => {

                const heading =
                    card.querySelector("h5");

                if (
                    heading &&
                    heading.innerText === title
                ) {

                    card.querySelector("p")
                        .innerText = value;

                }

            });

    },

    set(id, value) {

        const element =
            document.getElementById(id);

        if (element)
            element.innerText = value;

    },

    setRing(score) {

        const ring =
            document.querySelector(".hero-progress-fill");

        const badge =
            document.querySelector(".hero-score-badge");

        if (badge) {
            badge.innerHTML = `${score}%`;
        }

        if (!ring) return;

        ring.style.width = `${Math.max(0, Math.min(score, 100))}%`;

    },

    refresh() {

        this.load();

        this.render();

    },

    calculateStreak(entries) {

        if (!entries.length) return 0;

        const sorted = [...entries]
            .filter((entry) => entry.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        let streak = 0;
        let previousDate = null;

        for (const entry of sorted) {
            if (Tracker.calculateScore(entry) < 80) {
                break;
            }

            const currentDate = new Date(entry.date);

            if (Number.isNaN(currentDate.getTime())) {
                break;
            }

            if (!previousDate) {
                streak = 1;
                previousDate = currentDate;
                continue;
            }

            const diffDays = Math.round(
                (previousDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 1) {
                streak += 1;
                previousDate = currentDate;
                continue;
            }

            break;
        }

        LiverCare.storage.save("recoveryStreak", streak);
        return streak;

    },

    calculateTrend(entries) {

        if (entries.length < 2) {
            return {
                title: "Keep logging daily",
                text: "Add at least two health records to see whether recovery is improving."
            };
        }

        const [latest, previous] = entries;
        const bilirubinDiff =
            Number(previous.bilirubin) - Number(latest.bilirubin);
        const scoreDiff =
            Tracker.calculateScore(latest) - Tracker.calculateScore(previous);

        if (bilirubinDiff > 0.2 || scoreDiff >= 10) {
            this.data.status = "Improving";
            return {
                title: "Recovery trend is improving",
                text: `Bilirubin dropped by ${bilirubinDiff.toFixed(1)} and your score improved by ${scoreDiff} points.`
            };
        }

        if (bilirubinDiff < -0.2 || scoreDiff <= -10) {
            this.data.status = "Needs attention";
            return {
                title: "Recovery needs attention",
                text: `Bilirubin increased by ${Math.abs(bilirubinDiff).toFixed(1)} or recovery score slipped by ${Math.abs(scoreDiff)} points.`
            };
        }

        this.data.status = "Steady";
        return {
            title: "Recovery is steady",
            text: "Your latest health record is close to the previous one. Keep hydration, food, and rest consistent."
        };

    },

    getScoreCaption() {

        if (this.data.recoveryScore >= 85) {
            return "Strong recovery rhythm";
        }

        if (this.data.recoveryScore >= 70) {
            return "Good progress, keep it consistent";
        }

        if (this.data.recoveryScore >= 55) {
            return "Recovery needs a bit more support";
        }

        return "Take it easy and monitor closely";

    }

};
