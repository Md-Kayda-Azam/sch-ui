import React, { useState } from 'react';

// ============================================================================
// 1. DONUT CHART (Interactive Segment Hover & Dynamic Center Display)
// ============================================================================
export interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

export const DonutChart: React.FC<{
  data: DonutChartSegment[];
  totalLabel?: string;
  size?: number;
  thickness?: number;
  unit?: string;
}> = ({ data, totalLabel = 'Total', size = 190, thickness = 22, unit = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  const activeSegment = hoveredIdx !== null ? data[hoveredIdx] : null;
  const activePercent = activeSegment
    ? Math.round((activeSegment.value / total) * 100)
    : 100;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 select-none">
      {/* SVG Canvas */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 filter drop-shadow-xs"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            className="text-slate-100 dark:text-slate-800/80 transition-colors"
          />

          {/* Data Segments */}
          {data.map((seg, idx) => {
            const fraction = seg.value / total;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedAngle * circumference;
            accumulatedAngle += fraction;

            const isHovered = hoveredIdx === idx;
            const currentThickness = isHovered ? thickness + 4 : thickness;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={currentThickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                  filter: isHovered ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Dynamic Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums leading-none">
            {activeSegment ? activeSegment.value.toLocaleString() : total.toLocaleString()}
            {unit && <span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 max-w-[100px] truncate leading-tight">
            {activeSegment ? activeSegment.label : totalLabel}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tabular-nums mt-0.5">
            {activeSegment ? `${activePercent}% of cohort` : `${data.length} segments`}
          </span>
        </div>
      </div>

      {/* Structured Legend */}
      <div className="flex-1 w-full max-w-xs space-y-2">
        {data.map((seg, idx) => {
          const isHovered = hoveredIdx === idx;
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                isHovered
                  ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700 shadow-xs'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform"
                  style={{
                    backgroundColor: seg.color,
                    transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {seg.value.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums w-8 text-right">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 2. ADVANCED FEE COLLECTION BAR CHART (Gross vs Reversed vs Net with Filter)
// ============================================================================
export interface CollectionBarData {
  month: string;
  gross: number;
  reversed: number;
  net: number;
}

export const CollectionBarChart: React.FC<{
  data: CollectionBarData[];
  height?: number;
  primaryColor?: string;
}> = ({ data, height = 230, primaryColor }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'net' | 'reversals'>('all');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Compute maximum scale
  const maxGross = Math.max(...data.map((d) => d.gross), 10000);
  // Round to nice grid ceiling (e.g. 600,000)
  const gridCeiling = Math.ceil(maxGross / 100000) * 100000;
  const gridSteps = [gridCeiling, gridCeiling * 0.75, gridCeiling * 0.5, gridCeiling * 0.25, 0];

  const totalGross = data.reduce((acc, curr) => acc + curr.gross, 0);
  const totalReversed = data.reduce((acc, curr) => acc + curr.reversed, 0);
  const totalNet = data.reduce((acc, curr) => acc + curr.net, 0);
  const realizationRate = Math.round((totalNet / (totalGross || 1)) * 100);

  const activeData = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="w-full space-y-3">
      {/* Top Controls: Filter Pills & Metric Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-1 border-b border-slate-100 dark:border-slate-800">
        {/* Interactive View Filter */}
        <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setFilterMode('net')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filterMode === 'net'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Net Realized Only
          </button>
          <button
            onClick={() => setFilterMode('reversals')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filterMode === 'reversals'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Audit Reversals
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          {(filterMode === 'all' || filterMode === 'reversals') && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0 shadow-2xs"
                style={{ backgroundColor: primaryColor || 'var(--theme-primary)' }}
              />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Gross</span>
            </div>
          )}
          {(filterMode === 'all' || filterMode === 'reversals') && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Reversed</span>
            </div>
          )}
          {(filterMode === 'all' || filterMode === 'net') && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Net Collection</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="relative w-full" style={{ height }}>
        {/* Background Grid Lines & Y-Axis Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
          {gridSteps.map((val, idx) => (
            <div key={idx} className="w-full flex items-center gap-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums w-12 text-right shrink-0">
                ৳{(val / 1000).toFixed(0)}k
              </span>
              <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-800/80" />
            </div>
          ))}
        </div>

        {/* Floating Tooltip Box when Bar is Hovered */}
        {activeData && (
          <div
            className="absolute top-1 right-2 z-20 bg-slate-900/95 text-white dark:bg-slate-800/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-slate-700 text-xs pointer-events-none transition-all duration-150 animate-in fade-in"
          >
            <div className="font-semibold text-slate-200 border-b border-slate-700/80 pb-1 mb-1 flex items-center justify-between gap-4">
              <span>{activeData.month} Performance</span>
              <span className="text-emerald-400 tabular-nums">
                {Math.round((activeData.net / (activeData.gross || 1)) * 100)}% Realized
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 tabular-nums text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Gross</span>
                <span className="font-semibold text-blue-300">৳{activeData.gross.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Reversals</span>
                <span className="font-semibold text-rose-300">-৳{activeData.reversed.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Net</span>
                <span className="font-semibold text-emerald-300">৳{activeData.net.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bars Container */}
        <div className="absolute inset-0 pl-14 pb-7 flex items-end justify-between gap-3 sm:gap-6">
          {data.map((item, idx) => {
            const chartEffectiveHeight = height - 36;
            const grossH = Math.max((item.gross / gridCeiling) * chartEffectiveHeight, 4);
            const revH = Math.max((item.reversed / gridCeiling) * chartEffectiveHeight, 4);
            const netH = Math.max((item.net / gridCeiling) * chartEffectiveHeight, 4);

            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Column Hover Highlight */}
                <div
                  className={`absolute inset-x-0 bottom-0 top-0 rounded-lg transition-colors pointer-events-none ${
                    isHovered ? 'bg-slate-100/80 dark:bg-slate-800/40 ring-1 ring-slate-200 dark:ring-slate-700' : ''
                  }`}
                />

                {/* Grouped Bars */}
                <div className="relative z-10 flex items-end justify-center gap-1 sm:gap-1.5 w-full max-w-[84px] px-1 h-full">
                  {/* Gross Bar */}
                  {(filterMode === 'all' || filterMode === 'reversals') && (
                    <div
                      style={{
                        height: `${grossH}px`,
                        backgroundColor: primaryColor || 'var(--theme-primary)',
                      }}
                      className="flex-1 rounded-t-sm transition-all duration-200 shadow-2xs hover:brightness-110"
                      title={`Gross: ৳${item.gross.toLocaleString()}`}
                    />
                  )}

                  {/* Reversed Bar */}
                  {(filterMode === 'all' || filterMode === 'reversals') && (
                    <div
                      style={{ height: `${revH}px` }}
                      className={`flex-1 rounded-t-sm transition-all duration-200 ${
                        isHovered
                          ? 'bg-rose-600 shadow-xs'
                          : 'bg-rose-500/90 dark:bg-rose-500'
                      }`}
                      title={`Reversed: ৳${item.reversed.toLocaleString()}`}
                    />
                  )}

                  {/* Net Bar */}
                  {(filterMode === 'all' || filterMode === 'net') && (
                    <div
                      style={{ height: `${netH}px` }}
                      className={`flex-1 rounded-t-sm transition-all duration-200 ${
                        isHovered
                          ? 'bg-emerald-600 shadow-xs'
                          : 'bg-emerald-500/90 dark:bg-emerald-500'
                      }`}
                      title={`Net: ৳${item.net.toLocaleString()}`}
                    />
                  )}
                </div>

                {/* Month Label */}
                <span
                  className={`absolute -bottom-6 text-xs font-semibold tabular-nums transition-colors ${
                    isHovered
                      ? 'text-theme-primary font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive Summary Bar at bottom */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <span>
            Total Gross: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">৳{totalGross.toLocaleString()}</strong>
          </span>
          <span>·</span>
          <span>
            Reversals: <strong className="text-rose-600 dark:text-rose-400 tabular-nums">-৳{totalReversed.toLocaleString()}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Net Realized:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            ৳{totalNet.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            {realizationRate}% efficiency
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. GRADE DISTRIBUTION CHART (Tier Colors, Ghost Ceiling & Interactive Hover)
// ============================================================================
export interface GradeDistributionData {
  grade: string;
  count: number;
  color?: string;
  tier?: string;
}

const DEFAULT_GRADE_COLORS: Record<string, { bg: string; border: string; tier: string }> = {
  'A+': { bg: 'bg-emerald-500 dark:bg-emerald-500', border: 'border-emerald-600', tier: 'Distinction' },
  'A':  { bg: 'bg-teal-500 dark:bg-teal-500', border: 'border-teal-600', tier: 'Excellent' },
  'A-': { bg: 'bg-cyan-500 dark:bg-cyan-500', border: 'border-cyan-600', tier: 'Very Good' },
  'B':  { bg: 'bg-blue-500 dark:bg-blue-500', border: 'border-blue-600', tier: 'Good' },
  'C':  { bg: 'bg-amber-500 dark:bg-amber-500', border: 'border-amber-600', tier: 'Average' },
  'D':  { bg: 'bg-orange-500 dark:bg-orange-500', border: 'border-orange-600', tier: 'Marginal' },
  'F':  { bg: 'bg-rose-500 dark:bg-rose-500', border: 'border-rose-600', tier: 'Remedial' },
};

export const GradeDistributionChart: React.FC<{
  data: GradeDistributionData[];
  height?: number;
}> = ({ data, height = 210 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const ceiling = Math.ceil(maxCount / 50) * 50;

  const passedCount = data
    .filter((d) => d.grade !== 'F')
    .reduce((acc, curr) => acc + curr.count, 0);
  const passRate = ((passedCount / totalCount) * 100).toFixed(1);

  const activeGrade = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="w-full space-y-3">
      {/* Top Cohort Metrics */}
      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Total Assessed:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {totalCount.toLocaleString()} Students
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Overall Pass Rate:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {passRate}%
          </span>
        </div>
      </div>

      {/* Chart Canvas with Ghost Slot Tracks */}
      <div className="relative w-full" style={{ height }}>
        {/* Tooltip */}
        {activeGrade && (
          <div className="absolute top-1 left-2 z-20 bg-slate-900/95 text-white dark:bg-slate-800/95 px-3 py-1.5 rounded-lg shadow-lg border border-slate-700 text-xs pointer-events-none flex items-center gap-3 animate-in fade-in">
            <span className="font-bold text-sm">{activeGrade.grade}</span>
            <div className="tabular-nums">
              <span className="font-semibold">{activeGrade.count} students</span>
              <span className="text-slate-400 ml-1.5">
                ({((activeGrade.count / totalCount) * 100).toFixed(1)}% of cohort)
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 dark:bg-slate-700 text-slate-300">
              {DEFAULT_GRADE_COLORS[activeGrade.grade]?.tier || 'Grade'}
            </span>
          </div>
        )}

        <div className="w-full h-full flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-6">
          {data.map((item, idx) => {
            const chartEffectiveH = height - 42;
            const barH = Math.max((item.count / ceiling) * chartEffectiveH, 8);
            const isHovered = hoveredIdx === idx;
            const meta = DEFAULT_GRADE_COLORS[item.grade] || {
              bg: 'bg-blue-600',
              border: 'border-blue-700',
              tier: 'Grade',
            };

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Count Tag on top of bar */}
                <span
                  className={`text-[11px] font-semibold tabular-nums mb-1 transition-all ${
                    isHovered
                      ? 'text-slate-900 dark:text-slate-100 scale-110'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.count}
                </span>

                {/* Ghost Background Track for Context */}
                <div
                  className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800/70 rounded-t-md relative flex items-end justify-center overflow-hidden"
                  style={{ height: `${chartEffectiveH}px` }}
                >
                  {/* Colored Actual Bar */}
                  <div
                    style={{ height: `${barH}px` }}
                    className={`w-full rounded-t-sm transition-all duration-200 ${meta.bg} ${
                      isHovered ? 'brightness-110 shadow-xs' : 'opacity-90'
                    }`}
                  />
                </div>

                {/* Grade Label */}
                <span
                  className={`absolute -bottom-5 text-xs font-bold transition-colors ${
                    isHovered
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.grade}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. WEEKLY ATTENDANCE TREND CHART (Interactive Day-by-Day Flow)
// ============================================================================
export interface DailyAttendanceMetric {
  day: string;
  dateStr: string;
  present: number;
  absent: number;
  rate: number; // percentage
}

export const WeeklyAttendanceTrendChart: React.FC<{
  data?: DailyAttendanceMetric[];
  benchmark?: number;
  height?: number;
}> = ({
  data = [
    { day: 'Mon', dateStr: 'Sep 21', present: 810, absent: 40, rate: 95.3 },
    { day: 'Tue', dateStr: 'Sep 22', present: 825, absent: 25, rate: 97.1 },
    { day: 'Wed', dateStr: 'Sep 23', present: 790, absent: 60, rate: 92.9 },
    { day: 'Thu', dateStr: 'Sep 24', present: 805, absent: 45, rate: 94.7 },
    { day: 'Fri', dateStr: 'Sep 25', present: 785, absent: 65, rate: 92.4 },
  ],
  benchmark = 90,
  height = 140,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeDay = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="w-full space-y-2">
      {/* Benchmark Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Weekly Target: <strong>{benchmark}%</strong></span>
        </div>
        {activeDay ? (
          <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {activeDay.day}: {activeDay.rate}% ({activeDay.present} present, {activeDay.absent} absent)
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Hover day for details</span>
        )}
      </div>

      <div className="relative w-full flex items-end justify-between gap-3 pt-4 pb-5 border-b border-slate-100 dark:border-slate-800" style={{ height }}>
        {data.map((item, idx) => {
          const isAbove = item.rate >= benchmark;
          const isHovered = hoveredIdx === idx;
          const barHeight = Math.max(((item.rate - 70) / 30) * (height - 28), 12);

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Rate Label */}
              <span className={`text-[10px] font-semibold tabular-nums mb-1 ${isHovered ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
                {item.rate}%
              </span>

              {/* Bar */}
              <div
                style={{ height: `${barHeight}px` }}
                className={`w-full max-w-[42px] rounded-t-md transition-all duration-200 ${
                  isAbove
                    ? isHovered ? 'bg-emerald-600 shadow-xs' : 'bg-emerald-500/90'
                    : isHovered ? 'bg-amber-600 shadow-xs' : 'bg-amber-500/90'
                }`}
              />

              {/* Day Label */}
              <span className={`absolute -bottom-5 text-xs font-medium ${isHovered ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 5. RADIAL PROGRESS RING (For compact KPI Cards)
// ============================================================================
export const RadialProgressRing: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}> = ({
  percentage,
  size = 54,
  strokeWidth = 5,
  color = 'var(--theme-primary)',
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums leading-none">
          {percentage}%
        </span>
        {label && <span className="text-[8px] text-slate-400 uppercase mt-0.5">{label}</span>}
      </div>
    </div>
  );
};
