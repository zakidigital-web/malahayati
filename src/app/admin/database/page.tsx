'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Database, Download, Upload, Trash2, RefreshCw, FileBox, 
  AlertTriangle, Check, Loader2, HardDrive
} from 'lucide-react'

interface Backup {
  name: string
  size: number
  createdAt: string
}

export default function AdminDatabasePage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/database')
      const result = await response.json()
      if (result.success) {
        setBackups(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/database', { method: 'POST' })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: 'Backup database berhasil dibuat' })
        fetchBackups()
      } else {
        toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return
    
    setIsRestoring(true)
    try {
      const response = await fetch('/api/admin/database', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: selectedBackup.name }),
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: result.message })
        setShowRestoreDialog(false)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setIsRestoring(false)
    }
  }

  const handleDeleteBackup = async () => {
    if (!selectedBackup) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/database?filename=${encodeURIComponent(selectedBackup.name)}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: 'Backup berhasil dihapus' })
        setShowDeleteDialog(false)
        fetchBackups()
      } else {
        toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleResetDatabase = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/admin/database?action=reset', {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: result.message })
        setShowResetDialog(false)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Manajemen Database</h1>
          <p className="text-slate-500 mt-1">Backup, restore, dan kelola database website</p>
        </div>
        <Button 
          onClick={handleCreateBackup} 
          className="bg-amber-500 hover:bg-amber-600"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Membuat Backup...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Buat Backup Baru
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Status Database</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" /> Aktif
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileBox className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Backup</p>
                <p className="font-semibold">{backups.length} file</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Ukuran Backup</p>
                <p className="font-semibold">
                  {formatSize(backups.reduce((acc, b) => acc + b.size, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBox className="h-5 w-5 text-amber-500" />
            Daftar Backup
          </CardTitle>
          <CardDescription>
            Daftar file backup database yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
              Memuat...
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada backup. Buat backup pertama Anda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup, index) => (
                <div 
                  key={backup.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                      <Database className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{backup.name}</p>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Terbaru
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {formatSize(backup.size)} • {formatDate(backup.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedBackup(backup)
                        setShowRestoreDialog(true)
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setSelectedBackup(backup)
                        setShowDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Zona Berbahaya
          </CardTitle>
          <CardDescription>
            Tindakan di bawah ini dapat menyebabkan kehilangan data permanen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <div>
              <p className="font-medium text-red-800">Reset Database</p>
              <p className="text-sm text-red-600">
                Hapus semua data dan mulai dari awal. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Database
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <RefreshCw className="h-5 w-5" />
              Restore Database
            </DialogTitle>
            <DialogDescription>
              Anda yakin ingin memulihkan database dari backup ini?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-100 text-sm">
              <p><strong>File:</strong> {selectedBackup?.name}</p>
              <p><strong>Ukuran:</strong> {selectedBackup && formatSize(selectedBackup.size)}</p>
              <p><strong>Tanggal:</strong> {selectedBackup && formatDate(selectedBackup.createdAt)}</p>
            </div>
            <p className="text-sm text-amber-600 mt-3">
              ⚠️ Data saat ini akan diganti dengan data dari backup ini.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>Batal</Button>
            <Button 
              onClick={handleRestoreBackup} 
              className="bg-amber-500 hover:bg-amber-600"
              disabled={isRestoring}
            >
              {isRestoring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memulihkan...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Restore
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Backup Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Hapus Backup
            </DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus file backup ini?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-100 text-sm">
              <p><strong>File:</strong> {selectedBackup?.name}</p>
            </div>
            <p className="text-sm text-red-600 mt-3">
              ⚠️ File backup yang dihapus tidak dapat dikembalikan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Batal</Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteBackup}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Database Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reset Database
            </DialogTitle>
            <DialogDescription>
              PERINGATAN: Tindakan ini akan menghapus SEMUA data!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm">
              <p className="font-medium text-red-800 mb-2">Data yang akan dihapus:</p>
              <ul className="list-disc list-inside text-red-600 space-y-1">
                <li>Semua artikel dan berita</li>
                <li>Semua data konsultasi</li>
                <li>Semua anggota tim</li>
                <li>Semua testimoni</li>
                <li>Semua layanan</li>
                <li>Semua slide hero</li>
                <li>Semua pengaturan website</li>
              </ul>
            </div>
            <p className="text-sm text-red-600 mt-3">
              ⚠️ Tindakan ini TIDAK DAPAT dibatalkan. Pastikan Anda sudah membuat backup sebelum melanjutkan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Batal</Button>
            <Button 
              variant="destructive"
              onClick={handleResetDatabase}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mereset...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Ya, Reset Database
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
