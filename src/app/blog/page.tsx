import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageContent } from '@/lib/content'
import BlogContent from './BlogContent'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Blog — InkBlog | Webink Solutions',
  description: 'Digital marketing insights, SEO tips, web design trends, and business growth strategies from the Webink Solutions team in Sarasota, FL.',
}

export default async function BlogPage() {
  const content = await getPageContent('blog')

  return (
    <PageEditorWrapper pageSlug="blog" initialContent={content}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <NavI />
        <BlogContent />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}
