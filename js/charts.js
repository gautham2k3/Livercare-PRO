/* ==========================================================
   LiverCare Pro
   charts.js
========================================================== */

const Charts = {

    chart: null,

    init(entries) {

        const canvas = document.getElementById("healthChart");

        if (!canvas) return;

        if (this.chart) {
            this.chart.destroy();
        }

        const labels = entries.map(e => e.date).reverse();

        this.chart = new Chart(canvas, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {
                        label: "Bilirubin",
                        data: entries.map(e => e.bilirubin).reverse(),
                        borderColor: "#F59E0B",
                        backgroundColor: "rgba(245,158,11,.15)",
                        fill: true,
                        tension: .35
                    },

                    {
                        label: "SGOT",
                        data: entries.map(e => e.sgot).reverse(),
                        borderColor: "#EF4444",
                        tension: .35
                    },

                    {
                        label: "SGPT",
                        data: entries.map(e => e.sgpt).reverse(),
                        borderColor: "#3B82F6",
                        tension: .35
                    },

                    {
                        label: "Weight",
                        data: entries.map(e => e.weight).reverse(),
                        borderColor: "#10B981",
                        tension: .35
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    intersect: false,

                    mode: "index"

                },

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

    }

};