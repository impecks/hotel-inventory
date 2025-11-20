import React, { useEffect, useState } from 'react';
import { MockDB } from '../services/db';
import { ActivityLog } from '../types';
import { Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const Reports = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    setLogs(MockDB.getLogs());
  }, []);

  const downloadReport = () => {
      // Mock CSV download
      const csvContent = "data:text/csv;charset=utf-8," 
          + "Date,User,Action,Details\n"
          + logs.map(e => `${e.timestamp},${e.userName},${e.action},${e.details}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "activity_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report downloaded successfully");
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">System Reports</h1>
            <p className="text-slate-500">Audit trails and activity logs.</p>
        </div>
        <button onClick={downloadReport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex gap-2 items-center">
              <FileText className="text-hotel-gold" size={20} />
              <h3 className="font-bold text-slate-800">Audit Log</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {logs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                  {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                  {log.userName}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-700">
                                  <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-xs">{log.action}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                  {log.details}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};