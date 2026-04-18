import React from "react";

const ChevronLeft = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="10 12 6 8 10 4" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 4 10 8 6 12" />
  </svg>
);

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

const Pagination = ({ page, setPage, totalPages }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  const btnBase =
    "h-9 min-w-[36px] px-3 rounded-sm border border-[var(--color-border-default)] bg-[var(--color-surface-card)] text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[var(--color-surface-muted)] active:scale-[0.97]";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 select-none">
      {/* Page info — left side */}
      <p className="text-xs font-medium text-[var(--color-content-muted)] uppercase tracking-widest">
        Page <span className="text-[var(--color-content-primary)]">{page}</span>{" "}
        of{" "}
        <span className="text-[var(--color-content-primary)]">
          {totalPages}
        </span>
      </p>

      {/* Controls — right side */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={btnBase}
          aria-label="Previous page"
        >
          <ChevronLeft />
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-widest">
            Prev
          </span>
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="h-9 min-w-[36px] flex items-center justify-center text-[var(--color-content-muted)] text-sm"
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`${btnBase} ${
                p === page
                  ? "!bg-primary-600 !text-[var(--color-surface-card)]  font-medium"
                  : ""
              }`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={btnBase}
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-widest">
            Next
          </span>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
