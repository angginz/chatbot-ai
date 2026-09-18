# Rama - AI Student Assistant

Rama adalah chatbot AI untuk membantu siswa dan mahasiswa dalam proses belajar. Aplikasi ini menggunakan Node.js dan Express di sisi backend, serta HTML, CSS, dan Vanilla JavaScript di sisi frontend.

Rama dapat membantu menjelaskan materi, menyusun ide belajar, memberi contoh, dan memandu pengguna memahami topik secara bertahap. Rama hanya melayani pertanyaan yang berkaitan dengan pendidikan dan pembelajaran.

## Screenshot
<img width="1439" height="795" alt="Screenshot 2026-09-18 at 22 04 42" src="https://github.com/user-attachments/assets/4d9dc0c1-4a27-4cde-b860-3a5c1c2e9775" />

## Fitur

- Landing page untuk AI Student Assistant.
- Floating chat bubble untuk membuka panel percakapan.
- Percakapan dengan riwayat pesan dalam satu sesi.
- Respons Gemini ditampilkan dengan format Markdown yang lebih mudah dibaca.
- Animasi loading saat Rama sedang memproses pertanyaan.
- Light mode dan dark mode.
- Dark mode tersimpan di browser menggunakan `localStorage`.
- Pesan error yang ramah untuk pengguna.
- Logging status koneksi AI di terminal server.
- Penanganan rate limit atau kuota API.

## Teknologi

- Node.js
- Express
- Google Gemini API melalui `@google/genai`
- Vanilla JavaScript
- HTML dan CSS
- dotenv
- CORS

## Persyaratan

Pastikan sudah terpasang:

- Node.js versi 18 atau lebih baru
- API key Google Gemini

## Instalasi

1. Masuk ke folder project:

```bash
cd gemini-chatbot-ai
```

2. Install dependency:

```bash
npm install
```

3. Buat file `.env` di root project:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Ganti `your_gemini_api_key` dengan API key Gemini milik Anda. Jangan membagikan file `.env` atau API key ke repository publik.

## Menjalankan Aplikasi

Jalankan server dengan perintah:

```bash
node index.js
```

Jika berhasil, terminal akan menampilkan:

```text
Server ready on http://localhost:3000
```

Buka alamat berikut di browser:

[http://localhost:3000](http://localhost:3000)

## Endpoint API

### `POST /api/chat`

Endpoint ini menerima riwayat percakapan dalam format JSON berikut:

```json
{
  "conversation": [
    {
      "role": "user",
      "text": "Apa itu turunan dalam kalkulus?"
    },
    {
      "role": "model",
      "text": "Turunan adalah ..."
    },
    {
      "role": "user",
      "text": "Bisa berikan contoh sederhananya?"
    }
  ]
}
```

Respons berhasil:

```json
{
  "result": "Penjelasan dari Rama ..."
}
```

Respons ketika layanan sedang mencapai limit:

```json
{
  "error": "AI service limit reached"
}
```

Status HTTP yang digunakan:

- `200`: Respons AI berhasil diterima.
- `429`: Kuota atau rate limit API tercapai.
- `502`: AI mengembalikan respons kosong.
- `500`: Terjadi gangguan pada layanan AI atau server.

## Log Server

Server menampilkan status berikut di terminal:

```text
AI connection = OK
```

Artinya Gemini berhasil mengembalikan respons yang berisi teks.

```text
AI Connection Limit
```

Artinya request terkena rate limit atau kuota API.

```text
AI connection = EMPTY RESPONSE
```

Artinya request berhasil diproses, tetapi AI tidak mengembalikan teks.

Untuk error lainnya, server akan menampilkan detail teknis dengan format:

```text
AI connection error: ...
```

Detail teknis hanya dicatat di terminal server. Pengguna frontend akan menerima pesan yang lebih ramah.

## Struktur Folder

```text
.
├── index.js              # Server Express dan endpoint Gemini
├── package.json          # Konfigurasi project dan dependency
├── .env                  # API key lokal, tidak di-commit
└── public/
    ├── index.html        # Landing page dan struktur chat
    ├── script.js         # Interaksi landing page dan request API
    └── style.css         # Tampilan landing page, chat, dan theme
```

## Catatan Keamanan

- Simpan `GEMINI_API_KEY` hanya di backend melalui file `.env`.
- Jangan menaruh API key di `public/script.js`.
- Jangan meng-commit file `.env`.
- Untuk deployment production, tambahkan autentikasi, rate limiting di endpoint aplikasi, validasi input yang lebih ketat, dan HTTPS.

## Lisensi

Project ini menggunakan lisensi ISC sesuai konfigurasi pada `package.json`.
