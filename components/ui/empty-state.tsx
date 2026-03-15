import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-gray-300" />
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 mt-5 text-xs font-medium text-amber-600 hover:text-amber-500 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
