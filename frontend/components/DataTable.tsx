// components/DataTable.tsx

import React from "react";

type Column = {
  header: string;
  accessor: string;
  render?: (row: any) => React.ReactNode;
};

export default function DataTable({
  columns,
  data,
}: {
  columns: Column[];
  data: any[];
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-white">
          
          {/* HEADER */}
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left font-semibold tracking-wide text-indigo-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-white/5 hover:bg-indigo-500/10 transition-all"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-white/70">

                    {col.render
                      ? col.render(row)
                      : String(row[col.accessor] ?? "-")}

                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}