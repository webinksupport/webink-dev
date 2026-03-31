'use client'

import { useState, useMemo } from 'react'
import CheckoutButton from './CheckoutButton'

interface VariantData {
  id: string
  name: string
  priceMonthly: number | null
  priceAnnual: number | null
  priceOneTime: number | null
  salePrice: number | null
  setupFee: number | null
  billingInterval: string
  contactOnly: boolean
  stripePriceId: string | null
}

interface AttributeDef {
  name: string
  options: string[]
}

interface ProductConfiguratorProps {
  variants: VariantData[]
  productSetupFee: number | null
  productName: string
  attributeLabels?: string[]
}

function formatPrice(cents: number | null): string {
  if (cents === null) return '—'
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

/**
 * Parse variant names into attribute dimensions + billing choice.
 *
 * Billing is detected from the billingInterval field (MONTHLY vs ANNUAL), not from names.
 * Attribute dimensions come from splitting variant base names on " - ".
 *
 * Examples:
 *   Hosting: names "Basic - Monthly", billingInterval MONTHLY → after stripping billing suffix: "Basic"
 *   Social Media: names "Basic - None", billingInterval MONTHLY → dimensions: ["Basic", "None"]
 *   SEO: names "Basic", billingInterval MONTHLY → single dimension: ["Basic"]
 */
function parseConfig(variants: VariantData[], labels?: string[]) {
  // 1. Billing dimension from data field
  const billingIntervals = Array.from(new Set(variants.map(v => v.billingInterval)))
  const hasBillingChoice = billingIntervals.length > 1

  // 2. Get base names: strip " - Monthly" / " - Annual" suffix if billing choice exists
  const baseNameSet = new Set<string>()
  for (const v of variants) {
    let base = v.name
    if (hasBillingChoice) {
      base = base.replace(/\s*-\s*(Monthly|Annual)$/i, '').trim()
    }
    baseNameSet.add(base)
  }
  const baseNames = Array.from(baseNameSet)

  // 3. Split base names on " - " to detect attribute dimensions
  const splitNames = baseNames.map(n => n.split(' - ').map(s => s.trim()))
  const numDimensions = Math.max(...splitNames.map(s => s.length))

  const attributes: AttributeDef[] = []
  for (let i = 0; i < numDimensions; i++) {
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const parts of splitNames) {
      const val = parts[i]
      if (val && !seen.has(val)) {
        seen.add(val)
        ordered.push(val)
      }
    }
    // Only show dropdown if there are multiple options
    if (ordered.length > 1) {
      const label = labels?.[i] || (i === 0 ? 'Subscription Level' : `Option`)
      attributes.push({ name: label, options: ordered })
    }
  }

  return { billingIntervals, hasBillingChoice, attributes }
}

function findVariant(
  variants: VariantData[],
  billing: string,
  selections: string[],
  hasBillingChoice: boolean
): VariantData | undefined {
  const targetName = selections.length > 0 ? selections.join(' - ') : null
  return variants.find(v => {
    let base = v.name
    if (hasBillingChoice) {
      base = base.replace(/\s*-\s*(Monthly|Annual)$/i, '').trim()
    }
    const nameMatch = targetName === null || base === targetName
    const billingMatch = !hasBillingChoice || v.billingInterval === billing
    return nameMatch && billingMatch
  })
}

function billingLabel(interval: string): string {
  switch (interval) {
    case 'MONTHLY': return 'Monthly'
    case 'ANNUAL': return 'Annual'
    case 'ONE_TIME': return 'One-Time'
    default: return interval
  }
}

const selectChevron = "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]"

export default function ProductConfigurator({ variants, productSetupFee, productName, attributeLabels }: ProductConfiguratorProps) {
  const { billingIntervals, hasBillingChoice, attributes } = useMemo(
    () => parseConfig(variants, attributeLabels),
    [variants, attributeLabels]
  )

  const [selectedBilling, setSelectedBilling] = useState(billingIntervals[0])
  const [selections, setSelections] = useState<string[]>(
    attributes.map(a => a.options[0])
  )

  const selectedVariant = useMemo(
    () => findVariant(variants, selectedBilling, selections, hasBillingChoice),
    [variants, selectedBilling, selections, hasBillingChoice]
  )

  if (!selectedVariant) return null

  const setupFee = selectedVariant.setupFee ?? productSetupFee
  const isContact = selectedVariant.contactOnly

  // Determine price to display
  let primaryPrice: number | null = null
  let suffix = ''
  if (selectedVariant.priceMonthly !== null) {
    primaryPrice = selectedVariant.priceMonthly
    suffix = '/mo'
  } else if (selectedVariant.priceOneTime !== null) {
    primaryPrice = selectedVariant.priceOneTime
    suffix = ''
  } else if (selectedVariant.priceAnnual !== null) {
    primaryPrice = selectedVariant.priceAnnual
    suffix = '/yr'
  }

  const hasSale = selectedVariant.salePrice !== null && primaryPrice !== null

  function updateSelection(index: number, value: string) {
    setSelections(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="max-w-xl">
      <div
        className="bg-white border border-[#E5E5E5] rounded-2xl p-8 md:p-10
          hover:border-[#14EAEA] hover:shadow-[0_8px_40px_rgba(20,234,234,0.15)]
          transition-all duration-300"
      >
        {/* Attribute Dropdowns */}
        <div className="space-y-6 mb-8">
          {attributes.map((attr, i) => (
            <div key={attr.name}>
              <label className="block text-xs font-bold tracking-[2px] uppercase text-[#333333] mb-2">
                {attr.name}
              </label>
              <select
                value={selections[i]}
                onChange={e => updateSelection(i, e.target.value)}
                className={`w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] text-base
                  bg-white focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]
                  transition-colors duration-200 cursor-pointer appearance-none
                  ${selectChevron}
                  bg-no-repeat bg-[right_1rem_center]`}
              >
                {attr.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {hasBillingChoice && (
            <div>
              <label className="block text-xs font-bold tracking-[2px] uppercase text-[#333333] mb-2">
                Renewal Period
              </label>
              <div className="flex gap-3">
                {billingIntervals.map(interval => (
                  <button
                    key={interval}
                    onClick={() => setSelectedBilling(interval)}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border
                      ${selectedBilling === interval
                        ? 'bg-[#0F0F0F] text-white border-[#0F0F0F]'
                        : 'bg-white text-[#333333] border-[#E5E5E5] hover:border-[#14EAEA]'
                      }`}
                  >
                    {billingLabel(interval)}
                    {interval === 'ANNUAL' && (
                      <span className="block text-[10px] font-normal mt-0.5 opacity-70">Save with annual</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E5E5] my-6" />

        {/* Selected variant name */}
        <p className="text-sm text-[#999] mb-2">{productName}</p>
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">{selectedVariant.name}</h3>

        {/* Price */}
        {isContact ? (
          <p className="text-[#F813BE] font-semibold text-2xl mb-2">Contact for Pricing</p>
        ) : (
          <div className="flex items-baseline gap-2 mb-2">
            {hasSale ? (
              <>
                <span className="text-4xl font-bold text-[#1A1A1A]">
                  {formatPrice(selectedVariant.salePrice)}
                </span>
                <span className="text-lg text-[#999] line-through">
                  {formatPrice(primaryPrice)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold text-[#1A1A1A]">
                {formatPrice(primaryPrice)}
              </span>
            )}
            {suffix && <span className="text-[#333333] text-sm">{suffix}</span>}
          </div>
        )}

        {setupFee !== null && setupFee > 0 && (
          <p className="text-sm text-[#333333] mb-6">
            + {formatPrice(setupFee)} one-time setup fee
          </p>
        )}

        {/* CTA */}
        <div className="mt-6">
          <CheckoutButton
            variantId={selectedVariant.id}
            contactOnly={selectedVariant.contactOnly}
            stripePriceId={selectedVariant.stripePriceId}
            isPopular
            className="inline-block font-semibold px-8 py-4 rounded-full transition-colors duration-200 w-full text-center bg-[#F813BE] text-white hover:bg-[#d10fa3] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}
