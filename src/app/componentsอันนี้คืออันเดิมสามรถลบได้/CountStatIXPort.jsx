import { useState, useEffect } from "react";
import { PackagePlus, PackageMinus } from "lucide-react";

function CountStatIXPort({ refresh, shouldRefresh }) {
  const [imports, setImports] = useState([]);
  const [exports, setExports] = useState([]);

  const getImport = async () => {
    try {
      const res_get = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Import", {
        cache: "no-store",
      });
      if (!res_get.ok) {
        throw new Error("Failed to fetch Import");
      }
      const newImports = await res_get.json();
      const uniqueImports = newImports.filter(
        (importPd, index, self) =>
          index === self.findIndex((t) => t.documentId === importPd.documentId)
      );
      const sortedImports = uniqueImports.sort((a, b) =>
        a.documentId.localeCompare(b.documentId)
      );
      setImports(sortedImports);
      console.log(sortedImports);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };

  const getExport = async () => {
    try {
      const res_get = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Export", {
        cache: "no-store",
      });
      if (!res_get.ok) {
        throw new Error("Failed to fetch Export");
      }
      const newExports = await res_get.json();
      const uniqueExports = newExports.filter(
        (exportPd, index, self) =>
          index === self.findIndex((t) => t.documentId === exportPd.documentId)
      );
      const sortedExports = uniqueExports.sort((a, b) =>
        a.documentId.localeCompare(b.documentId)
      );
      setExports(sortedExports);
      console.log(sortedExports);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };

  useEffect(() => {
    getImport();
    getExport();
  }, [refresh, shouldRefresh ]);

  return (
    <div className="flex justify-between items-center mb-6 space-x-5">
      {/* //? Stat */}
      <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-600 my-1">Imports</div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
          <PackagePlus size={32} />
          <span className="text-2xl font-bold">{imports.length}</span>{" "}
        </div>
      </div>

      <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-600 my-1">Exports</div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
          <PackageMinus size={32} />
          <span className="text-2xl font-bold">{exports.length}</span>{" "}
        </div>
      </div>
    </div>
  );
}

export default CountStatIXPort;
