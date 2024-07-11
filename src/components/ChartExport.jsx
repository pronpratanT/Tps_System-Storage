import React from "react";
import Chart from "chart.js";

function ChartExport({ refresh, shouldRefresh }) {
  const chartRef = React.useRef(null);

  const MAX_VALUE = 500;

  const limitValue = (value) => Math.min(value, MAX_VALUE);

  const chartConfig = {
    type: "line",
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
      },
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || "";
            let value = data.originalData[tooltipItem.datasetIndex][tooltipItem.index];
            if (value >= MAX_VALUE) {
              return label + ": " + value + " (Max reached)";
            }
            return label + ": " + value;
          },
        },
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        display: true,
        labels: {
          fontColor: "rgba(0,0,0,.4)",
        },
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Quantity",
            },
            ticks: {
              beginAtZero: true,
              stepSize: 100,
              max: MAX_VALUE,
              callback: function (value) {
                return value.toFixed(0);
              },
            },
            gridLines: {
              drawBorder: false,
            },
          },
        ],
      },
    },
  };

  async function fetchExportData() {
    const response = await fetch("/api/ExportDB");
    const data = await response.json();
    return data;
  }

  React.useEffect(() => {
    async function setupChart() {
      try {
        const exportData = await fetchExportData();
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        const monthlyData = {
          [currentYear]: Array(12).fill(0),
          [lastYear]: Array(12).fill(0),
        };

        exportData.forEach((item) => {
          const date = new Date(item.dateExport);
          const year = date.getFullYear();
          const month = date.getMonth();

          if (year === currentYear || year === lastYear) {
            item.selectedProduct.forEach((product) => {
              monthlyData[year][month] += parseInt(product.export) || 0;
            });
          }
        });

        const originalData = {
          [currentYear]: [...monthlyData[currentYear]],
          [lastYear]: [...monthlyData[lastYear]],
        };

        // จำกัดค่าสูงสุดของข้อมูล
        monthlyData[currentYear] = monthlyData[currentYear].map(limitValue);
        monthlyData[lastYear] = monthlyData[lastYear].map(limitValue);

        chartConfig.data = {
          labels: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ],
          datasets: [
            {
              label: currentYear.toString(),
              backgroundColor: "#4F46E5",
              borderColor: "#4F46E5",
              data: monthlyData[currentYear],
              fill: false,
              borderWidth: 2,
              pointRadius: 2,
              pointHoverRadius: 4,
            },
            {
              label: lastYear.toString(),
              backgroundColor: "#FFC14D",
              borderColor: "#FFC14D",
              data: monthlyData[lastYear],
              fill: false,
              borderWidth: 2,
              pointRadius: 2,
              pointHoverRadius: 4,
            },
          ],
          originalData: [originalData[currentYear], originalData[lastYear]],
        };

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        let ctx = document.getElementById("line-chart").getContext("2d");
        chartRef.current = new Chart(ctx, chartConfig);

      } catch (error) {
        console.error("Error setting up chart:", error);
      }
    }

    setupChart();
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [refresh, shouldRefresh]);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="px-4 py-3 bg-transparent">
          <div className="flex items-center">
            <div className="flex-1">
              <h6 className="text-xs font-semibold text-indigo-400">
                Overview
              </h6>
              <h2 className="text-xl font-semibold text-gray-700">
                Export Statistics
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4">
          {/* Chart */}
          <div className="h-96">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartExport;
