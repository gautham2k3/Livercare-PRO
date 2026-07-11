/* ==========================================================
   LiverCare Pro
   tracker.js
========================================================== */

const Tracker = {

    storageKey: "livercare_health",

    entries: [],

    init() {

        this.entries =
            LiverCare.storage.load(
                this.storageKey,
                []
            );

        this.prefillDate();

        this.render();

        this.events();

    },

    events() {

        const save =
            document.getElementById("saveHealth");

        if (!save) return;

        save.onclick = () => this.save();

    },

    save() {

        const entry = this.readForm();

        const validation =
            this.validate(entry);

        if (!validation.valid) {
            LiverCare.ui.toast(validation.message);
            return;
        }

        this.entries.unshift(entry);

        this.entries.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        LiverCare.storage.save(
            this.storageKey,
            this.entries
        );

        LiverCare.ui.toast("Health data saved");

        this.prefillDate();
        this.clearOptionalFields();
        this.render();
        Dashboard.refresh();
    },

    readForm() {

        return {

            date:
                document.getElementById("date").value,

            bilirubin:
                this.parseNumber(
                    document.getElementById("bilirubin").value
                ),

            sgot:
                this.parseNumber(
                    document.getElementById("sgot").value,
                    false
                ),

            sgpt:
                this.parseNumber(
                    document.getElementById("sgpt").value,
                    false
                ),

            alp:
                this.parseNumber(
                    document.getElementById("alp").value,
                    false
                ),

            weight:
                this.parseNumber(
                    document.getElementById("weight").value
                ),

            water:
                this.parseNumber(
                    document.getElementById("water").value
                ),

            sleep:
                this.parseNumber(
                    document.getElementById("sleep").value
                ),

            symptoms:
                document.getElementById("symptoms").value.trim(),

            notes:
                document.getElementById("notes").value.trim()

        };

    },

    validate(entry) {

        if (!entry.date) {
            return {
                valid: false,
                message: "Please select the record date."
            };
        }

        const required = [
            ["bilirubin", "Please enter bilirubin."],
            ["weight", "Please enter weight."],
            ["water", "Please enter water intake."],
            ["sleep", "Please enter sleep hours."]
        ];

        for (const [field, message] of required) {
            if (entry[field] === null || Number.isNaN(entry[field])) {
                return {
                    valid: false,
                    message
                };
            }
        }

        const numericFields = ["bilirubin", "sgot", "sgpt", "alp", "weight", "water", "sleep"];

        for (const field of numericFields) {
            if (entry[field] !== null && (Number.isNaN(entry[field]) || entry[field] < 0)) {
                return {
                    valid: false,
                    message: `Please enter a valid ${field} value.`
                };
            }
        }

        return { valid: true };

    },

    render() {

        const history =
            document.getElementById("history");

        if (!history) return;

        history.innerHTML = "";

        if (this.entries.length === 0) {

            history.innerHTML = `

<div class="alert alert-info">

No health records yet.

</div>

`;

            return;

        }

        this.renderTrends();

        this.entries.forEach((item,index)=>{

            history.innerHTML += `

<div class="card mt-3 shadow-sm">

<div class="card-body">

<div class="d-flex justify-content-between">

<h5>

${item.date}

</h5>

<button

class="btn btn-sm btn-outline-danger"

onclick="Tracker.remove(${index})">

Delete

</button>

</div>

<hr>

<div class="row">

<div class="col-6">

<strong>Bilirubin</strong>

<p>${item.bilirubin}</p>

</div>

<div class="col-6">

<strong>SGOT</strong>

<p>${item.sgot}</p>

</div>

<div class="col-6">

<strong>SGPT</strong>

<p>${item.sgpt}</p>

</div>

<div class="col-6">

<strong>ALP</strong>

<p>${item.alp}</p>

</div>

<div class="col-6">

<strong>Weight</strong>

<p>${item.weight} kg</p>

</div>

<div class="col-6">

<strong>Water</strong>

<p>${item.water} Glasses</p>

</div>

<div class="col-6">

<strong>Sleep</strong>

<p>${item.sleep} hrs</p>

</div>

<div class="col-6">

<strong>Symptoms</strong>

<p>${item.symptoms}</p>

</div>

</div>

<!-- Recovery Score -->
<div class="alert ${
    this.calculateScore(item) >= 80
        ? "alert-success"
        : this.calculateScore(item) >= 60
        ? "alert-warning"
        : "alert-danger"
} mt-3">

<strong>Recovery Score:</strong>

${this.calculateScore(item)}%

</div>

<!-- Notes -->
${item.notes ? `

<div class="mt-3">

    <strong>Notes</strong>

    <p>${item.notes}</p>

</div>

` : ""}

</div>

</div>
`;

        })
        Charts.init(this.entries);

    },

    remove(index){

        this.entries.splice(index,1);

        LiverCare.storage.save(

            this.storageKey,

            this.entries

        );

        this.render();
        Dashboard.refresh();
    },

    renderTrends() {

        const history =
            document.getElementById("history");

        if (!history || this.entries.length < 2) {
            return;
        }

        const latest =
            this.entries[0];

        const previous =
            this.entries[1];

        const bilirubinDelta =
            Number(previous.bilirubin) - Number(latest.bilirubin);

        const sleepDelta =
            Number(latest.sleep) - Number(previous.sleep);

        history.innerHTML += `
<div class="glass p-4 mb-3">
<h4 class="mb-3">Trend Summary</h4>
<div class="trend-grid">
<div class="trend-card ${bilirubinDelta > 0 ? "good" : bilirubinDelta < 0 ? "bad" : ""}">
<small>Bilirubin</small>
<strong>${bilirubinDelta > 0 ? "Improving" : bilirubinDelta < 0 ? "Higher" : "Stable"}</strong>
<p>${Math.abs(bilirubinDelta).toFixed(1)} change from previous entry</p>
</div>
<div class="trend-card ${sleepDelta >= 0 ? "good" : "bad"}">
<small>Sleep</small>
<strong>${sleepDelta >= 0 ? "Better Rest" : "Less Rest"}</strong>
<p>${Math.abs(sleepDelta)} hour difference from previous entry</p>
</div>
</div>
</div>
`;

    },

    calculateScore(entry){

        let score = 100;

        if(entry.bilirubin > 1.2)
            score -= 20;

        if(entry.sgot > 40)
            score -= 15;

        if(entry.sgpt > 40)
            score -= 15;

        if(entry.water < 8)
            score -= 10;

        if(entry.sleep < 7)
            score -= 10;

        return Math.max(score,0);

    },

    prefillDate() {

        const dateInput =
            document.getElementById("date");

        if (dateInput && !dateInput.value) {
            dateInput.value =
                LiverCare.dates.today();
        }

    },

    clearOptionalFields() {

        ["sgot", "sgpt", "alp", "symptoms", "notes"].forEach((id) => {
            const element =
                document.getElementById(id);

            if (element) {
                element.value = "";
            }
        });

    },

    parseNumber(value, required = true) {

        if (value === "") {
            return required ? null : null;
        }

        return Number(value);

    }
        

};
