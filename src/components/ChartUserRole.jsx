import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeartHandshake, Package, Ruler, User } from "lucide-react";
import ApexCharts from 'apexcharts';

function ChartUserRole() {
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const chartRef = useRef(null);

  const getUsers = async () => {
    try {
      const res_get = await fetch("/api/User", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch User");
      const newUsers = await res_get.json();
      const uniqueUsers = newUsers.filter(
        (user, index, self) =>
          index === self.findIndex((t) => t.email === user.email)
      );
      const sortedUsers = uniqueUsers.sort((a, b) =>
        a.email.localeCompare(b.email)
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.log("Error loading Users: ", error);
    }
  };

  const getUnits = async () => {
    try {
      const res_get = await fetch("/api/Unit", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch Units");
      const newUnits = await res_get.json();
      const uniqueUnits = newUnits.filter(
        (unit, index, self) =>
          index === self.findIndex((t) => t.unitId === unit.unitId)
      );
      const sortedUnits = uniqueUnits.sort((a, b) =>
        a.unitId.localeCompare(b.unitId)
      );
      setUnits(sortedUnits);
    } catch (error) {
      console.log("Error loading Units: ", error);
    }
  };

  const getProducts = async () => {
    try {
      const res_get = await fetch("/api/Product", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch Product");
      const newProducts = await res_get.json();
      const uniqueProducts = newProducts.filter(
        (product, index, self) =>
          index === self.findIndex((t) => t.productId === product.productId)
      );
      const sortedProducts = uniqueProducts.sort((a, b) =>
        a.productId.localeCompare(b.productId)
      );
      setProducts(sortedProducts);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };

  const getVendors = async () => {
    try {
      const res_get = await fetch("/api/addVendor", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch Vendor");
      const newVendors = await res_get.json();
      const uniqueVendors = newVendors.filter(
        (vendor, index, self) =>
          index === self.findIndex((t) => t.vendorId === vendor.vendorId)
      );
      const sortedVendors = uniqueVendors.sort((a, b) =>
        a.vendorId.localeCompare(b.vendorId)
      );
      setVendors(sortedVendors);
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  const getChartOptions = useMemo(() => {
    return () => {
    const roleCounts = {
      ADMIN: users.filter((user) => user.role === "ADMIN").length,
      MEMBER: users.filter((user) => user.role === "MEMBER").length,
      USER: users.filter((user) => user.role === "USER").length,
    };

    return {
      series: [roleCounts.ADMIN, roleCounts.MEMBER, roleCounts.USER],
      colors: ["#F55356", "#825FC6", "#009DFF"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Total Users",
                fontSize: "20px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                color: "#4b5563 ",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
              value: {
                show: true,
                fontSize: "28px", // ขยายขนาดของตัวเลข
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                offsetY: -20,
                color: "#252525",
                formatter: function (value) {
                  return value;
                },
              },
            },
            size: "75%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["ADMIN", "MEMBER", "USER"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: "#fff",
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value;
          },
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };
}, [users]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getUsers();
      getUnits();
      getProducts();
      getVendors();
    }
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !document.getElementById("role-chart") ||
      typeof ApexCharts === "undefined" ||
      users.length === 0
    ) {
      return;
    }

    const renderChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      const newChart = new ApexCharts(
        document.getElementById("role-chart"),
        getChartOptions()
      );
      newChart.render();
      chartRef.current = newChart;
    };

    renderChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [users, getChartOptions]);

  //   if (users.length === 0) {
  //     return <div>Loading user data...</div>;
  //   }

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-600">
          User Role Distribution
        </h2>
        <div id="role-chart"></div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
          <div className="flex flex-col items-start relative z-10">
            <span className="text-4xl font-bold text-indigo-600">
              {users.length}
            </span>
            <div className="text-lg font-semibold text-gray-600 mt-1">
              Users
            </div>
          </div>
          <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
            <User size={100} className="text-indigo-500" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
          <div className="flex flex-col items-start relative z-10">
            <span className="text-4xl font-bold text-pink-600">
              {units.length}
            </span>
            <div className="text-lg font-semibold text-gray-600 mt-1">
              Units
            </div>
          </div>
          <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
            <Ruler size={100} className="text-pink-500" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
          <div className="flex flex-col items-start relative z-10">
            <span className="text-4xl font-bold text-orange-600">
              {products.length}
            </span>
            <div className="text-lg font-semibold text-gray-600 mt-1">
              Products
            </div>
          </div>
          <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
            <Package size={100} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
          <div className="flex flex-col items-start relative z-10">
            <span className="text-4xl font-bold text-blue-600">
              {vendors.length}
            </span>
            <div className="text-lg font-semibold text-gray-600 mt-1">
              Vendors
            </div>
          </div>
          <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
            <HeartHandshake size={100} className="text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartUserRole;
