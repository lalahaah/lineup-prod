'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { InfluencerItem } from '@/types'
import { InfluencersHeaderClient } from '@/components/influencer/InfluencersHeaderClient'
import { InfluencerSearch } from '@/components/influencer/InfluencerSearch'
import { InfluencerTable } from '@/components/influencer/InfluencerTable'
import { ExcelBulkUploadModal } from '@/components/influencer/ExcelBulkUploadModal'
import { EmptyState } from '@/components/shared/EmptyState'

interface InfluencersContainerClientProps {
  items: InfluencerItem[]
  totalCount: number
}

export function InfluencersContainerClient({ items, totalCount }: InfluencersContainerClientProps) {
  const router = useRouter()
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)

  const handleBulkSuccess = () => {
    router.refresh()
  }

  return (
    <div className="main select-none">
      {/* Header */}
      <InfluencersHeaderClient
        totalCount={totalCount}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
      />

      {/* Content */}
      <div className="content">
        <InfluencerSearch />
        {items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <EmptyState
                icon="👥"
                title="등록된 인플루언서가 없습니다"
                description="인플루언서를 추가해서 DB를 구성해보세요"
              />
            </div>
            <div style={{ marginTop: -20, marginBottom: 40 }}>
              <Link
                href="/influencers/new"
                className="btn btn-green cursor-pointer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
              >
                + 인플루언서 추가
              </Link>
            </div>
          </div>
        ) : (
          <InfluencerTable influencers={items} />
        )}
      </div>

      {/* 엑셀 일괄 업로드 모달 */}
      <ExcelBulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={handleBulkSuccess}
      />
    </div>
  )
}
