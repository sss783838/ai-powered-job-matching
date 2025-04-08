const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Schema cho giao dịch
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API thêm giao dịch mới
app.post('/add-transaction', async (req, res) => {
  const { type, amount } = req.body;

  try {
    const transaction = new Transaction({ type, amount });
    await transaction.save();
    res.status(201).json({ message: 'Transaction added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
});

// API lấy danh sách giao dịch
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = 'http://localhost:5000/api/jobs';

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getJobById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createJob(job: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, job);
  }
}
