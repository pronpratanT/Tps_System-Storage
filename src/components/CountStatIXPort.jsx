import { useState, useEffect } from "react";
import { PackagePlus, PackageMinus } from "lucide-react";

function CountStatIXPort({ refresh, shouldRefresh }) {
  const [imports, setImports] = useState([]);
  const [exports, setExports] = useState([]);

  const getImport = async () => {
    try {
      const res_get = await fetch("/api/ImportDB", {
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
      const res_get = await fetch("/api/ExportDB", {
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
  }, [refresh, shouldRefresh]);

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
        <div className="flex flex-col items-start relative z-10">
          <span className="text-4xl font-bold text-emerald-600">
            {imports.length}
          </span>
          <div className="text-lg font-semibold text-gray-600 mt-1">
            Imports
          </div>
        </div>
        <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
          <PackagePlus size={100} className="text-emerald-500" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
        <div className="flex flex-col items-start relative z-10">
          <span className="text-4xl font-bold text-red-600">
            {exports.length}
          </span>
          <div className="text-lg font-semibold text-gray-600 mt-1">
            Exports
          </div>
        </div>
        <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
          <PackageMinus size={100} className="text-red-500" />
        </div>
      </div>
    </div>
  );
}

export default CountStatIXPort;
