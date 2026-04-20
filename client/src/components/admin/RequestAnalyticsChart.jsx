import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useGetRequestAnalyticsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

const RequestAnalyticsChart = () => {
  const [range, setRange] = useState("daily");

  const { data, isLoading, isError } = useGetRequestAnalyticsQuery(range);

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: `Requests (${range})`,
        data: data?.values || [],
        borderColor: "#6366f1",
        responsive: true,
        backgroundColor: "rgba(99,102,241,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.18em]">
            Request Analytics
          </h2>
          <p className="text-[10px] text-[var(--color-content-muted)]">
            Daily / Weekly / Monthly trends
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-[10px] rounded-md border border-border-default ${
                range === r
                  ? "bg-primary-600 border border-primary-300 text-white"
                  : "bg-[var(--color-surface-muted)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <p className="text-xs">Loading chart...</p>
      ) : isError ? (
        <p className="text-xs text-red-500">Failed to load data</p>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default RequestAnalyticsChart;
