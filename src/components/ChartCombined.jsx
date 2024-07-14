import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js";

function ChartCombined({ refresh, shouldRefresh }) {
  const chartRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const MAX_VALUE = 500;
  const limitValue = (value) => Math.min(value, MAX_VALUE);

  async function fetchData(endpoint) {
    const response = await fetch(`/api/${endpoint}DB`);
    return await response.json();
  }

  useEffect(() => {
    async function setupChart() {
      try {
        const importData = await fetchData("Import");
        const exportData = await fetchData("Export");

        const years = new Set();
        [...importData, ...exportData].forEach(item => {
          const year = new Date(item.dateImport || item.dateExport).getFullYear();
          years.add(year);
        });
        setAvailableYears(Array.from(years).sort((a, b) => b - a));

        const monthlyData = {
          import: Array(12).fill(0),
          export: Array(12).fill(0),
        };

        const processData = (data, type) => {
          data.forEach((item) => {
            const date = new Date(item[`date${type}`]);
            if (date.getFullYear() === selectedYear) {
              item.selectedProduct.forEach((product) => {
                monthlyData[type.toLowerCase()][date.getMonth()] += parseInt(product[type.toLowerCase()]) || 0;
              });
            }
          });
        };

        processData(importData, "Import");
        processData(exportData, "Export");

        const originalData = {
          import: [...monthlyData.import],
          export: [...monthlyData.export],
        };

        monthlyData.import = monthlyData.import.map(limitValue);
        monthlyData.export = monthlyData.export.map(limitValue);

        const chartConfig = {
          type: "line",
          data: {
            labels: [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ],
            datasets: [
              {
                label: "Import",
                backgroundColor: "#10b981 ",
                borderColor: "#10b981 ",
                data: monthlyData.import,
                fill: false,
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
              },
              {
                label: "Export",
                backgroundColor: "#ef4444 ",
                borderColor: "#ef4444 ",
                data: monthlyData.export,
                fill: false,
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
              },
            ],
            originalData: [originalData.import, originalData.export],
          },
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

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        let ctx = document.getElementById("combined-chart").getContext("2d");
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
  }, [refresh, shouldRefresh, selectedYear]);

  return (
    <div className="bg-white shadow-md rounded-lg mb-6">
      <div className="px-4 py-3 bg-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-xs font-semibold text-indigo-400">Overview</h6>
            <h2 className="text-xl font-semibold text-gray-600">Import/Export Statistics</h2>
          </div>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-md text-gray-700"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4">
        <div className="h-96">
          <canvas id="combined-chart"></canvas>
        </div>
      </div>
    </div>
  );
}

export default ChartCombined;