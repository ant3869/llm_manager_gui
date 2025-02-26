import { useState, useMemo } from 'react'

export default function DataPreview({ dataset, onNext, onBack }) {
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(10)

  const previewData = useMemo(() => {
    // Simulate data preview generation
    return Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      feature1: Math.random() * 100,
      feature2: Math.random() > 0.5 ? 'Yes' : 'No',
      feature3: new Date().toISOString().split('T')[0]
    }))
  }, [dataset])

  const stats = useMemo(() => ({
    totalRows: previewData.length,
    missingValues: 12,
    duplicates: 3,
    numericalColumns: 2,
    categoricalColumns: 1
  }), [previewData])

  return (
    <div className="space-y-6">
      {/* Dataset Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div 
            key={key}
            className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
          >
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {Object.keys(previewData[0]).map(header => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {previewData
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {value.toString()}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Page {page} of {Math.ceil(previewData.length / rowsPerPage)}
          </span>
          <button
            onClick={() => setPage(p => Math.min(Math.ceil(previewData.length / rowsPerPage), p + 1))}
            disabled={page >= Math.ceil(previewData.length / rowsPerPage)}
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Continue to Cleaning
          </button>
        </div>
      </div>
    </div>
  )
}
