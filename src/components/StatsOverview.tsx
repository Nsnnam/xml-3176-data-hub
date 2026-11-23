import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Pill, 
  Stethoscope, 
  TrendingUp, 
  Award,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react';
import { SummaryStats } from '../types/xml';
import { formatVND } from '../utils/dateUtils';

interface StatsOverviewProps {
  stats: SummaryStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Dossiers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hồ Sơ KCB</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {stats.totalDossiers.toLocaleString('vi-VN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Ngoại trú: {stats.outpatientCount.toLocaleString('vi-VN')}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Nội trú: {stats.inpatientCount.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Card 2: Financials */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Viện Phí</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
            {formatVND(stats.totalCostBV)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span title="BHYT Thanh toán" className="truncate">
              BHYT: <strong className="text-slate-300 font-mono">{formatVND(stats.totalCostBH)}</strong>
            </span>
            <span>•</span>
            <span title="Bệnh nhân cùng chi trả" className="truncate">
              BN: <strong className="text-slate-300 font-mono">{formatVND(stats.totalCostBN)}</strong>
            </span>
          </div>
        </div>

        {/* Card 3: Drugs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thuốc (XML2)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
            {stats.totalXml2.toLocaleString('vi-VN')}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Tổng lượt thuốc kê đơn trong kỳ
          </div>
        </div>

        {/* Card 4: Services */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DVKT & VTYT (XML3)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono tracking-tight">
            {stats.totalXml3.toLocaleString('vi-VN')}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Dịch vụ kỹ thuật, xét nghiệm, chẩn đoán hình ảnh
          </div>
        </div>
      </div>

      {/* Toggle Insights Drawer */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>Phân tích nhanh: Top bệnh thường gặp, Top thuốc & Top dịch vụ kỹ thuật</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{showDetails ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDetails && (
          <div className="p-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Top Diseases */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Top Chẩn Đoán (ICD-10)</span>
              </h4>
              <div className="space-y-1.5">
                {stats.topDiseases.length === 0 ? (
                  <p className="text-slate-500 italic">Chưa có dữ liệu</p>
                ) : (
                  stats.topDiseases.slice(0, 5).map((d, i) => (
                    <div key={d.code} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-4 h-4 rounded bg-slate-800 text-teal-400 flex items-center justify-center font-mono font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-mono font-bold text-teal-400">{d.code}</span>
                        <span className="text-slate-300 truncate" title={d.name}>{d.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-400 flex-shrink-0">
                        {d.count.toLocaleString('vi-VN')} hs
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Drugs */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Pill className="w-3.5 h-3.5 text-amber-400" />
                <span>Top Thuốc Sử Dụng Nhiều Nhất</span>
              </h4>
              <div className="space-y-1.5">
                {stats.topDrugs.length === 0 ? (
                  <p className="text-slate-500 italic">Chưa có dữ liệu thuốc</p>
                ) : (
                  stats.topDrugs.slice(0, 5).map((dr, i) => (
                    <div key={dr.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-4 h-4 rounded bg-slate-800 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="text-slate-200 truncate font-medium" title={dr.name}>{dr.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-400 flex-shrink-0">
                        {dr.count.toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Services */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                <span>Top DVKT / Xét Nghiệm</span>
              </h4>
              <div className="space-y-1.5">
                {stats.topServices.length === 0 ? (
                  <p className="text-slate-500 italic">Chưa có dữ liệu DVKT</p>
                ) : (
                  stats.topServices.slice(0, 5).map((sv, i) => (
                    <div key={sv.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-4 h-4 rounded bg-slate-800 text-purple-400 flex items-center justify-center font-mono font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="text-slate-200 truncate font-medium" title={sv.name}>{sv.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-400 flex-shrink-0">
                        {sv.count.toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
