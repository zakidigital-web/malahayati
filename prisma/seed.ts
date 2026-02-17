import { db } from '@/lib/db'
import crypto from 'crypto'

// Password hashing function
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

async function seed() {
  console.log('Seeding database...')

  // Create default admin user
  const hashedPassword = hashPassword('admin123')
  await db.user.upsert({
    where: { username: 'admin' },
    create: {
      username: 'admin',
      email: 'admin@malahayati-law.id',
      name: 'Administrator',
      password: hashedPassword,
      role: 'admin',
    },
    update: {
      password: hashedPassword,
    },
  })
  console.log('Admin user created/updated')

  // Create sample articles with full content
  const articles = [
    {
      title: 'Memahami Hak-Hak Tersangka dalam Proses Hukum Pidana',
      slug: 'hak-hak-tersangka-proses-hukum-pidana',
      excerpt: 'Setiap tersangka memiliki hak yang dijamin UU. Pelajari hak-hak penting yang perlu Anda ketahui.',
      content: `Setiap orang yang menjadi tersangka dalam kasus pidana memiliki hak-hak yang dijamin oleh undang-undang. Pemahaman tentang hak-hak ini sangat penting untuk memastikan proses hukum berjalan adil.

Hak untuk Didampingi Penasihat Hukum
Setiap tersangka berhak didampingi oleh penasihat hukum atau advokat sejak tahap penyidikan. Ini dijamin oleh Pasal 56 KUHAP yang menyatakan bahwa dalam hal tersangka atau terdakwa diancam dengan pidana mati atau pidana penjara lima tahun atau lebih, ia berhak didampingi penasihat hukum.

Hak untuk Tidak Diperlakukan Secara Kekerasan
Tersangka memiliki hak untuk tidak diperlakukan secara kekerasan oleh pihak penyidik. Setiap bentuk kekerasan, baik fisik maupun psikologis, merupakan pelanggaran HAM dan dapat dipidana.

Hak untuk Mengetahui Alasan Penangkapan
Pihak penyidik wajib memberitahu tersangka tentang alasan penangkapan dan pasal-pasal yang diduga dilanggar. Ini penting agar tersangka dapat mempersiapkan pembelaan.

Hak untuk Mengajukan Penangguhan Penahanan
Tersangka dapat mengajukan penangguhan penahanan dengan jaminan uang atau jaminan orang. Ini memungkinkan tersangka untuk menjalani proses hukum di luar tahanan.

Hak untuk Memberikan Keterangan Bebas
Tersangka berhak memberikan keterangan secara bebas tanpa tekanan atau paksaan. Keterangan yang diberikan di bawah paksaan tidak sah sebagai alat bukti.

Hak untuk Menghadirkan Saksi
Tersangka memiliki hak untuk menghadirkan saksi-saksi yang dapat memberikan keterangan yang menguntungkan baganya dalam proses pemeriksaan dan persidangan.

Hak untuk Mengajukan Praperadilan
Jika ada dugaan kesewenang-wenangan dalam proses hukum, tersangka dapat mengajukan praperadilan untuk mempertanyakan sah atau tidaknya penangkapan, penahanan, penghentian penyidikan, atau tidak dilakukannya penuntutan.

Kesimpulan
Memahami hak-hak sebagai tersangka sangat penting dalam sistem peradilan pidana Indonesia. Jika Anda atau kerabat Anda menghadapi proses hukum pidana, segera hubungi advokat untuk mendampingi dan melindungi hak-hak Anda.`,
      category: 'pidana',
      author: 'Dr. H. Malahayati, S.H., M.H.',
      featured: true,
      readTime: '8 menit',
    },
    {
      title: 'Panduan Lengkap Proses Perceraian di Indonesia',
      slug: 'panduan-proses-perceraian-indonesia',
      excerpt: 'Prosedur dan persyaratan perceraian yang perlu diketahui sebelum memutuskan untuk berpisah.',
      content: `Proses perceraian di Indonesia memiliki prosedur yang harus dipenuhi sesuai dengan hukum yang berlaku. Artikel ini memberikan panduan lengkap untuk memahami proses tersebut.

Jenis Perceraian di Indonesia
Di Indonesia, perceraian dibedakan menjadi dua jenis berdasarkan agama dan keyakinan pasangan:

1. Perceraian di Pengadilan Agama (untuk pasangan Muslim)
2. Perceraian di Pengadilan Negeri (untuk pasangan non-Muslim)

Alasan-Alasan Perceraian
Undang-undang mengatur beberapa alasan yang dapat dijadikan dasar perceraian, antara lain:
- Salah satu pihak berbuat zina, menjadi pemabuk, pemadat judi, dan lain-lain yang sulit disembuhkan
- Salah satu pihak meninggalkan pihak lain selama 2 tahun berturut-turut tanpa izin
- Salah satu pihak mendapatkan hukuman penjara 5 tahun atau lebih
- Salah satu pihak melakukan kekejaman atau penganiayaan
- Terjadi perselisihan terus-menerus antara suami istri

Dokumen yang Diperlukan
Untuk mengajukan perceraian, diperlukan dokumen-dokumen berikut:
- Surat gugatan atau permohonan cerai
- Fotokopi Kartu Tanda Penduduk (KTP)
- Fotokopi Kartu Keluarga (KK)
- Fotokopi Akta Nikah atau buku nikah
- Fotokopi Akta Kelahiran anak (jika ada)
- Surat keterangan dari RT/RW atau Lurah

Tahapan Proses Perceraian
1. Pendaftaran gugatan di pengadilan
2. Mediasi oleh hakim (wajib)
3. Sidang pertama dengan pembacaan gugatan
4. Sidang kedua untuk jawaban tergugat
5. Sidang replik dan duplik
6. Pembuktian dan kesaksian
7. Putusan hakim

Biaya Perceraian
Biaya perceraian bervariasi tergantung pengadilan dan kompleksitas perkara. Pihak yang tidak mampu dapat mengajukan perkara secara prodeo (gratis) dengan melampirkan surat keterangan tidak mampu dari kelurahan.

Penyelesaian Harta Bersama
Dalam perceraian, harta bersama harus dibagi secara adil. Biasanya dibagi rata (50:50) kecuali ada perjanjian pra-nikah yang mengaturnya secara berbeda.

Hak Hadhanah (Hak Asuh Anak)
Pengadilan akan mempertimbangkan kepentingan terbaik anak dalam memutuskan hak asuh. Usia anak, kondisi ekonomi, dan kemampuan masing-masing pihak menjadi pertimbangan utama.

Kesimpulan
Perceraian adalah keputusan besar yang memerlukan pertimbangan matang. Konsultasikan dengan advokat yang berpengalaman untuk mendapatkan pendampingan terbaik dalam proses ini.`,
      category: 'keluarga',
      author: 'Dewi Sartika, S.H., M.Kn.',
      featured: true,
      readTime: '10 menit',
    },
    {
      title: 'Tips Membuat Kontrak Kerja yang Melindungi Kedua Pihak',
      slug: 'tips-membuat-kontrak-kerja',
      excerpt: 'Kontrak kerja yang baik melindungi kedua pihak. Simak tips penyusunannya.',
      content: `Kontrak kerja merupakan perjanjian penting antara pekerja dan pengusaha. Penyusunan kontrak yang baik akan melindungi hak dan kewajiban kedua belah pihak.

Elemen-Elemen Penting dalam Kontrak Kerja
Kontrak kerja yang baik harus memuat:

1. Identitas Para Pihak
Nama lengkap, alamat, dan kedudukan masing-masing pihak harus tercantum dengan jelas.

2. Jenis Pekerjaan
Deskripsi pekerjaan yang jelas dan terperinci untuk menghindari ambiguitas.

3. Waktu Kerja
Ketentuan jam kerja, hari kerja, dan ketentuan lembur harus diatur dengan jelas.

4. Upah dan Tunjangan
Jumlah gaji, metode pembayaran, dan tunjangan-tunjangan yang diterima harus dicantumkan secara rinci.

5. Jangka Waktu Kontrak
Apakah kontrak bersifat Perjanjian Kerja Waktu Tertentu (PKWT) atau Perjanjian Kerja Waktu Tidak Tertentu (PKWTT).

Tips Menyusun Kontrak Kerja yang Baik

Gunakan Bahasa yang Jelas
Hindari penggunaan istilah yang ambigu atau dapat ditafsirkan berbeda oleh masing-masing pihak.

Patuhi Peraturan Perundang-undangan
Pastikan semua ketentuan dalam kontrak tidak bertentangan dengan Undang-undang Ketenagakerjaan dan peraturan terkait lainnya.

Tentukan Masa Percobaan
Masukkan ketentuan masa percobaan yang wajar, biasanya maksimal 3 bulan, untuk mengevaluasi kinerja pekerja.

Atur Pengakhiran Kontrak
Tentukan kondisi-kondisi yang dapat menyebabkan pemutusan kontrak dan hak-hak yang diterima saat kontrak berakhir.

Sertakan Klausul Kerahasiaan
Jika diperlukan, masukkan klausul kerahasiaan untuk melindungi informasi sensitif perusahaan.

Kesalahan Umum yang Harus Dihindari

Tidak Membaca dengan Teliti
Selalu baca seluruh isi kontrak sebelum menandatangani. Jangan ragu untuk bertanya jika ada hal yang tidak dipahami.

Tidak Memperhatikan Klausul Hukum
Perhatikan klausul mengenai penyelesaian sengketa dan hukum yang berlaku.

Mengabaikan Ketentuan PHK
Pahami hak-hak Anda jika terjadi pemutusan hubungan kerja, termasuk pesangon dan uang penghargaan.

Kesimpulan
Kontrak kerja yang disusun dengan baik akan menciptakan hubungan kerja yang harmonis dan mengurangi risiko sengketa di kemudian hari. Konsultasikan dengan profesional hukum untuk memastikan kontrak Anda melindungi kepentingan Anda.`,
      category: 'bisnis',
      author: 'Andi Wijaya, S.H., LL.M.',
      featured: false,
      readTime: '6 menit',
    },
    {
      title: 'Prosedur Penyelesaian Sengketa Tanah di Indonesia',
      slug: 'prosedur-penyelesaian-sengketa-tanah',
      excerpt: 'Langkah-langkah hukum yang dapat ditempuh untuk menyelesaikan sengketa kepemilikan tanah.',
      content: `Sengketa tanah merupakan salah satu permasalahan hukum yang sering terjadi di Indonesia. Artikel ini membahas prosedur penyelesaian sengketa tanah secara hukum.

Jenis-Jenis Sengketa Tanah
Sengketa tanah dapat terjadi dalam berbagai bentuk:
- Sengketa batas tanah antar tetangga
- Sengketa kepemilikan tanah
- Sengketa waris tanah
- Sengketa tanah dengan pihak developer
- Sengketa tanah negara

Langkah Penyelesaian Non-Litigasi

1. Musyawarah
Langkah pertama adalah melakukan musyawarah antara pihak yang bersengketa untuk mencapai kesepakatan damai.

2. Mediasi
Jika musyawarah tidak berhasil, dapat meminta bantuan mediator untuk memfasilitasi penyelesaian.

3. Arbitrase
Para pihak dapat memilih arbitrase sebagai alternatif penyelesaian sengketa di luar pengadilan.

Penyelesaian melalui Litigasi

Gugatan ke Pengadilan Negeri
Jika upaya non-litigasi gagal, pihak yang merasa dirugikan dapat mengajukan gugatan ke Pengadilan Negeri setempat.

Gugatan ke Pengadilan Tata Usaha Negara
Jika sengketa melibatkan keputusan pejabat pemerintah terkait tanah, gugatan diajukan ke PTUN.

Bukti-Bukti yang Diperlukan
Dalam sengketa tanah, bukti-bukti yang penting antara lain:
- Sertifikat tanah
- Sertifikat hak milik
- Girik atau petok D
- Surat kuasa tanah
- Pajak bumi dan bangunan
- Saksi-saksi

Kesimpulan
Penyelesaian sengketa tanah memerlukan pemahaman hukum yang baik dan bukti-bukti yang kuat. Dapatkan konsultasi hukum untuk memastikan hak Anda terlindungi.`,
      category: 'perdata',
      author: 'Rizki Pratama, S.H., M.H.',
      featured: true,
      readTime: '7 menit',
    },
  ]

  for (const article of articles) {
    await db.article.upsert({
      where: { slug: article.slug },
      create: article,
      update: article,
    })
  }

  // Create team members
  const teamMembers = [
    {
      name: 'Dr. H. Malahayati, S.H., M.H.',
      role: 'Pendiri & Managing Partner',
      description: '20+ tahun pengalaman dalam hukum pidana dan perdata.',
      education: 'S3 Ilmu Hukum - Universitas Indonesia',
      order: 0,
    },
    {
      name: 'Andi Wijaya, S.H., LL.M.',
      role: 'Senior Partner',
      description: 'Spesialis hukum bisnis dan korporasi.',
      education: 'LL.M. - Harvard Law School',
      order: 1,
    },
    {
      name: 'Dewi Sartika, S.H., M.Kn.',
      role: 'Partner',
      description: 'Ahli hukum keluarga dan waris.',
      education: 'S2 Kenotariatan - Universitas Gadjah Mada',
      order: 2,
    },
    {
      name: 'Rizki Pratama, S.H., M.H.',
      role: 'Senior Associate',
      description: 'Fokus litigasi dan penyelesaian sengketa.',
      education: 'S2 Ilmu Hukum - Universitas Padjadjaran',
      order: 3,
    },
  ]

  for (const member of teamMembers) {
    await db.teamMember.upsert({
      where: { id: `team-${member.order}` },
      create: member,
      update: member,
    })
  }

  // Create testimonials
  const testimonials = [
    {
      name: 'Ahmad Santoso',
      role: 'Pengusaha',
      content: 'Pelayanan yang sangat profesional dan responsif. Saya sangat terbantu dalam menyelesaikan sengketa bisnis saya.',
      rating: 5,
      order: 0,
    },
    {
      name: 'Siti Rahayu',
      role: 'Karyawan Swasta',
      content: 'Konsultasi yang diberikan sangat jelas dan mudah dipahami. Tim advokat sangat sabar menjelaskan proses hukum.',
      rating: 5,
      order: 1,
    },
    {
      name: 'Budi Prasetyo',
      role: 'Direktur PT. Maju Jaya',
      content: 'Lembaga Bantuan Hukum Malahayati membantu perusahaan kami dalam penyusunan kontrak dan perjanjian kerja sama dengan sangat baik.',
      rating: 5,
      order: 2,
    },
  ]

  for (const t of testimonials) {
    await db.testimonial.upsert({
      where: { id: `testimonial-${t.order}` },
      create: t,
      update: t,
    })
  }

  // Create services
  const services = [
    { title: 'Konsultasi Hukum', description: 'Memberikan arahan dan solusi atas permasalahan hukum yang Anda hadapi.', icon: 'MessageSquare', order: 0 },
    { title: 'Pendampingan Perkara Pidana', description: 'Pendampingan dan pembelaan hukum dalam proses penyidikan hingga persidangan.', icon: 'Shield', order: 1 },
    { title: 'Penyelesaian Sengketa Perdata', description: 'Penanganan sengketa perdata secara litigasi maupun non-litigasi.', icon: 'Gavel', order: 2 },
    { title: 'Pembuatan Dokumen Hukum', description: 'Penyusunan kontrak, perjanjian, dan dokumen hukum lainnya secara profesional.', icon: 'FileText', order: 3 },
    { title: 'Mediasi dan Negosiasi', description: 'Membantu penyelesaian masalah hukum melalui pendekatan musyawarah.', icon: 'HandshakeIcon', order: 4 },
  ]

  for (const s of services) {
    await db.service.upsert({
      where: { id: `service-${s.order}` },
      create: s,
      update: s,
    })
  }

  // Create slider slides with hero images
  const slides = [
    {
      title: 'Pendampingan Hukum Profesional',
      subtitle: 'Terpercaya & Berpengalaman',
      description: 'Kami memberikan solusi hukum yang komprehensif untuk individu dan perusahaan dengan pendekatan profesional dan transparan.',
      buttonText: 'Konsultasi Gratis',
      buttonUrl: '',
      imageUrl: '/images/hero/hero-1.png',
      order: 0,
    },
    {
      title: 'Tim Profesional Kami',
      subtitle: 'Siap Membantu Anda',
      description: 'Tim advokat berpengalaman kami siap memberikan pendampingan dan solusi terbaik untuk setiap permasalahan hukum Anda.',
      buttonText: 'Konsultasi Sekarang',
      buttonUrl: '#contact',
      imageUrl: '/images/hero/hero-2.png',
      order: 1,
    },
    {
      title: 'Solusi Hukum Terbaik',
      subtitle: 'Untuk Setiap Kasus Anda',
      description: 'Kami membantu klien dalam penyusunan kontrak, perjanjian, dan penyelesaian sengketa dengan pendekatan yang profesional.',
      buttonText: 'Hubungi Kami',
      buttonUrl: '#contact',
      imageUrl: '/images/hero/hero-3.png',
      order: 2,
    },
  ]

  for (const slide of slides) {
    await db.slider.upsert({
      where: { id: `slide-${slide.order}` },
      create: slide,
      update: slide,
    })
  }

  console.log('Seeding completed!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
