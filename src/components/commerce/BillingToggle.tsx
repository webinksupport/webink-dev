'use client'

interface BillingToggleProps {
  value: 'monthly' | 'annual'
  onChange: (value: 'monthly' | 'annual') => void
}

export default function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <div className="inline-flex items-center bg-[#111111] rounded-full p-1 border border-white/10">
        <button
          onClick={() => onChange('monthly')}
          className={`px-6 py-2.5 rounded-full font-urbanist font-bold text-sm transition-all duration-200 ${
            value === 'monthly'
              ? 'bg-white text-[#0A0A0A]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onChange('annual')}
          className={`px-6 py-2.5 rounded-full font-urbanist font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
            value === 'annual'
              ? 'bg-[#B9FF33] text-[#0A0A0A]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Annual
          <span className={`text-[10px] font-bold ${
            value === 'annual' ? 'text-[#0A0A0A]/70' : 'text-[#B9FF33]'
          }`}>
            Save 10%
          </span>
        </button>
      </div>
    </div>
  )
}
