'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

interface ExcelBulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ExcelBulkUploadModal({ isOpen, onClose, onSuccess }: ExcelBulkUploadModalProps) {
  const [parsedData, setParsedData] = useState<any[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // Step 1: 템플릿 다운로드
  const handleDownloadTemplate = () => {
    const templateHeaders = [
      {
        '이름*': '유리쿡',
        '이메일': 'yuri@cooks.kr',
        '연락처': '010-1234-5678',
        '주요채널*': 'instagram',
        '핸들': '@yuri_cooks',
        '채널URL': 'https://instagram.com/yuri_cooks',
        '팔로워수': 124000,
        '카테고리(쉼표구분)': '푸드,리빙',
        '단가최소(원)': 600000,
        '단가최대(원)': 1000000,
        '메모': '요리 전문 크리에이터',
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateHeaders)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '템플릿')
    XLSX.writeFile(workbook, 'lineup_인플루언서_등록_템플릿.xlsx')
  }

  // Step 2: 파일 업로드 및 파싱
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)

        setParsedData(json)
      } catch (err) {
        console.error(err)
        toast.error('엑셀 파일을 읽는 도중 오류가 발생했습니다.')
      }
    }

    reader.readAsArrayBuffer(file)
  }

  // Step 3: 일괄 등록 API 호출
  const handleSubmit = async () => {
    if (parsedData.length === 0) {
      toast.error('등록할 인플루언서 데이터가 없습니다.')
      return
    }

    setIsUploading(true)

    try {
      const res = await fetch('/api/influencers/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ influencers: parsedData }),
      })

      if (res.ok) {
        const result = await res.json()
        toast.success(`${result.created}명 등록 완료 (${result.skipped}명 중복 제외)`)
        onSuccess()
        onClose()
      } else {
        const errorData = await res.json()
        toast.error(`등록 실패: ${errorData.error || '오류 발생'}`)
      }
    } catch (err) {
      console.error(err)
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="card card-pad bg-[var(--white)] max-w-2xl w-full flex flex-col gap-6"
        style={{
          border: '1px solid var(--dark)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow)',
          padding: '28px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-bold text-[var(--dark)]">📄 엑셀 일괄 추가</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-[var(--dark)] text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step 1: 템플릿 다운로드 */}
        <div className="flex flex-col gap-2 p-3 bg-[var(--gray)] rounded-xl border border-[var(--line-soft)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--dark)]">Step 1. 양식 다운로드</span>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 rounded-lg border border-[var(--dark)] bg-[var(--white)] text-xs font-bold hover:bg-[var(--dark)] hover:text-white transition-colors cursor-pointer"
            >
              📥 엑셀 템플릿 다운로드
            </button>
          </div>
          <p className="text-xs text-[var(--muted)]">
            정해진 템플릿 형식에 맞추어 인플루언서 정보를 입력해 주세요. (이름*, 주요채널* 필수)
          </p>
        </div>

        {/* Step 2: 파일 업로드 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--dark)]">Step 2. 엑셀/CSV 파일 선택</span>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .csv, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-ghost font-sans text-xs cursor-pointer"
            >
              📂 파일 선택
            </button>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {fileName || '선택된 파일 없음 (.xlsx, .csv)'}
            </span>
          </div>
        </div>

        {/* Preview Table */}
        {parsedData.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[var(--dark)]">
              총 <b className="text-[var(--green-dark)]">{parsedData.length}명</b> 인식됨 (미리보기)
            </span>
            <div className="border border-[var(--line-soft)] rounded-xl overflow-x-auto max-h-48">
              <table className="tbl w-full text-xs">
                <thead>
                  <tr className="bg-[var(--gray)]">
                    <th className="p-2 text-left">이름</th>
                    <th className="p-2 text-left">주요채널</th>
                    <th className="p-2 text-left">핸들</th>
                    <th className="p-2 text-right">팔로워수</th>
                    <th className="p-2 text-left">카테고리</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-t border-[var(--line-soft)]">
                      <td className="p-2 font-bold">{row['이름*'] || row['이름'] || row.name || '-'}</td>
                      <td className="p-2">{row['주요채널*'] || row['주요채널'] || row.primary_channel || '-'}</td>
                      <td className="p-2">{row['핸들'] || row.handle || '-'}</td>
                      <td className="p-2 text-right">{row['팔로워수'] || row.followers || '0'}</td>
                      <td className="p-2">{row['카테고리(쉼표구분)'] || row['카테고리'] || row.categories || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={onClose} className="btn btn-ghost font-sans">
            취소
          </button>
          <button
            type="button"
            disabled={parsedData.length === 0 || isUploading}
            onClick={handleSubmit}
            className="btn btn-green font-sans cursor-pointer"
            style={{ opacity: parsedData.length === 0 || isUploading ? 0.5 : 1 }}
          >
            {isUploading ? '등록 중...' : `${parsedData.length}명 등록하기`}
          </button>
        </div>
      </div>
    </div>
  )
}
