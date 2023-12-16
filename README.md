# Forum API

Submission **Proyek Forun API**  untuk kelas
[ Menjadi Back-End Developer Expert | Dicoding Indonesia](https://www.dicoding.com/academies/276).

Repository: [Github](https://github.com/Abdurraziq/forum-api)

## API Specs

BASE URL: [https://neat-boats-accept-joyously.a276.dcdg.xyz](https://neat-boats-accept-joyously.a276.dcdg.xyz)

### 1. Registrasi dan Autentikasi Pengguna
   
| Methode      | Endpoint           | Keterangan                   |
| ------------ | ------------------ | ---------------------------- |
| **`POST`**   | `/users`           | Registrasi pengguna          |
| **`POST`**   | `/authentications` | Autentikasi pengguna / login |
| **`PUT`**    | `/authentications` | Memperbarui aceess token     |
| **`DELETE`** | `/authentications` | Menghapus autentikasi        |

### 2. Thread

| Methode    | Endpoint              | Keterangan            |
| ---------- | --------------------- | --------------------- |
| **`POST`** | `/threads`            | Menambahkan thread    |
| **`POST`** | `/threads/{threadId}` | Melihat detail thread |

### 3. Komentar

| Methode      | Endpoint                                   | Keterangan                             |
| ------------ | ------------------------------------------ | -------------------------------------- |
| **`POST`**   | `/threads/{threadId}/comments`             | Menambahkan komentar pada suatu thread |
| **`DELETE`** | `/threads/{threadId}/comments/{commentId}` | Menghapus komentar dari suatu thread   |

### 4. Balasan Komentar

| Methode      | Endpoint                                                     | Keterangan                                              |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------- |
| **`POST`**   | `/threads/{threadId}/comments/{commentId/replies`            | Menambahkan balasan komentar yang ada pada suatu thread |
| **`DELETE`** | `/threads/{threadId}/comments/{commentId}/replies/{replyId}` | Menghapus balasan komentar yang ada pada suatu thread   |

### 5. Menyukai Komentar

| Methode   | Endpoint                                        | Keterangan                                  |
| --------- | ----------------------------------------------- | ------------------------------------------- |
| **`PUT`** | `/threads/{threadId}/comments/{commentId/likes` | Menyukai atau batal menyukai suatu komentar |

### 5. Health Status

| Methode   | Endpoint         | Keterangan                           |
| --------- | ---------------- | ------------------------------------ |
| **`GET`** | `/health-status` | Memeriksa status server dan database |

