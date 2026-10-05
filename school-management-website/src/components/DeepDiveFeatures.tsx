import React from 'react';
import { ALL_FEATURES } from '@/data/features';
import { 
  FileText, 
  CheckSquare, 
  BarChart3, 
  UserCheck, 
  ShieldAlert, 
  Smartphone, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface DeepDiveFeaturesProps {
  onOpenDemoModal: () => void;
}

export default function DeepDiveFeatures({ onOpenDemoModal }: DeepDiveFeaturesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-6 h-6 text-indigo-600" />;
      case 'CheckSquare': return <CheckSquare className="w-6 h-6 text-emerald-600" />;
      case 'BarChart3': return <BarChart3 className="w-6 h-6 text-purple-600" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-sky-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-amber-600" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-blue-600" />;
      case 'Lock': return <Lock className="w-6 h-6 text-emerald-600" />;
      default: return <FileText className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <section className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200">
            Enterprise Functionality
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
            Everything Your School Needs to Run Smoothly
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            No half-baked features. Every module is tailored for Indian state boards and CBSE curriculum requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ALL_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(feature.icon)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs font-bold text-indigo-600 mt-1">
                  {feature.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  {feature.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {feature.stats && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">{feature.stats.value}</span>
                    <span className="text-[11px] text-slate-500 block font-medium">{feature.stats.label}</span>
                  </div>
                  <button
                    onClick={onOpenDemoModal}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Request Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
