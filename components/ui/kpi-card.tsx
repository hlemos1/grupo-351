import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href?: string;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
}

export function KPICard({
  icon: Icon,
  label,
  value,
  href,
  gradient,
  iconBg = "bg-gray-50",
  iconColor = "text-gray-600",
  trend,
}: KPICardProps) {
  const content = (
    <>
      {gradient && (
        <div className={`absolute inset-0 ${gradient} opacity-[0.03] rounded-2xl pointer-events-none`} />
      )}
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4 relative`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight relative">{value}</p>
      <div className="flex items-center justify-between mt-1.5 relative">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <div className="flex items-center gap-1.5">
          {trend && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
          {href && <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-amber-500 transition-colors" />}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group relative bg-white rounded-2xl border border-black/[0.04] p-5 hover:shadow-lg hover:shadow-black/[0.04] hover:border-black/[0.06] transition-all duration-300 overflow-hidden"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl border border-black/[0.04] p-5 overflow-hidden">
      {content}
    </div>
  );
}
