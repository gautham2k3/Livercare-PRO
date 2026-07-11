/* ==========================================================
   LiverCare Pro
   router.js
   Handles page navigation
========================================================== */

const app = document.getElementById("app");

/* ---------------------------------------
   Pages
--------------------------------------- */

const pages = {
  home: homePage,

  food: foodPage,

  tracker: trackerPage,

  planner: plannerPage,

  settings: settingsPage,

  recipes: dietPage,
};

/* ---------------------------------------
   Navigation
--------------------------------------- */

document.querySelectorAll(".bottom-nav button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".bottom-nav button")
      .forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    const page = button.dataset.page;

    loadPage(page);
  });
});

/* ---------------------------------------
   Quick Action Buttons
--------------------------------------- */

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".action-btn");

  if (!btn) return;

  const page = btn.dataset.page;

  if (page) {
    const navButton =
      document.querySelector(`.bottom-nav button[data-page="${page}"]`);

    if (navButton) {
      navButton.click();
      return;
    }

    loadPage(page);
  }
});

/* ---------------------------------------
   Load Page
--------------------------------------- */

function loadPage(name) {
  if (!pages[name]) return;

  app.innerHTML = pages[name]();

  if (name === "home") {
    Dashboard.init();
  }
  if (name === "food" || name === "recipes") {
    if (name === "food") {
    initializeFoodSearch();
    }
  }
  if (name === "planner") {
    Water.init();
    Meals.init();
  }
  if (name === "settings") {
    Medicine.init();
  }
  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
}

/* ---------------------------------------
   HOME
--------------------------------------- */

function homePage() {
  return `

<section id="home-page">

<div class="hero-card hero-card-modern">

<div class="hero-copy">

<div class="hero-chip">Live Recovery Score</div>

<h1 id="score">

82%

</h1>

<p id="dashboardScoreCaption" class="hero-subtitle">
Good progress, keep it consistent
</p>

<div class="hero-progress-track">
<div class="hero-progress-fill"></div>
</div>

<div class="hero-meta">
<span id="dashboardStatus">Steady</span>
<span id="dashboardBilirubin">--</span>
<span id="dashboardWeight">-- kg</span>
</div>

</div>

<div class="hero-score-panel">
<div class="hero-score-badge">82%</div>
<p class="mb-0">Today</p>
</div>

</div>

<div class="row g-3 mt-4">

<div class="col-6">

<div class="info-card">

<i class="bi bi-cup-straw"></i>

<h5>Water</h5>

<p>6 / 8</p>

</div>

</div>

<div class="col-6">

<div class="info-card">

<i class="bi bi-egg-fried"></i>

<h5>Meals</h5>

<p>4 / 5</p>

</div>

</div>

<div class="col-6">

<div class="info-card">

<i class="bi bi-capsule"></i>

<h5>Medicine</h5>

<p>Completed</p>

</div>

</div>

<div class="col-6">

<div class="info-card">

<i class="bi bi-moon-stars"></i>

<h5>Sleep</h5>

<p>8 hrs</p>

</div>

</div>

</div>

</section>

<h4 class="mt-5 mb-3">
Quick Actions
</h4>

<div class="row g-3">

<div class="col-6">

<button class="action-btn" data-page="food">

<i class="bi bi-search"></i>

Food Search

</button>

</div>

<div class="col-6">

<button class="action-btn" data-page="tracker">

<i class="bi bi-graph-up-arrow"></i>

Recovery Tracker

</button>

</div>

<div class="col-6">

<button class="action-btn" data-page="recipes">

<i class="bi bi-book-half"></i>

Jaundice Diet

</button>

</div>

<div class="col-6">

<button class="action-btn" data-page="planner">

<i class="bi bi-calendar-week"></i>

Daily Planner

</button>

</div>

</div>

<div class="hero-stats-grid mt-4">

<div class="hero-stat-card">
<small>Hydration</small>
<strong id="dashboardHydration">0/8 glasses</strong>
</div>

<div class="hero-stat-card">
<small>Meals</small>
<strong id="dashboardMeals">0/5 meals</strong>
</div>

<div class="hero-stat-card">
<small>Sleep</small>
<strong id="dashboardSleep">0 hrs sleep</strong>
</div>

<div class="hero-stat-card">
<small>Streak</small>
<strong id="dashboardStreak">🔥 0 Days</strong>
</div>

</div>

<div class="glass p-3 mt-3">

    <small id="dashboardTrendTitle">Daily Recovery Insight</small>

    <p id="dashboardTrendText" class="mb-0 mt-2">
        We will compare your latest records and highlight changes.
    </p>

</div>

`;
}

/* ---------------------------------------
   FOOD
--------------------------------------- */

function foodPage() {
  return `

<section>

<h2 class="mb-4">

🍎 Food Search

</h2>

<p class="mb-3">
Search foods and check whether they are a good fit during jaundice recovery.
</p>

<input

id="foodSearch"

class="form-control form-control-lg"

placeholder="Search any food..."

>

<div

id="foodResults"

class="mt-4">

</div>

</section>

`;
}

function dietPage() {
  return `

<section>

<div class="hero-card">
<div>
<p class="small text-uppercase mb-2">Jaundice Recovery Guide</p>
<h1>Eat Light</h1>
<p class="mb-0">Simple meals, hydration, and rest support recovery.</p>
</div>
<div class="progress-ring">Diet</div>
</div>

<div class="glass p-4">
<h3 class="mb-3">What To Eat</h3>
<div class="guide-grid">
<div class="guide-card safe">
<h4>Best Choices</h4>
<ul class="guide-list">
<li>Banana, apple, papaya, watermelon, and pomegranate</li>
<li>Oats, rice, idli, porridge, khichdi, and toast</li>
<li>Boiled vegetables, dal, soups, and low-oil home food</li>
<li>Coconut water, lemon water, and plenty of plain water</li>
</ul>
</div>
<div class="guide-card safe">
<h4>Meal Pattern</h4>
<ul class="guide-list">
<li>Eat small meals every 3 to 4 hours</li>
<li>Choose soft foods that are easy to digest</li>
<li>Prefer steamed, boiled, or lightly cooked meals</li>
<li>Rest after meals instead of eating very late</li>
</ul>
</div>
</div>
</div>

<div class="glass p-4 mt-4">
<h3 class="mb-3">What Not To Eat</h3>
<div class="guide-grid">
<div class="guide-card avoid">
<h4>Avoid</h4>
<ul class="guide-list">
<li>Alcohol completely during recovery</li>
<li>Fried chicken, pizza, burgers, parotta, and chips</li>
<li>Heavy sweets, bakery items, and processed foods</li>
<li>Very spicy, oily, or buttery dishes</li>
</ul>
</div>
<div class="guide-card avoid">
<h4>Be Careful With</h4>
<ul class="guide-list">
<li>Too much coffee or strong tea</li>
<li>Red meat and very rich gravies</li>
<li>Outside food with poor hygiene</li>
<li>Medicines or supplements without doctor advice</li>
</ul>
</div>
</div>
</div>

<div class="glass p-4 mt-4">
<h3 class="mb-3">One Day Sample Plan</h3>
<ul class="guide-list">
<li>Morning: warm water, banana, and idli or oats</li>
<li>Lunch: rice, moong dal, curd, and boiled vegetables</li>
<li>Evening: coconut water and fruit</li>
<li>Dinner: khichdi, soup, or soft rice with dal</li>
</ul>
</div>

<div class="glass p-4 mt-4">
<h3 class="mb-3">Recovery Tips</h3>
<ul class="guide-list">
<li>Drink enough fluids throughout the day.</li>
<li>Sleep well and avoid intense exercise until you feel stronger.</li>
<li>Track bilirubin, sleep, and water daily in the app.</li>
<li>See a doctor quickly if fever, vomiting, confusion, or pain worsens.</li>
</ul>
</div>

</section>

`;
}

/* ---------------------------------------
   TRACKER
--------------------------------------- */

function trackerPage() {
  return `
<section>

<h2 class="mb-4">

📊 Health Tracker

</h2>

<div class="glass p-4">

<div class="row g-3">

<div class="col-md-6">
<label>Date</label>
<input id="date" type="date" class="form-control">
</div>

<div class="col-md-6">
<label>Bilirubin</label>
<input id="bilirubin" type="number" step="0.1" class="form-control">
</div>

<div class="col-md-6">
<label>SGOT</label>
<input id="sgot" type="number" class="form-control">
</div>

<div class="col-md-6">
<label>SGPT</label>
<input id="sgpt" type="number" class="form-control">
</div>

<div class="col-md-6">
<label>ALP</label>
<input id="alp" type="number" class="form-control">
</div>

<div class="col-md-6">
<label>Weight (kg)</label>
<input id="weight" type="number" class="form-control">
</div>

<div class="col-md-6">
<label>Water (Glasses)</label>
<input id="water" type="number" class="form-control">
</div>

<div class="col-md-6">
<label>Sleep (Hours)</label>
<input id="sleep" type="number" class="form-control">
</div>

<div class="col-12">
<label>Symptoms</label>
<input id="symptoms" class="form-control">
</div>

<div class="col-12">
<label>Notes</label>
<textarea id="notes" class="form-control"></textarea>
</div>

</div>

<button
id="saveHealth"
class="btn btn-warning w-100 mt-4">

Save Health Record

</button>

</div>

<div class="glass p-4 mt-4">

    <h4 class="mb-3">

        Recovery Progress

    </h4>

    <div style="height:320px">

        <canvas id="healthChart"></canvas>

    </div>

</div>

<h3 class="mt-5">

History

</h3>

<div id="history"></div>

</section>
`;
Tracker.init();
}

/* ---------------------------------------
   PLANNER
--------------------------------------- */

function plannerPage(){

return `

<section>

<h2 class="mb-4">

🍽 Daily Meal Tracker

</h2>

<div class="glass p-4">

<div class="d-flex justify-content-between align-items-start mb-3">
<div>
<p class="mb-1 small text-uppercase">Today</p>
<small class="text-secondary">Planner resets automatically each day.</small>
</div>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">

<div>
<p class="mb-1 small text-uppercase">Hydration</p>
<h3 id="waterCount">0/8</h3>
</div>

<div class="d-flex gap-2">
<button id="removeWater" class="btn btn-outline-secondary btn-sm">-1</button>
<button id="addWater" class="btn btn-warning btn-sm">+1</button>
</div>

</div>

<div class="progress lc-progress mb-4">
<div id="waterProgress" class="progress-bar"></div>
</div>

<h3 id="mealCount">

0/5

</h3>

<div class="form-check mt-4">

<input
class="form-check-input meal-check"
type="checkbox"
data-meal="breakfast"
id="breakfast">

<label
class="form-check-label"
for="breakfast">

Breakfast

</label>

</div>

<div class="form-check">

<input
class="form-check-input meal-check"
type="checkbox"
data-meal="morningSnack"
id="morningSnack">

<label
for="morningSnack">

Morning Snack

</label>

</div>

<div class="form-check">

<input
class="form-check-input meal-check"
type="checkbox"
data-meal="lunch"
id="lunch">

<label
for="lunch">

Lunch

</label>

</div>

<div class="form-check">

<input
class="form-check-input meal-check"
type="checkbox"
data-meal="eveningSnack"
id="eveningSnack">

<label
for="eveningSnack">

Evening Snack

</label>

</div>

<div class="form-check">

<input
class="form-check-input meal-check"
type="checkbox"
data-meal="dinner"
id="dinner">

<label
for="dinner">

Dinner

</label>

</div>

</div>

<div class="glass p-4 mt-4">

<h3 class="mb-3">Simple Daily Plan</h3>

<ul class="guide-list">
<li>Breakfast: idli, oats, banana, or porridge</li>
<li>Lunch: rice with dal and boiled vegetables</li>
<li>Snack: coconut water, fruit, or curd</li>
<li>Dinner: light khichdi, soup, or soft rice meals</li>
</ul>

</div>

</section>

`;

}

/* ---------------------------------------
   SETTINGS
--------------------------------------- */

function settingsPage(){

return `

<section>

<h2 class="mb-4">

💊 Medicine Reminder

</h2>

<div class="glass p-4">

<h3 id="medicineCount">

0/3

</h3>

<div class="form-check mt-4">

<input
class="form-check-input medicine-check"
type="checkbox"
data-time="morning"
id="morningMed">

<label for="morningMed">

🌅 Morning

</label>

</div>

<div class="form-check">

<input
class="form-check-input medicine-check"
type="checkbox"
data-time="afternoon"
id="afternoonMed">

<label for="afternoonMed">

🌞 Afternoon

</label>

</div>

<div class="form-check">

<input
class="form-check-input medicine-check"
type="checkbox"
data-time="night"
id="nightMed">

<label for="nightMed">

🌙 Night

</label>

</div>

</div>

<div class="glass p-4 mt-4">

<h3 class="mb-3">When To Contact A Doctor</h3>

<ul class="guide-list">
<li>Yellowing increases suddenly or urine becomes much darker</li>
<li>Persistent fever, severe stomach pain, or repeated vomiting</li>
<li>Confusion, unusual sleepiness, or poor appetite for many days</li>
<li>Any medicine side effects or concerns about lab reports</li>
</ul>

</div>

<div class="glass p-4 mt-4">

<h3 class="mb-3">Smart Reminders</h3>

<ul class="guide-list">
<li>The app now nudges you if medicine is still pending for the current time of day.</li>
<li>It also reminds you when water intake is too low by afternoon or evening.</li>
<li>Keep this page or the app open to see reminder toasts.</li>
</ul>

</div>

</section>

`;

}

/* ---------------------------------------
   First Load
--------------------------------------- */

loadPage("home");
