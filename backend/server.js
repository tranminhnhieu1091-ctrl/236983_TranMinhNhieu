const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Food = require("./models/Food");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 1. Kiểm tra trạng thái backend (Health check)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

// 2. Lấy danh sách & Tìm kiếm
app.get("/api/foods", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { cuisine: { $regex: search, $options: "i" } },
        ],
      };
    }
    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Xem chi tiết
app.get("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findOne({ foodId: req.params.id });
    if (!food)
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Thêm món mới
app.post("/api/foods", async (req, res) => {
  try {
    const existingFood = await Food.findOne({ foodId: req.body.foodId });
    if (existingFood)
      return res.status(400).json({ message: "Mã món ăn đã tồn tại" });

    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Cập nhật
app.put("/api/foods/:id", async (req, res) => {
  try {
    const updatedFood = await Food.findOneAndUpdate(
      { foodId: req.params.id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedFood)
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Xóa
app.delete("/api/foods/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findOneAndDelete({ foodId: req.params.id });
    if (!deletedFood)
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    res.status(200).json({ message: "Đã xóa món ăn" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
