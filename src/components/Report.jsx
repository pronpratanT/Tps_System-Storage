import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Receipt } from "lucide-react";

function Report() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res_get = await fetch("/api/Product", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Product");
      }

      const newProducts = await res_get.json();

      // Check for duplicates
      const uniqueProducts = newProducts.filter(
        (product, index, self) =>
          index === self.findIndex((t) => t.productId === product.productId)
      );

      // Sort Products by productId in alphabetical order
      const sortedProducts = uniqueProducts.sort((a, b) =>
        a.productId.localeCompare(b.productId)
      );

      setProducts(sortedProducts);
      console.log(sortedProducts);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const exportPdfHandler = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["ลำดับ", "รหัสสินค้า", "ชื่อสินค้า", "หน่วย", "จำนวนหน่วย"]],
      body: products.map((item, index) => [
        index + 1,
        item.productId,
        item.productName,
        item.brand,
        item.productUnit,
        Number(item.amount).toFixed(2),
      ]),
    });
    doc.save("products.pdf");
  };

  return (
    <div className="flex-1 p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">
              รายงานรายละเอียดสินค้าคงเหลือ
            </h2>
            <button
              onClick={exportPdfHandler}
              className="flex bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg ml-4"
            >
              <Receipt size={20} className="mr-2" />
              Export PDF
            </button>
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="border py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md w-1/12">
                  ลำดับ
                </th>
                <th className="border py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center w-3/12">
                  รหัสสินค้า
                </th>
                <th className="border py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center w-4/12">
                  ชื่อสินค้า
                </th>
                <th className="border py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center w-1/12">
                  ยี่ห้อ
                </th>
                <th className="border py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center w-1/12">
                  หน่วย
                </th>
                <th className="border py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md w-1/12">
                  จำนวนหน่วย
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.productId} className="border-t">
                  <td className="border py-4 px-4 text-center w-auto">
                    {index + 1}
                  </td>
                  <td className="border py-4 px-4">
                    {product.productId}
                  </td>
                  <td className="border py-4 px-4">{product.productName}</td>
                  <td className="border py-4 px-4">{product.brand}</td>
                  <td className="border py-4 px-4 text-center">{product.productUnit}</td>
                  <td className="border py-4 px-4 text-right">
                    {Number(product.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;
