# Forum API

Submission **Proyek Forun API**  untuk kelas
[ Menjadi Back-End Developer Expert | Dicoding Indonesia](https://www.dicoding.com/academies/276).

## API Specs

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
