import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Pill, 
  Stethoscope, 
  FileText, 
  DollarSign, 
  Download, 
  Copy, 
  Check,
  Search
} from 'lucide-react';
import type { DossierGroup } from '../types/xml';
import { XML1_COLUMNS } from '../types/xml';
import { formatVND, parseXmlDate } from '../utils/dateUtils';
import { exportDossiersToExcel } from '../utils/excelExporter';

interface DossierDetailModalProps {
  dossier: DossierGroup | null;
  onClose: () => void;
}

export const DossierDetailModal: React.FC<DossierDetailModalProps> = ({
  dossier,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'XML1' | 'XML2' | 'XML3'>('XML1');
  const [subSearch, setSubSearch] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!dossier) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleExportThisDossier = (tableChoice: 'XML1' | 'XML2' | 'XML3' | 'ALL_THREE') => {
    exportDossiersToExcel([dossier], { tableChoice });
  };

  // Filtered drugs
  const filteredDrugs = dossier.xml2.filter(dr => {
    if (!subSearch) return true;
    const str = `${dr.TEN_THUOC || ''} ${dr.MA_THUOC || ''} ${dr.HAM_LUONG || ''} ${dr.MA_BAC_SI || ''}`.toLowerCase();
    return str.includes(subSearch.toLowerCase());
  });

  // Filtered services
  const filteredServices = dossier.xml3.filter(sv => {
    if (!subSearch) return true;
    const str = `${sv.TEN_DICH_VU || ''} ${sv.MA_DICH_VU || ''} ${sv.TEN_VAT_TU || ''} ${sv.MA_MAY || ''}`.toLowerCase();
    return str.includes(subSearch.toLowerCase());
  });

  const x1: Record<string, any> = (dossier.xml1 || {}) as Record<string, any>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20 flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {dossier.hoTen || 'Bệnh nhân'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold text-xs">
                  Mã LK: {dossier.maLk}
                </span>
                {dossier.maBn && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-xs">
                    Mã BN: {dossier.maBn}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                {dossier.soCccd && <span>CCCD: {dossier.soCccd}</span>}
                {dossier.maThe && <span>Thẻ BHYT: {dossier.maThe}</span>}
                {x1.DIA_CHI && <span className="font-sans truncate max-w-md">• {x1.DIA_CHI}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleExportThisDossier('ALL_THREE')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Hồ Sơ Này (3 Bảng)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic & Financial Mini-Strip */}
        <div className="bg-slate-950/40 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Chẩn đoán:</span>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-mono font-bold border border-teal-500/20">
                {dossier.maBenhChinh || '—'}
              </span>
              <span className="text-slate-200 font-medium">{dossier.tenBenhChinh}</span>
            </div>

            {dossier.maKhoa && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Khoa: {dossier.maKhoa}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div>
              <span className="text-slate-400 text-[11px]">Tổng chi: </span>
              <strong className="text-emerald-400 font-bold">{formatVND(dossier.tongChiBv)}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">BHYT trả: </span>
              <strong className="text-teal-400 font-bold">{formatVND(dossier.tongBhtt)}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">BN trả: </span>
              <strong className="text-slate-300 font-bold">{formatVND(dossier.tongBntt)}</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('XML1'); setSubSearch(''); }}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'XML1'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>XML1: Tổng Hợp KCB</span>
            </button>

            <button
              onClick={() => { setActiveTab('XML2'); setSubSearch(''); }}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'XML2'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>XML2: Thuốc ({dossier.xml2.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('XML3'); setSubSearch(''); }}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'XML3'
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>XML3: DVKT & VTYT ({dossier.xml3.length})</span>
            </button>
          </div>

          {/* Search inside active tab */}
          {(activeTab === 'XML2' || activeTab === 'XML3') && (
            <div className="relative w-64">
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder={`Lọc ${activeTab === 'XML2' ? 'thuốc' : 'dịch vụ'}...`}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          )}
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: XML1 DETAILS */}
          {activeTab === 'XML1' && (
            <div className="space-y-6">
              {/* Grid 4 cards of XML1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Admin info */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Hành Chính & Thẻ</span>
                  </h4>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div><span className="text-slate-500">Họ tên:</span> <strong className="text-white">{dossier.hoTen}</strong></div>
                    <div><span className="text-slate-500">Ngày sinh:</span> {x1.NGAY_SINH ? parseXmlDate(x1.NGAY_SINH).displayDate : '—'}</div>
                    <div><span className="text-slate-500">Giới tính:</span> {x1.GIOI_TINH === 1 || x1.GIOI_TINH === '1' ? 'Nam' : x1.GIOI_TINH === 2 || x1.GIOI_TINH === '2' ? 'Nữ' : 'Khác'}</div>
                    <div><span className="text-slate-500">Mã ĐKBD:</span> {x1.MA_DKBD || '—'}</div>
                    <div><span className="text-slate-500">Hạn thẻ:</span> {parseXmlDate(x1.GT_THE_TU).displayDate} - {parseXmlDate(x1.GT_THE_DEN).displayDate}</div>
                  </div>
                </div>

                {/* Admission & Treatment */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Thời Gian & Điều Trị</span>
                  </h4>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div><span className="text-slate-500">Ngày vào:</span> <span className="font-mono">{dossier.ngayVao}</span></div>
                    <div><span className="text-slate-500">Ngày ra:</span> <span className="font-mono">{dossier.ngayRa}</span></div>
                    <div><span className="text-slate-500">Số ngày ĐT:</span> {x1.SO_NGAY_DTRI || '0'} ngày</div>
                    <div><span className="text-slate-500">Kết quả ĐT:</span> {x1.KET_QUA_DTRI || '—'}</div>
                    <div><span className="text-slate-500">Loại ra viện:</span> {x1.MA_LOAI_RV || '—'}</div>
                  </div>
                </div>

                {/* Clinical / Diagnostics */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Chẩn Đoán Bệnh</span>
                  </h4>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div><span className="text-slate-500">ICD chính:</span> <strong className="text-teal-400 font-mono">{dossier.maBenhChinh}</strong></div>
                    <div><span className="text-slate-500">ICD kèm theo:</span> <span className="font-mono">{x1.MA_BENH_KT || '—'}</span></div>
                    <div><span className="text-slate-500">Chẩn đoán vào:</span> {x1.CHAN_DOAN_VAO || '—'}</div>
                    <div><span className="text-slate-500">Chẩn đoán ra:</span> {x1.CHAN_DOAN_RV || '—'}</div>
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Chi Phí Chi Tiết</span>
                  </h4>
                  <div className="text-xs space-y-1.5 font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tiền thuốc:</span>
                      <span>{formatVND(x1.T_THUOC)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tiền VTYT:</span>
                      <span>{formatVND(x1.T_VTYT)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1">
                      <span className="text-slate-500">Tổng BV:</span>
                      <strong className="text-emerald-400">{formatVND(dossier.tongChiBv)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BHYT trả:</span>
                      <strong className="text-teal-400">{formatVND(dossier.tongBhtt)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* All 65 Raw Columns Table */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
                  <span>Toàn bộ 65 cột dữ liệu XML1 (QĐ 3176)</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(x1, null, 2), 'json_x1')}
                    className="text-xs text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'json_x1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Sao chép JSON</span>
                  </button>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                  {XML1_COLUMNS.map((col) => {
                    const val = x1[col];
                    const isFilled = val !== undefined && val !== null && val !== '';
                    return (
                      <div
                        key={col}
                        className={`p-2 rounded-lg border text-left ${
                          isFilled
                            ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                            : 'bg-slate-950/40 border-slate-900 text-slate-600'
                        }`}
                      >
                        <span className="block text-[10px] font-mono font-semibold text-slate-400 truncate" title={col}>
                          {col}
                        </span>
                        <span className="block text-xs font-mono truncate mt-0.5" title={String(val || '')}>
                          {isFilled ? String(val) : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: XML2 DRUGS */}
          {activeTab === 'XML2' && (
            <div className="space-y-4">
              {filteredDrugs.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Pill className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Hồ sơ này không có khoản thuốc nào (hoặc không khớp từ khóa tìm kiếm).</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Tên Thuốc & Hàm Lượng</th>
                        <th className="py-2.5 px-3 w-24">Mã Thuốc</th>
                        <th className="py-2.5 px-3 w-16 text-center">ĐVT</th>
                        <th className="py-2.5 px-3 w-20 text-right">Số Lượng</th>
                        <th className="py-2.5 px-3 w-24 text-right">Đơn Giá</th>
                        <th className="py-2.5 px-3 w-28 text-right">Thành Tiền</th>
                        <th className="py-2.5 px-3 min-w-[140px]">Ngày Y Lệnh</th>
                        <th className="py-2.5 px-3 min-w-[100px]">Bác Sĩ</th>
                        <th className="py-2.5 px-3 min-w-[120px]">TT Thầu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                      {filteredDrugs.map((dr, i) => (
                        <tr key={i} className="hover:bg-amber-950/10">
                          <td className="py-2.5 px-3 text-center text-slate-500">{dr.STT || i + 1}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <strong className="text-amber-300 font-semibold">{dr.TEN_THUOC}</strong>
                            {dr.HAM_LUONG && <span className="text-slate-400 text-[11px] block">{dr.HAM_LUONG}</span>}
                          </td>
                          <td className="py-2.5 px-3 text-teal-400">{dr.MA_THUOC}</td>
                          <td className="py-2.5 px-3 text-center font-sans">{dr.DON_VI_TINH || '—'}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-white">{dr.SO_LUONG}</td>
                          <td className="py-2.5 px-3 text-right text-slate-300">{formatVND(dr.DON_GIA)}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{formatVND(dr.THANH_TIEN_BV)}</td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                            {dr.NGAY_YL ? parseXmlDate(dr.NGAY_YL).displayDateTime : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 font-sans">{dr.MA_BAC_SI || '—'}</td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans truncate max-w-[140px]" title={String(dr.TT_THAU || '')}>
                            {dr.TT_THAU || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: XML3 SERVICES */}
          {activeTab === 'XML3' && (
            <div className="space-y-4">
              {filteredServices.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Stethoscope className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Hồ sơ này không có DVKT hay VTYT nào (hoặc không khớp từ khóa tìm kiếm).</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3 min-w-[220px]">Tên Dịch Vụ / Vật Tư</th>
                        <th className="py-2.5 px-3 w-24">Mã DVKT</th>
                        <th className="py-2.5 px-3 w-16 text-center">Nhóm</th>
                        <th className="py-2.5 px-3 w-16 text-right">SL</th>
                        <th className="py-2.5 px-3 w-24 text-right">Đơn Giá</th>
                        <th className="py-2.5 px-3 w-28 text-right">Thành Tiền</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Ngày Y Lệnh</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Ngày Thực Hiện</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Ngày Kết Quả</th>
                        <th className="py-2.5 px-3 w-24">Mã Máy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                      {filteredServices.map((sv, i) => (
                        <tr key={i} className="hover:bg-purple-950/10">
                          <td className="py-2.5 px-3 text-center text-slate-500">{sv.STT || i + 1}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <strong className="text-purple-300 font-semibold">{sv.TEN_DICH_VU || sv.TEN_VAT_TU}</strong>
                            {sv.TEN_VAT_TU && sv.TEN_DICH_VU && sv.TEN_VAT_TU !== sv.TEN_DICH_VU && (
                              <span className="text-slate-400 text-[11px] block">{sv.TEN_VAT_TU}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-teal-400">{sv.MA_DICH_VU || sv.MA_VAT_TU}</td>
                          <td className="py-2.5 px-3 text-center text-slate-400">{sv.MA_NHOM}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-white">{sv.SO_LUONG}</td>
                          <td className="py-2.5 px-3 text-right text-slate-300">{formatVND(sv.DON_GIA_BV)}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{formatVND(sv.THANH_TIEN_BV)}</td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                            {sv.NGAY_YL ? parseXmlDate(sv.NGAY_YL).displayDateTime : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                            {sv.NGAY_TH_YL ? parseXmlDate(sv.NGAY_TH_YL).displayDateTime : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                            {sv.NGAY_KQ ? parseXmlDate(sv.NGAY_KQ).displayDateTime : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[100px]" title={String(sv.MA_MAY || '')}>
                            {sv.MA_MAY || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
