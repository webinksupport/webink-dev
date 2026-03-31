'use client'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Minus } from 'lucide-react'
import type { FeatureCategory, TierKey } from '@/lib/product-content'

interface FeatureComparisonGridProps {
  featureMatrix: FeatureCategory[]
  activeTier?: TierKey
}

const ease = [0.25, 0.46, 0.45, 0.94]
const tierNames: TierKey[] = ['basic', 'pro', 'ultimate']
const tierLabels: Record<TierKey, string> = {
  basic: 'Basic',
  pro: 'Pro',
  ultimate: 'Ultimate',
}

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle2 size={16} className="text-[#14EAEA] mx-auto" />
  if (value === false) return <Minus size={16} className="text-white/15 mx-auto" />
  return <span className="font-urbanist text-sm text-white/70">{value}</span>
}

export default function FeatureComparisonGrid({ featureMatrix, activeTier }: FeatureComparisonGridProps) {
  if (!featureMatrix.length) return null

  return (
    <motion.div
      id="compare"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      viewport={{ once: true, margin: '-60px' }}
      className="mt-16"
    >
      <h3 className="font-urbanist font-bold text-xl text-white mb-8 text-center">
        Compare All Features
      </h3>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="sticky top-0 z-10 bg-[#0F0F0F]">
            <tr>
              <th className="text-left font-urbanist font-bold text-xs text-white/40 uppercase tracking-wider pb-4 pr-6 w-[40%]">
                Feature
              </th>
              {tierNames.map((tier) => (
                <th
                  key={tier}
                  className={`text-center font-urbanist font-bold text-xs uppercase tracking-wider pb-4 px-4 ${
                    activeTier === tier ? 'text-[#14EAEA]' : 'text-white/40'
                  }`}
                >
                  {tierLabels[tier]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureMatrix.map((category) => (
              <Fragment key={category.name}>
                <tr>
                  <td
                    colSpan={4}
                    className="font-urbanist font-bold text-sm text-white/60 pt-6 pb-3 border-b border-white/10"
                  >
                    {category.name}
                  </td>
                </tr>
                {category.features.map((feature) => (
                  <tr key={feature.name} className="border-b border-white/5">
                    <td className="font-urbanist text-sm text-white/50 py-3 pr-6">
                      {feature.name}
                    </td>
                    {tierNames.map((tier) => (
                      <td
                        key={tier}
                        className={`text-center py-3 px-4 ${
                          activeTier === tier ? 'bg-[#14EAEA]/5' : ''
                        }`}
                      >
                        <CellValue value={feature[tier]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
