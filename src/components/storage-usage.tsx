"use client";

function ProgressBar({
  used,
  limit,
  variant = "default",
}: {
  used: number;
  limit: number;
  variant?: "default" | "warning" | "danger";
}) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0;

  let bgColor = "bg-blue-500";

  if (variant === "warning") {
    bgColor = "bg-yellow-500";
  }

  if (variant === "danger") {
    bgColor = "bg-red-500";
  }

  return (
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${bgColor}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

interface UsageItem {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

interface StorageUsageProps {
  projectLimit: number;
  projectCount: number;
  schemasLimit: number;
  schemasCount: number;
  recordsLimit: number;
  recordsCount: number;
}

export function StorageUsage({
  // projectLimit,
  // projectCount,
  schemasLimit,
  schemasCount,
  recordsLimit,
  recordsCount,
}: StorageUsageProps) {

    // console.log({
    //     projectLimit,
    //     projectCount,
    //     schemasLimit,
    //     schemasCount,
    //     recordsLimit,
    //     recordsCount,
    // });

  const usageItems: UsageItem[] = [
    // {
    //   label: "Projects",
    //   used: projectCount,
    //   limit: projectLimit,
    // },
    {
      label: "Schemas",
      used: schemasCount,
      limit: schemasLimit,
    },
    {
      label: "Records",
      used: recordsCount,
      limit: recordsLimit,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">
        Storage & Usage Limits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usageItems.map((item, idx) => {
          const percentage =
            item.limit > 0 ? (item.used / item.limit) * 100 : 0;

          const isWarning = percentage > 75;
          const isDanger = percentage > 90;

          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  {item.label}
                </h3>

                <span
                  className={`text-sm font-semibold ${
                    isDanger
                      ? "text-red-400"
                      : isWarning
                        ? "text-yellow-400"
                        : "text-slate-400"
                  }`}
                >
                  {item.used.toLocaleString()} / {item.limit.toLocaleString()}
                  {item.unit ? ` ${item.unit}` : ""}
                </span>
              </div>

              <ProgressBar
                used={item.used}
                limit={item.limit}
                variant={
                  isDanger ? "danger" : isWarning ? "warning" : "default"
                }
              />

              <div className="mt-2 text-xs text-slate-500">
                {Math.round(percentage)}% used
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-slate-900 border border-blue-800/50 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white mb-2">
          Approaching Limits?
        </h3>

        <p className="text-sm text-slate-400 mb-4">
          Upgrade to Pro for higher limits and advanced features.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Upgrade to Pro
        </button>
      </div> */}
    </div>
  );
}
