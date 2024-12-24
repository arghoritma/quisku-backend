### Dokumentasi Penggunaan API Backend untuk Integrasi Frontend

Dokumentasi ini menjelaskan bagaimana API backend dapat digunakan untuk berbagai operasi seperti mengelola event, pembayaran, dan sesi dalam sistem reservasi online. Semua request menggunakan format **JSON** dan response dari API juga akan berbentuk **JSON**.

---

## **BASE URL**

```
http://localhost:3000/api
```

---

## **EVENTS**

API untuk mengelola events seperti menambah, mendapatkan, memperbarui, dan menghapus event.

### **1. Mendapatkan Semua Events**

**Endpoint**: `/events`  
**Method**: `GET`

**Response**:

```json
[
  {
    "id": 1,
    "name": "Seminar AI",
    "description": "Seminar tentang AI dan aplikasi di kehidupan sehari-hari",
    "capacity": 100,
    "date": "2024-09-20"
  },
  ...
]
```

---

### **2. Mendapatkan Event Berdasarkan ID**

**Endpoint**: `/events/:id`  
**Method**: `GET`

**Response**:

```json
{
  "id": 1,
  "name": "Seminar AI",
  "description": "Seminar tentang AI dan aplikasi di kehidupan sehari-hari",
  "capacity": 100,
  "date": "2024-09-20"
}
```

---

### **3. Menambah Event**

**Endpoint**: `/events/add`  
**Method**: `POST`

**Request**:

```json
{
  "name": "Seminar AI",
  "description": "Seminar tentang AI dan aplikasi di kehidupan sehari-hari",
  "capacity": 100,
  "date": "2024-09-20"
}
```

**Response**:

```json
{
  "message": "Event added successfully",
  "eventId": 1
}
```

---

### **4. Memperbarui Event**

**Endpoint**: `/events/:id`  
**Method**: `PUT`

**Request**:

```json
{
  "name": "Seminar AI",
  "description": "Seminar AI dan implementasi teknologi",
  "capacity": 150,
  "date": "2024-10-01"
}
```

**Response**:

```json
{
  "message": "Event updated successfully"
}
```

---

### **5. Menghapus Event**

**Endpoint**: `/events/:id`  
**Method**: `DELETE`

**Response**:

```json
{
  "message": "Event deleted successfully"
}
```

---

## **SESSIONS**

API untuk mengelola sesi dalam event seperti menambah, memperbarui, dan menghapus sesi.

### **1. Mendapatkan Semua Sesi dalam Event**

**Endpoint**: `/sessions/by-event/:eventId`  
**Method**: `GET`

**Response**:

```json
[
  {
    "id": 1,
    "event_id": 1,
    "name": "Sesi Pembukaan",
    "start_time": "09:00",
    "end_time": "10:00"
  },
  ...
]
```

---

### **2. Menambah Sesi**

**Endpoint**: `/sessions/add`  
**Method**: `POST`

**Request**:

```json
{
  "event_id": 1,
  "name": "Sesi Materi AI",
  "start_time": "11:00",
  "end_time": "12:00"
}
```

**Response**:

```json
{
  "message": "Session added successfully",
  "sessionId": 1
}
```

---

### **3. Memperbarui Sesi**

**Endpoint**: `/sessions/:id`  
**Method**: `PUT`

**Request**:

```json
{
  "name": "Sesi Materi AI Lanjutan",
  "start_time": "11:30",
  "end_time": "12:30"
}
```

**Response**:

```json
{
  "message": "Session updated successfully"
}
```

---

### **4. Menghapus Sesi**

**Endpoint**: `/sessions/:id`  
**Method**: `DELETE`

**Response**:

```json
{
  "message": "Session deleted successfully"
}
```

---

## **PAYMENTS**

API untuk mengelola pembayaran, termasuk integrasi dengan Midtrans.

### **1. Menambah Payment**

**Endpoint**: `/payments/add`  
**Method**: `POST`

**Request**:

```json
{
  "reservationId": 1,
  "amount": 100000,
  "status": "pending",
  "paidAt": "2024-09-01T10:00:00Z"
}
```

**Response**:

```json
{
  "message": "Payment added successfully",
  "paymentId": 1
}
```

---

### **2. Mendapatkan Semua Payments**

**Endpoint**: `/payments`  
**Method**: `GET`

**Response**:

```json
[
  {
    "id": 1,
    "reservation_id": 1,
    "amount": 100000,
    "status": "paid",
    "paid_at": "2024-09-01T10:00:00Z"
  },
  ...
]
```

---

### **3. Mendapatkan Payment Berdasarkan ID**

**Endpoint**: `/payments/:id`  
**Method**: `GET`

**Response**:

```json
{
  "id": 1,
  "reservation_id": 1,
  "amount": 100000,
  "status": "paid",
  "paid_at": "2024-09-01T10:00:00Z"
}
```

---

### **4. Memperbarui Payment**

**Endpoint**: `/payments/:id`  
**Method**: `PUT`

**Request**:

```json
{
  "reservationId": 1,
  "amount": 120000,
  "status": "paid",
  "paidAt": "2024-09-01T12:00:00Z"
}
```

**Response**:

```json
{
  "message": "Payment updated successfully"
}
```

---

### **5. Menghapus Payment**

**Endpoint**: `/payments/:id`  
**Method**: `DELETE`

**Response**:

```json
{
  "message": "Payment deleted successfully"
}
```

---

### **6. Membuat Transaksi Midtrans (Snap)**

**Endpoint**: `/payments/snap`  
**Method**: `POST`

**Request**:

```json
{
  "reservationId": 1,
  "amount": 150000,
  "customerDetails": {
    "first_name": "Budi",
    "last_name": "Pratama",
    "email": "budi.pra@example.com",
    "phone": "08111222333"
  }
}
```

**Response**:

```json
{
  "message": "Payment initiated successfully",
  "snapToken": "XXXXXXXXXXXXXXXX"
}
```

---

### **FRONTEND INTEGRATION EXAMPLE**

Untuk integrasi di frontend dengan menggunakan token Midtrans, Anda bisa menggunakan JavaScript seperti ini:

```javascript
fetch("http://localhost:3000/api/payments/snap", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    reservationId: 1,
    amount: 150000,
    customerDetails: {
      first_name: "Budi",
      last_name: "Pratama",
      email: "budi.pra@example.com",
      phone: "08111222333",
    },
  }),
})
  .then((response) => response.json())
  .then((data) => {
    snap.pay(data.snapToken); // Memanggil Snap.js dengan token yang diterima
  });
```

### NOTE:

- **Error Handling:** Pastikan untuk memeriksa status HTTP dan menangani error di sisi frontend.
- **Authorization:** Jika API Anda memiliki otorisasi (misalnya JWT), jangan lupa untuk menyertakan header `Authorization` dengan token.

---

Dengan dokumentasi ini, alur integrasi antara frontend dan backend akan lebih mudah dan Anda dapat fokus pada pengembangan frontend tanpa harus bolak-balik melihat kode backend.
