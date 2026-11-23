import React, { useState } from 'react';
import { 
  Eye, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Pill, 
  Stethoscope, 
  User, 
  Calendar, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { DossierGroup, SearchMatchHighlight } from '../types/xml';
import { formatVND } from '../utils/dateUtils';

interface DossierTableProps {
  items: SearchMatchHighlight[];
  onSelectDossier: (dossier: DossierGroup) => void;
  isLoading?: boolean;
}

export const DossierTable: React.FC<DossierTableProps> = ({
  items,
  onSelectDossier,
  isLoading
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [copiedLk, setCopiedLk] = useState<string | null>(null);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = items.slice(startIndex, startIndex + pageSize);

  const handleCopy = (maLk: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(maLk);
    setCopiedLk(maLk);
    setTimeout(() => setCopiedLk(null), 1500);
  };

  const getGenderText = (genderVal: any) => {
    if (genderVal === 1 || genderVal === '1') return { text: 'Nam', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    if (genderVal === 2 || genderVal === '2') return { text: 'Nữ', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
    return { text: 'Khác', color: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
      {/* Table Top Toolbar */}
      <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white tracking-wide">
            Danh Sách Hồ Sơ KCB
          </span>
          <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-semibold">
            {items.length.toLocaleString('vi-VN')} kết quả
          </span>
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Hiển thị mỗi trang:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">STT</th>
              <th className="py-3 px-4 w-32">Mã LK</th>
              <th className="py-3 px-4 min-w-[200px]">Bệnh Nhân</th>
              <th className="py-3 px-4 min-w-[220px]">Chẩn Đoán / ICD</th>
              <th className="py-3 px-4 min-w-[160px]">Thời Gian KCB</th>
              <th className="py-3 px-4 min-w-[150px] text-right">Chi Phí (VNĐ)</th>
              <th className="py-3 px-4 w-36 text-center">Thuốc / DVKT</th>
              <th className="py-3 px-4 w-28 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-600" />
                    <p className="text-sm font-medium text-slate-400">Không tìm thấy hồ sơ nào khớp với bộ lọc</p>
                    <p className="text-xs text-slate-500">Vui lòng thử thay đổi từ khóa tìm kiếm hoặc mở rộng khoảng thời gian.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => {
                const d = item.dossier;
                const rowNum = startIndex + index + 1;
                const gender = getGenderText(d.xml1?.GIOI_TINH);

                return (
                  <tr
                    key={d.maLk}
                    onClick={() => onSelectDossier(d)}
                    className="hover:bg-teal-950/20 transition-colors cursor-pointer group"
                  >
                    {/* STT */}
                    <td className="py-3 px-4 text-center font-mono text-slate-500 text-xs">
                      {rowNum}
                    </td>

                    {/* MA_LK */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-teal-400 font-bold group-hover:underline">
                          {d.maLk}
                        </span>
                        <button
                          onClick={(e) => handleCopy(d.maLk, e)}
                          title="Sao chép Mã LK"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-white transition-opacity"
                        >
                          {copiedLk === d.maLk ? (
                            <Check className="w-3.5 h-3.5 text-teal-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {d.maBn && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          BN: {d.maBn}
                        </div>
                      )}
                    </td>

                    {/* Patient Name & Demographics */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">
                          {d.hoTen || '(Chưa có họ tên)'}
                        </span>
                        {d.xml1?.GIOI_TINH && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${gender.color}`}>
                            {gender.text}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-slate-400 font-mono">
                        {d.soCccd && <span>CCCD: {d.soCccd}</span>}
                        {d.maThe && <span>• Thẻ: {d.maThe}</span>}
                      </div>

                      {/* Search match highlights if any */}
                      {item.sampleMatchedItems?.drugs && item.sampleMatchedItems.drugs.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 max-w-xs truncate">
                          <Pill className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Khớp thuốc: {item.sampleMatchedItems.drugs.join(', ')}</span>
                        </div>
                      )}

                      {item.sampleMatchedItems?.services && item.sampleMatchedItems.services.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 max-w-xs truncate">
                          <Stethoscope className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Khớp DVKT: {item.sampleMatchedItems.services.join(', ')}</span>
                        </div>
                      )}
                    </td>

                    {/* Diagnosis / ICD */}
                    <td className="py-3 px-4">
                      {d.maBenhChinh ? (
                        <div>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold text-[11px] mb-0.5">
                            {d.maBenhChinh}
                          </span>
                          <p className="text-slate-300 text-xs line-clamp-1" title={d.tenBenhChinh}>
                            {d.tenBenhChinh || 'Không có mô tả'}
                          </p>
                          {d.xml1?.MA_BENH_KT && (
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Kèm theo: {d.xml1.MA_BENH_KT}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Chưa có ICD</span>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 text-xs font-mono text-slate-300">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Vào:</span>
                        <span>{d.ngayVao || '—'}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-400 text-[10px] uppercase block">Ra:</span>
                        <span>{d.ngayRa || '—'}</span>
                      </div>
                      {d.xml1?.SO_NGAY_DTRI && (
                        <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                          Điều trị: {d.xml1.SO_NGAY_DTRI} ngày
                        </span>
                      )}
                    </td>

                    {/* Costs */}
                    <td className="py-3 px-4 text-right font-mono">
                      <div className="font-bold text-white text-xs">
                        {formatVND(d.tongChiBv)}
                      </div>
                      <div className="text-[11px] text-teal-400/90 mt-0.5">
                        BHYT: {formatVND(d.tongBhtt)}
                      </div>
                      {d.tongBntt > 0 && (
                        <div className="text-[10px] text-slate-400">
                          BN: {formatVND(d.tongBntt)}
                        </div>
                      )}
                    </td>

                    {/* Drugs / Services Count */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          title={`${d.xml2.length} khoản thuốc`}
                          className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium flex items-center gap-1"
                        >
                          <Pill className="w-3 h-3" />
                          <span>{d.xml2.length}</span>
                        </span>

                        <span
                          title={`${d.xml3.length} dịch vụ kỹ thuật`}
                          className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-medium flex items-center gap-1"
                        >
                          <Stethoscope className="w-3 h-3" />
                          <span>{d.xml3.length}</span>
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDossier(d);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 hover:text-teal-300 border border-teal-500/30 flex items-center justify-center gap-1 text-xs font-medium transition-colors mx-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {items.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 text-xs text-slate-400">
          <div>
            Hiển thị từ <strong className="text-white font-mono">{startIndex + 1}</strong> đến{' '}
            <strong className="text-white font-mono">
              {Math.min(startIndex + pageSize, items.length)}
            </strong>{' '}
            trong tổng số <strong className="text-teal-400 font-mono">{items.length.toLocaleString('vi-VN')}</strong> hồ sơ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono text-white bg-slate-900 border border-slate-700 rounded-md">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
