let foods = [];

async function initializeFoodSearch() {

    const search =
        document.getElementById("foodSearch");

    const results =
        document.getElementById("foodResults");

    if (!search) return;

    if (search.dataset.ready === "true") return;
    search.dataset.ready = "true";

    if (foods.length === 0) {
        try {
            const response =
                await fetch("data/food.json");

            if (!response.ok) {
                throw new Error(`Request failed with ${response.status}`);
            }

            foods =
                await response.json();
        } catch (error) {
            console.error("Food data failed to load", error);
            results.innerHTML = `
                <div class="alert alert-danger mt-3">
                    Food list could not be loaded right now.
                </div>
            `;
            return;
        }
    }

    renderFoods(foods);

    search.addEventListener("input", () => {

        const keyword =
            search.value.toLowerCase();

        const filtered =
            foods.filter(food =>
                food.name.toLowerCase()
                .includes(keyword)
            );

        renderFoods(filtered);

    });

    function renderFoods(list) {

        results.innerHTML = "";

        if (list.length === 0) {
            const query =
                search.value.trim();

            const googleUrl =
                `https://www.google.com/search?q=${encodeURIComponent(`is ${query} good for jaundice`)}`;

            results.innerHTML = `
                <div class="alert alert-warning mt-3">
                    No food found in the app database.
                </div>
                <div class="glass p-4 mt-3">
                    <h4 class="mb-2">Try a quick Google check</h4>
                    <p class="mb-3">
                        Search this food on Google to see the latest AI summary and health results.
                    </p>
                    <a
                        class="btn btn-warning"
                        href="${googleUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="bi bi-search me-2"></i>
                        Search "${query || "this food"}" on Google
                    </a>
                    <p class="mt-3 mb-0 small">
                        Please treat Google results as general guidance and confirm with a doctor for personal advice.
                    </p>
                </div>
            `;

            return;

        }

        list.forEach(food => {

            const badge = {

                safe: "success",

                moderate: "warning",

                avoid: "danger"

            }[food.status];

            results.innerHTML += `
                <div class="card shadow-sm border-0 mt-3">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <h5>

                                ${food.icon}
                                ${food.name}

                            </h5>

                            <span class="badge bg-${badge}">

                                ${food.status.toUpperCase()}

                            </span>

                        </div>

                        <small>

                            ${food.category}

                        </small>

                        <p class="mt-2 mb-1">

                            ${food.reason}

                        </p>

                        <strong>

                            ${food.calories} kcal /100g

                        </strong>

                    </div>

                </div>
            `;

        });

    }

}
