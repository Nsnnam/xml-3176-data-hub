import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Search, 
  Users, 
  DollarSign, 
  Pill, 
  Stethoscope, 
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import type { DossierGroup, SummaryStats } from '../types/xml';
import { formatVND, formatDateVN } from '../utils/dateUtils';
import { isDesktopMode, exportDesktopStatistic } from '../utils/desktopBridge';
import { exportDossiersToExcel } from '../utils/excelExporter';

export type KpiModalType = 'DOSSIERS' | 'COST' | 'DRUGS' | 'SERVICES';

interface KpiDetailModalProps {
  type: KpiModalType;
  stats: SummaryStats;
  dossiers: DossierGroup[];
  onClose: () => void;
  onSelectDossier?: (dossier: DossierGroup) => void;
}

export const KpiDetailModal: React.FC<KpiDetailModalProps> = ({
  type,
  stats,
  dossiers,
  onClose,
  onSelectDossier
}) => {
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Aggregated data for Drugs
  const aggregatedDrugs = useMemo(() => {
    if (type !== 'DRUGS') return [];
    const map = new Map<string, { code: string; name: string; unit: string; activeIngredient: string; count: number; totalQty: number; totalCost: number }>();
    
    for (const d of dossiers) {
      for (const drug of d.xml2) {
        const key = drug.MA_THUOC || drug.TEN_THUOC || 'UNKNOWN';
        const existing = map.get(key) || {
          code: drug.MA_THUOC || '',
          name: drug.TEN_THUOC || 'Chưa rõ',
          unit: drug.DON_VI_TINH || '',
          activeIngredient: drug.HAM_LUONG || '',
          count: 0,
          totalQty: 0,
          totalCost: 0
        };
        existing.count += 1;
        existing.totalQty += Number(drug.SO_LUONG) || 0;
        existing.totalCost += Number(drug.THANH_TIEN_BV || drug.THANH_TIEN_BH) || 0;
        map.set(key, existing);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalCost - a.totalCost);
  }, [type, dossiers]);

  // Aggregated data for Services
  const aggregatedServices = useMemo(() => {
    if (type !== 'SERVICES') return [];
    const map = new Map<string, { code: string; name: string; group: string; count: number; totalQty: number; totalCost: number }>();

    for (const d of dossiers) {
      for (const s of d.xml3) {
        const key = s.MA_DICH_VU || s.TEN_DICH_VU || 'UNKNOWN';
        const existing = map.get(key) || {
          code: s.MA_DICH_VU || '',
          name: s.TEN_DICH_VU || 'Chưa rõ',
          group: s.MA_NHOM ? String(s.MA_NHOM) : '',
          count: 0,
          totalQty: 0,
          totalCost: 0
        };
        existing.count += 1;
        existing.totalQty += Number(s.SO_LUONG) || 0;
        existing.totalCost += Number(s.THANH_TIEN_BV || s.THANH_TIEN_BH) || 0;
        map.set(key, existing);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalCost - a.totalCost);
  }, [type, dossiers]);

  // Aggregated data for Departments Cost
  const aggregatedDepartments = useMemo(() => {
    if (type !== 'COST') return [];
    const map = new Map<string, { code: string; count: number; totalBV: number; totalBH: number; totalBN: number }>();

    for (const d of dossiers) {
      const code = d.xml1?.MA_KHOA || d.maKhoa || 'Chưa rõ';
      const existing = map.get(code) || {
        code,
        count: 0,
        totalBV: 0,
        totalBH: 0,
        totalBN: 0
      };
      existing.count += 1;
      existing.totalBV += Number(d.xml1?.T_TONGCHI_BV || d.xml1?.T_TONGCHI_BH || d.tongChiBv) || 0;
      existing.totalBH += Number(d.xml1?.T_BHTT || d.tongBhtt) || 0;
      existing.totalBN += Number(d.xml1?.T_BNTT || d.xml1?.T_BNCCT || d.tongBntt) || 0;
      map.set(code, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.totalBV - a.totalBV);
  }, [type, dossiers]);

  // Filtered views based on search keyword
  const filteredDossiers = useMemo(() => {
    if (type !== 'DOSSIERS' && type !== 'COST') return [];
    if (!search.trim()) return dossiers;
    const q = search.toLowerCase();
    return dossiers.filter(d => 
      (d.hoTen || d.xml1?.HO_TEN || '').toLowerCase().includes(q) ||
      (d.maLk || d.xml1?.MA_LK || '').toLowerCase().includes(q) ||
      (d.maBn || d.xml1?.MA_BN || '').toLowerCase().includes(q) ||
      (d.soCccd || d.xml1?.SO_CCCD || '').includes(q) ||
      (d.maThe || d.xml1?.MA_THE_BHYT || '').toLowerCase().includes(q) ||
      (d.maBenhChinh || d.xml1?.MA_BENH_CHINH || '').toLowerCase().includes(q) ||
      (d.maKhoa || d.xml1?.MA_KHOA || '').toLowerCase().includes(q)
    );
  }, [type, dossiers, search]);

  const filteredDrugs = useMemo(() => {
    if (!search.trim()) return aggregatedDrugs;
    const q = search.toLowerCase();
    return aggregatedDrugs.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.code.toLowerCase().includes(q) ||
      d.activeIngredient.toLowerCase().includes(q)
    );
  }, [aggregatedDrugs, search]);

  const filteredServices = useMemo(() => {
    if (!search.trim()) return aggregatedServices;
    const q = search.toLowerCase();
    return aggregatedServices.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q)
    );
  }, [aggregatedServices, search]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      if (type === 'DOSSIERS' || type === 'COST') {
        // Export dossiers
        exportDossiersToExcel(filteredDossiers.length > 0 ? filteredDossiers : dossiers, {
          tableChoice: type === 'COST' ? 'ALL_THREE' : 'XML1'
        });
        setToastMsg(`Đã xuất thành công ${filteredDossiers.length || dossiers.length} hồ sơ ra file Excel!`);
      } else if (type === 'DRUGS') {
        // Export XML2
        exportDossiersToExcel(dossiers, {
          tableChoice: 'XML2'
        });
        setToastMsg('Đã xuất thành công toàn bộ dữ liệu Thuốc (XML2) ra file Excel!');
      } else if (type === 'SERVICES') {
        // Export XML3
        exportDossiersToExcel(dossiers, {
          tableChoice: 'XML3'
        });
        setToastMsg('Đã xuất thành công toàn bộ dữ liệu DVKT & VTYT (XML3) ra file Excel!');
      }
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert('Lỗi xuất file Excel: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setIsExporting(false);
    }
  };

  const getHeaderInfo = () => {
    switch (type) {
      case 'DOSSIERS':
        return {
          title: 'Chi Tiết Tổng Hợp Hồ Sơ KCB (XML1)',
          desc: `Danh sách chi tiết ${stats.totalDossiers.toLocaleString('vi-VN')} hồ sơ khám chữa bệnh trong kỳ`,
          icon: <Users className="w-6 h-6 text-teal-400" />
        };
      case 'COST':
        return {
          title: 'Chi Tiết Cơ Cấu Viện Phí & Quỹ BHYT',
          desc: `Phân tích tổng viện phí: ${formatVND(stats.totalCostBV)} (BHYT: ${formatVND(stats.totalCostBH)}, Bệnh nhân: ${formatVND(stats.totalCostBN)})`,
          icon: <DollarSign className="w-6 h-6 text-emerald-400" />
        };
      case 'DRUGS':
        return {
          title: 'Chi Tiết Danh Mục Thuốc Kê Đơn (XML2)',
          desc: `Tổng số ${stats.totalXml2.toLocaleString('vi-VN')} lượt kê đơn thuốc & dược liệu`,
          icon: <Pill className="w-6 h-6 text-amber-400" />
        };
      case 'SERVICES':
        return {
          title: 'Chi Tiết Dịch Vụ Kỹ Thuật & VTYT (XML3)',
          desc: `Tổng số ${stats.totalXml3.toLocaleString('vi-VN')} lượt chỉ định DVKT, xét nghiệm, chẩn đoán hình ảnh`,
          icon: <Stethoscope className="w-6 h-6 text-purple-400" />
        };
    }
  };

  const info = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center flex-shrink-0">
              {info.icon}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{info.title}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {info.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="mx-5 mt-3 p-3 bg-teal-500/20 border border-teal-500/50 rounded-xl text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-teal-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* KPI Sub-cards Banner */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {type === 'DOSSIERS' && (
            <>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng hồ sơ</span>
                <span className="text-base font-bold font-mono text-teal-400">{stats.totalDossiers.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Ngoại trú</span>
                <span className="text-base font-bold font-mono text-blue-400">{stats.outpatientCount.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Nội trú</span>
                <span className="text-base font-bold font-mono text-indigo-400">{stats.inpatientCount.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng viện phí</span>
                <span className="text-base font-bold font-mono text-emerald-400 truncate block">{formatVND(stats.totalCostBV)}</span>
              </div>
            </>
          )}

          {type === 'COST' && (
            <>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng viện phí (BV)</span>
                <span className="text-sm font-bold font-mono text-emerald-400 truncate block">{formatVND(stats.totalCostBV)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Quỹ BHYT chi trả</span>
                <span className="text-sm font-bold font-mono text-teal-400 truncate block">{formatVND(stats.totalCostBH)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Bệnh nhân chi trả</span>
                <span className="text-sm font-bold font-mono text-amber-400 truncate block">{formatVND(stats.totalCostBN)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Số lượng khoa phòng</span>
                <span className="text-base font-bold font-mono text-cyan-400">{Object.keys(stats.departmentCounts).length} khoa</span>
              </div>
            </>
          )}

          {type === 'DRUGS' && (
            <>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng lượt kê đơn</span>
                <span className="text-base font-bold font-mono text-amber-400">{stats.totalXml2.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Số mặt thuốc khác nhau</span>
                <span className="text-base font-bold font-mono text-teal-400">{aggregatedDrugs.length.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng tiền thuốc (XML2)</span>
                <span className="text-sm font-bold font-mono text-emerald-400 truncate block">
                  {formatVND(aggregatedDrugs.reduce((sum, d) => sum + d.totalCost, 0))}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Mặt thuốc kê nhiều nhất</span>
                <span className="text-xs font-semibold text-slate-200 truncate block" title={stats.topDrugs[0]?.name}>
                  {stats.topDrugs[0]?.name || 'Chưa rõ'}
                </span>
              </div>
            </>
          )}

          {type === 'SERVICES' && (
            <>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng lượt chỉ định</span>
                <span className="text-base font-bold font-mono text-purple-400">{stats.totalXml3.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Số loại dịch vụ</span>
                <span className="text-base font-bold font-mono text-teal-400">{aggregatedServices.length.toLocaleString('vi-VN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Tổng tiền DVKT (XML3)</span>
                <span className="text-sm font-bold font-mono text-emerald-400 truncate block">
                  {formatVND(aggregatedServices.reduce((sum, s) => sum + s.totalCost, 0))}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">DVKT chỉ định nhiều nhất</span>
                <span className="text-xs font-semibold text-slate-200 truncate block" title={stats.topServices[0]?.name}>
                  {stats.topServices[0]?.name || 'Chưa rõ'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Search Bar within modal */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/20 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                type === 'DRUGS' ? 'Tìm theo tên thuốc, mã thuốc, hoạt chất...' :
                type === 'SERVICES' ? 'Tìm theo tên dịch vụ, mã DVKT, mã nhóm...' :
                'Tìm theo họ tên, mã LK, mã BN, CCCD, BHYT, ICD...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Hiển thị:{' '}
            <strong className="text-teal-400 font-mono">
              {type === 'DRUGS' ? filteredDrugs.length :
               type === 'SERVICES' ? filteredServices.length :
               filteredDossiers.length}
            </strong>{' '}
            mục
          </div>
        </div>

        {/* Main Content Table Area */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[55vh]">
          {/* Table for DOSSIERS */}
          {type === 'DOSSIERS' && (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3">Mã LK / Mã BN</th>
                    <th className="py-2.5 px-3">Họ và Tên</th>
                    <th className="py-2.5 px-3">CCCD / Mã Thẻ</th>
                    <th className="py-2.5 px-3">Vào / Ra Viện</th>
                    <th className="py-2.5 px-3">Chẩn Đoán / ICD</th>
                    <th className="py-2.5 px-3">Khoa</th>
                    <th className="py-2.5 px-3 text-right">Tổng Chi (VNĐ)</th>
                    <th className="py-2.5 px-3 text-center w-16">Xem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDossiers.slice(0, 150).map((d, idx) => (
                    <tr key={d.maLk || d.xml1?.MA_LK || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <span className="font-mono font-bold text-teal-400 block">{d.maLk || d.xml1?.MA_LK}</span>
                        <span className="font-mono text-[11px] text-slate-400">{d.maBn || d.xml1?.MA_BN}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-200 block">{d.hoTen || d.xml1?.HO_TEN}</span>
                        <span className="text-[11px] text-slate-400">{(d.xml1?.GIOI_TINH === 1 || d.xml1?.GIOI_TINH === '1') ? 'Nam' : 'Nữ'} • {formatDateVN(d.xml1?.NGAY_SINH)}</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px]">
                        <span className="text-slate-300 block">{d.soCccd || d.xml1?.SO_CCCD || '—'}</span>
                        <span className="text-cyan-400">{d.maThe || d.xml1?.MA_THE_BHYT}</span>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-400">
                        <span>{formatDateVN(d.ngayVao || d.xml1?.NGAY_VAO)}</span>
                        <br />
                        <span>{formatDateVN(d.ngayRa || d.xml1?.NGAY_RA)}</span>
                      </td>
                      <td className="py-2 px-3 max-w-xs">
                        <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 font-mono font-bold text-[10px] mr-1">
                          {d.maBenhChinh || d.xml1?.MA_BENH_CHINH}
                        </span>
                        <span className="text-[11px] text-slate-300 truncate" title={d.tenBenhChinh || d.xml1?.CHAN_DOAN_RV}>
                          {d.tenBenhChinh || d.xml1?.CHAN_DOAN_RV}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-300">{d.maKhoa || d.xml1?.MA_KHOA}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                        {formatVND(d.tongChiBv || d.xml1?.T_TONGCHI_BV || d.xml1?.T_TONGCHI_BH)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {onSelectDossier && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDossier(d);
                              onClose();
                            }}
                            className="p-1 rounded text-teal-400 hover:bg-teal-500/20"
                            title="Xem chi tiết hồ sơ"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table for COST (Departments Breakdown) */}
          {type === 'COST' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <th className="py-2.5 px-3 w-12 text-center">STT</th>
                      <th className="py-2.5 px-3">Mã Khoa Điều Trị</th>
                      <th className="py-2.5 px-3 text-right">Số Lượng Hồ Sơ</th>
                      <th className="py-2.5 px-3 text-right">Tổng Viện Phí (BV)</th>
                      <th className="py-2.5 px-3 text-right">Quỹ BHYT Trả</th>
                      <th className="py-2.5 px-3 text-right">Bệnh Nhân Trả</th>
                      <th className="py-2.5 px-3 text-center w-24">Tỷ Lệ BHYT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {aggregatedDepartments.map((dept, idx) => {
                      const ratio = dept.totalBV > 0 ? (dept.totalBH / dept.totalBV) * 100 : 0;
                      return (
                        <tr key={dept.code} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-mono font-bold text-teal-400 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{dept.code}</span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-200">
                            {dept.count.toLocaleString('vi-VN')}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                            {formatVND(dept.totalBV)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-teal-400">
                            {formatVND(dept.totalBH)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-amber-400">
                            {formatVND(dept.totalBN)}
                          </td>
                          <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-300">
                            {ratio.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table for DRUGS (XML2) */}
          {type === 'DRUGS' && (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3">Mã Thuốc</th>
                    <th className="py-2.5 px-3">Tên Thuốc / Biệt Dược</th>
                    <th className="py-2.5 px-3">Hoạt Chất / Hàm Lượng</th>
                    <th className="py-2.5 px-3 text-center w-16">ĐVT</th>
                    <th className="py-2.5 px-3 text-right">Lượt Kê</th>
                    <th className="py-2.5 px-3 text-right">Tổng Số Lượng</th>
                    <th className="py-2.5 px-3 text-right">Tổng Thành Tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDrugs.slice(0, 200).map((drug, idx) => (
                    <tr key={drug.code + '_' + idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-400">{drug.code}</td>
                      <td className="py-2 px-3 font-medium text-slate-200">{drug.name}</td>
                      <td className="py-2 px-3 text-slate-400 text-[11px]">{drug.activeIngredient || '—'}</td>
                      <td className="py-2 px-3 text-center text-slate-400">{drug.unit || '—'}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-300">{drug.count.toLocaleString('vi-VN')}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-cyan-400">
                        {drug.totalQty.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                        {formatVND(drug.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table for SERVICES (XML3) */}
          {type === 'SERVICES' && (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3">Mã Dịch Vụ</th>
                    <th className="py-2.5 px-3">Tên Dịch Vụ Kỹ Thuật / VTYT</th>
                    <th className="py-2.5 px-3 text-center w-20">Mã Nhóm</th>
                    <th className="py-2.5 px-3 text-right">Lượt Chỉ Định</th>
                    <th className="py-2.5 px-3 text-right">Tổng Số Lượng</th>
                    <th className="py-2.5 px-3 text-right">Tổng Thành Tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredServices.slice(0, 200).map((srv, idx) => (
                    <tr key={srv.code + '_' + idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-purple-400">{srv.code}</td>
                      <td className="py-2 px-3 font-medium text-slate-200">{srv.name}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                          Nhóm {srv.group}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-300">{srv.count.toLocaleString('vi-VN')}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-cyan-400">
                        {srv.totalQty.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                        {formatVND(srv.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>* Hiển thị tối đa 200 bản ghi trên bảng xem nhanh. Nhấn <strong>Xuất Excel</strong> để lấy toàn bộ dữ liệu đầy đủ.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
