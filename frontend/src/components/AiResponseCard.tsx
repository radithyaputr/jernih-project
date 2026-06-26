'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Info, FileText } from 'lucide-react';
import { AIResponse } from '../types';

export const AiResponseCard = ({ data }: { data: AIResponse }) => {
  const isLowConfidence = data.confidence_score < 80;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {isLowConfidence && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3 shadow-subtle">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Perhatian: Verifikasi Diperlukan</h4>
            <p className="text-sm text-amber-700 mt-1">
              AI kurang yakin terhadap hasil ini (Kepercayaan: {data.confidence_score}%). Mohon lakukan verifikasi tambahan melalui sumber resmi atau petugas terkait.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-subtle">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">{data.intent}</h2>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Skor Analisis: {data.confidence_score}/100</span>
          </span>
        </div>
        <p className="text-neutral-700 text-base leading-relaxed mb-6">
          {data.summary}
        </p>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 tracking-wide uppercase">Peta Aksi (Action Map)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <div className="flex items-center space-x-2 mb-3 text-neutral-900 font-medium text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Lakukan Sekarang</span>
              </div>
              <ul className="space-y-2">
                {data.action_map.now.length > 0 ? data.action_map.now.map((item, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start space-x-2">
                    <span className="text-neutral-400 mt-0.5">&#8226;</span>
                    <span>{item}</span>
                  </li>
                )) : <li className="text-sm text-neutral-500 italic">-</li>}
              </ul>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <div className="flex items-center space-x-2 mb-3 text-neutral-900 font-medium text-sm">
                <FileText className="w-4 h-4" />
                <span>Dokumen Dibutuhkan</span>
              </div>
              <ul className="space-y-2">
                {data.action_map.documents.length > 0 ? data.action_map.documents.map((item, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start space-x-2">
                    <span className="text-neutral-400 mt-0.5">&#8226;</span>
                    <span>{item}</span>
                  </li>
                )) : <li className="text-sm text-neutral-500 italic">Tidak ada dokumen khusus</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-100">
          <details className="group">
            <summary className="flex items-center cursor-pointer text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
              <Info className="w-4 h-4 mr-2" />
              Detail Transparansi AI (Responsible AI)
            </summary>
            <div className="mt-3 p-4 bg-neutral-50 rounded-md text-xs text-neutral-600 space-y-2">
              <p><strong>Alasan Analisis:</strong> {data.reasoning}</p>
              <p><strong>Risiko Identifikasi:</strong> {data.risk_warning || "N/A"}</p>
              <p><strong>Sumber Validasi:</strong> {data.sources.join(', ')}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
