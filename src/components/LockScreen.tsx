import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { unlockDailyAuth, getTodayDateString } from '../utils/auth';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Vui lòng nhập mã mở khóa để tiếp tục.');
      return;
    }

    const res = unlockDailyAuth(passcode);
    if (res.success) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      setErrorMsg(res.message);
    }
  };

  const todayStr = getTodayDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background ambient medical glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-teal-950/20 text-center relative overflow-hidden">
          {/* Top accent badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ thống bảo mật dữ liệu KCB 3176</span>
          </div>

          {/* Logo / Lock icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-teal-500/30 mb-5">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-white animate-bounce" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            NsN XML DataHub 3176
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Nhập mã truy cập ngày <span className="text-teal-400 font-mono font-medium">{todayStr}</span> để mở khóa phiên làm việc (mỗi ngày nhập 1 lần).
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập mã mở khóa (vd: namns)..."
                autoFocus
                className="w-full px-4 py-3.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-center text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-mono tracking-wider text-base"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center justify-center gap-2 text-rose-400 text-xs bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Mở khóa hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Phát triển bởi <strong className="text-slate-300">Nguyễn Sơn Nam (Nsnnam)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
