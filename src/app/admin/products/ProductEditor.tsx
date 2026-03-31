'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Variant {
  id?: string
  _tempId?: string
  name: string
  priceMonthly: number | null
  priceAnnual: number | null
  priceOneTime: number | null
  salePrice: number | null
  setupFee: number | null
  billingInterval: string
  trialDays: number | null
  stripePriceId: string | null
  contactOnly: boolean
  active: boolean
  sortOrder: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string | null
  category: string
  type: string
  status: string
  active: boolean
  featured: boolean
  setupFee: number | null
  billingInterval: string | null
  trialDays: number | null
  sortOrder: number
  stripeProductId: string | null
  variants: Variant[]
}

function centsToDisplay(cents: number | null): string {
  if (cents === null) return ''
  return (cents / 100).toFixed(2)
}

function displayToCents(value: string): number | null {
  if (!value || value.trim() === '') return null
  const num = parseFloat(value)
  if (isNaN(num)) return null
  return Math.round(num * 100)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const productTypes = [
  { value: 'SIMPLE', label: 'Simple' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'VARIABLE', label: 'Variable' },
  { value: 'VARIABLE_SUBSCRIPTION', label: 'Variable Subscription' },
  { value: 'ONE_TIME', label: 'One-Time' },
]

const productStatuses = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DRAFT', label: 'Draft' },
]

const categories = [
  { value: 'hosting', label: 'Hosting' },
  { value: 'seo', label: 'SEO' },
  { value: 'social', label: 'Social Media' },
  { value: 'video', label: 'Video' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'other', label: 'Other' },
]

const billingIntervals = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'ANNUAL', label: 'Annual' },
  { value: 'ONE_TIME', label: 'One-Time' },
]

const inputClasses = 'w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] transition-colors duration-200 placeholder:text-[#555]'
const selectClasses = 'w-full bg-[#0F0F0F] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] transition-colors duration-200'
const labelClasses = 'block text-sm font-bold text-[#999] uppercase tracking-wider mb-2'

function createEmptyVariant(sortOrder: number): Variant {
  return {
    _tempId: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: '',
    priceMonthly: null,
    priceAnnual: null,
    priceOneTime: null,
    salePrice: null,
    setupFee: null,
    billingInterval: 'MONTHLY',
    trialDays: null,
    stripePriceId: null,
    contactOnly: false,
    active: true,
    sortOrder,
  }
}

export default function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter()
  const isEdit = !!product

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [category, setCategory] = useState(product?.category ?? 'hosting')
  const [type, setType] = useState(product?.type ?? 'SIMPLE')
  const [status, setStatus] = useState(product?.status ?? 'ACTIVE')
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [setupFee, setSetupFee] = useState(centsToDisplay(product?.setupFee ?? null))
  const [billingInterval, setBillingInterval] = useState(product?.billingInterval ?? '')
  const [trialDays, setTrialDays] = useState(product?.trialDays?.toString() ?? '')
  const [sortOrder, setSortOrder] = useState(product?.sortOrder?.toString() ?? '0')
  const [stripeProductId, setStripeProductId] = useState(product?.stripeProductId ?? '')

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.length
      ? product.variants.map((v, i) => ({ ...v, _tempId: `existing-${i}` }))
      : [createEmptyVariant(0)]
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isSubscriptionType = type === 'SUBSCRIPTION' || type === 'VARIABLE_SUBSCRIPTION'

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value)
      if (!slugManuallyEdited) {
        setSlug(slugify(value))
      }
    },
    [slugManuallyEdited]
  )

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallyEdited(true)
    setSlug(slugify(value))
  }, [])

  const addVariant = useCallback(() => {
    setVariants((prev) => [...prev, createEmptyVariant(prev.length)])
  }, [])

  const removeVariant = useCallback((index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateVariant = useCallback(
    (index: number, field: keyof Variant, value: unknown) => {
      setVariants((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: value }
        return updated
      })
    },
    []
  )

  const handleSave = async () => {
    setError(null)
    setSaving(true)

    try {
      const payload = {
        name,
        slug,
        description,
        shortDescription: shortDescription || null,
        category,
        type,
        status,
        active: status === 'ACTIVE',
        featured,
        setupFee: displayToCents(setupFee),
        billingInterval: billingInterval || null,
        trialDays: trialDays ? parseInt(trialDays, 10) : null,
        sortOrder: parseInt(sortOrder, 10) || 0,
        stripeProductId: stripeProductId || null,
        variants: variants.map((v, i) => ({
          name: v.name,
          priceMonthly: v.priceMonthly,
          priceAnnual: v.priceAnnual,
          priceOneTime: v.priceOneTime,
          salePrice: v.salePrice,
          setupFee: v.setupFee,
          billingInterval: v.billingInterval,
          trialDays: v.trialDays,
          stripePriceId: v.stripePriceId,
          contactOnly: v.contactOnly,
          active: v.active,
          status: v.active ? 'ACTIVE' : 'INACTIVE',
          sortOrder: i,
        })),
      }

      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'create'} product`)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit || !product) return
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-[#999] hover:text-white hover:border-[#14EAEA]/40 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h1>
          {isEdit && (
            <p className="text-[#999] text-sm mt-1">
              ID: <span className="font-mono">{product.id}</span>
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* General Section */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Managed Web Hosting"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="managed-web-hosting"
                className={inputClasses}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Short Description</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary shown on product cards"
                rows={2}
                className={inputClasses}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full product description"
                rows={5}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClasses}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Type & Settings Section */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Type &amp; Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClasses}>Product Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectClasses}
              >
                {productTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectClasses}
              >
                {productStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Setup Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={setupFee}
                onChange={(e) => setSetupFee(e.target.value)}
                placeholder="0.00"
                className={inputClasses}
              />
            </div>
            {isSubscriptionType && (
              <>
                <div>
                  <label className={labelClasses}>Billing Interval</label>
                  <select
                    value={billingInterval}
                    onChange={(e) => setBillingInterval(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="">None</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Trial Days</label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
              </>
            )}
            <div>
              <label className={labelClasses}>Stripe Product ID</label>
              <input
                type="text"
                value={stripeProductId}
                onChange={(e) => setStripeProductId(e.target.value)}
                placeholder="prod_..."
                className={inputClasses}
              />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`relative inline-flex items-center w-11 h-6 rounded-full overflow-hidden transition-colors duration-200 ${
                  featured ? 'bg-[#14EAEA]' : 'bg-[#333]'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    featured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm font-bold text-[#999] uppercase tracking-wider">
                Featured
              </span>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              Variants ({variants.length})
            </h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-2 text-[#14EAEA] text-sm font-semibold hover:text-[#12d4d4] transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#999] mb-4">No variants yet.</p>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 text-[#14EAEA] font-semibold hover:text-[#12d4d4] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add your first variant
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={variant._tempId || variant.id || index}
                  className="bg-[#0F0F0F] border border-[#333]/50 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#F813BE] uppercase tracking-[2px]">
                      Variant {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className={labelClasses}>Variant Name</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        placeholder="e.g. Basic, Pro, Ultimate"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Monthly Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={centsToDisplay(variant.priceMonthly)}
                        onChange={(e) =>
                          updateVariant(index, 'priceMonthly', displayToCents(e.target.value))
                        }
                        placeholder="0.00"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Annual Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={centsToDisplay(variant.priceAnnual)}
                        onChange={(e) =>
                          updateVariant(index, 'priceAnnual', displayToCents(e.target.value))
                        }
                        placeholder="0.00"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>One-Time Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={centsToDisplay(variant.priceOneTime)}
                        onChange={(e) =>
                          updateVariant(index, 'priceOneTime', displayToCents(e.target.value))
                        }
                        placeholder="0.00"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Sale Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={centsToDisplay(variant.salePrice)}
                        onChange={(e) =>
                          updateVariant(index, 'salePrice', displayToCents(e.target.value))
                        }
                        placeholder="0.00"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Setup Fee ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={centsToDisplay(variant.setupFee)}
                        onChange={(e) =>
                          updateVariant(index, 'setupFee', displayToCents(e.target.value))
                        }
                        placeholder="0.00"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Billing Interval</label>
                      <select
                        value={variant.billingInterval}
                        onChange={(e) =>
                          updateVariant(index, 'billingInterval', e.target.value)
                        }
                        className={selectClasses}
                      >
                        {billingIntervals.map((bi) => (
                          <option key={bi.value} value={bi.value}>
                            {bi.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}>Trial Days</label>
                      <input
                        type="number"
                        value={variant.trialDays ?? ''}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'trialDays',
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                        placeholder="0"
                        className={inputClasses}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClasses}>Stripe Price ID</label>
                      <input
                        type="text"
                        value={variant.stripePriceId ?? ''}
                        onChange={(e) =>
                          updateVariant(index, 'stripePriceId', e.target.value || null)
                        }
                        placeholder="price_..."
                        className={inputClasses}
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-2 sm:col-span-2 lg:col-span-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <button
                          type="button"
                          onClick={() =>
                            updateVariant(index, 'contactOnly', !variant.contactOnly)
                          }
                          className={`relative inline-flex items-center w-11 h-6 rounded-full overflow-hidden transition-colors duration-200 ${
                            variant.contactOnly ? 'bg-[#F813BE]' : 'bg-[#333]'
                          }`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              variant.contactOnly ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-sm text-[#999]">Contact Only</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <button
                          type="button"
                          onClick={() => updateVariant(index, 'active', !variant.active)}
                          className={`relative inline-flex items-center w-11 h-6 rounded-full overflow-hidden transition-colors duration-200 ${
                            variant.active ? 'bg-[#14EAEA]' : 'bg-[#333]'
                          }`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              variant.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-sm text-[#999]">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-bold rounded-full px-8 py-3 hover:bg-[#12d4d4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <Link
              href="/admin/products"
              className="inline-flex items-center border border-[#333] text-[#999] font-semibold rounded-full px-6 py-3 hover:text-white hover:border-[#14EAEA]/40 transition-colors duration-200"
            >
              Cancel
            </Link>
          </div>

          {isEdit && (
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-red-400 text-sm">Are you sure?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 text-white font-bold rounded-full px-6 py-3 hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 text-sm"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border border-[#333] text-[#999] rounded-full px-6 py-3 hover:text-white transition-colors duration-200 text-sm"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold rounded-full px-6 py-3 hover:bg-red-500/20 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
