import { useState, useEffect } from "react";

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    foodId: "",
    name: "",
    category: "",
    cuisine: "",
    ingredients: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async (searchQuery = "") => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/foods?search=${searchQuery}`
        : "/api/foods";
      const res = await fetch(url);
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      setMessage("Lỗi tải dữ liệu");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchFoods("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;
    try {
      await fetch(`/api/foods/${id}`, { method: "DELETE" });
      setMessage("Đã xóa món ăn");
      fetchFoods();
    } catch (err) {
      setMessage("Lỗi khi xóa");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/foods/${formData.foodId}` : "/api/foods";

    // Tách chuỗi nguyên liệu thành mảng
    const payload = {
      ...formData,
      ingredients: formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Mã món ăn đã tồn tại hoặc dữ liệu sai");
        return;
      }

      setMessage(isEditing ? "Đã cập nhật món ăn" : "Đã thêm món ăn");
      setIsEditing(false);
      setFormData({
        foodId: "",
        name: "",
        category: "",
        cuisine: "",
        ingredients: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: "",
      });
      fetchFoods();
    } catch (err) {
      setMessage("Lỗi kết nối server");
    }
  };

  const editFood = (food) => {
    setIsEditing(true);
    setFormData({
      ...food,
      ingredients: food.ingredients.join(", "), // Nối mảng thành chuỗi để đưa lên ô input
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#0056b3" }}>Hệ thống Quản lý Món ăn</h2>
      {message && <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>}

      {/* Tìm kiếm */}
      <form
        onSubmit={handleSearch}
        style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
      >
        <input
          name="search"
          placeholder="Tìm tên, loại, ẩm thực..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 15px", cursor: "pointer" }}
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={handleClearSearch}
          style={{ padding: "8px 15px", cursor: "pointer" }}
        >
          Bỏ lọc
        </button>
      </form>

      {/* Form Thêm/Sửa */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        <h3 style={{ gridColumn: "span 2", margin: "0 0 10px 0" }}>
          {isEditing ? "Sửa món ăn" : "Thêm món ăn mới"}
        </h3>
        <input
          name="foodId"
          placeholder="Mã món (VD: F01)"
          value={formData.foodId}
          onChange={handleChange}
          required
          disabled={isEditing}
          style={{ padding: "8px" }}
        />
        <input
          name="name"
          placeholder="Tên món (VD: Phở bò)"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          name="category"
          placeholder="Loại (Món nước, Món cuốn...)"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          name="cuisine"
          placeholder="Ẩm thực (Miền Bắc, Miền Tây...)"
          value={formData.cuisine}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          name="ingredients"
          placeholder="Nguyên liệu (cách nhau dấu phẩy)"
          value={formData.ingredients}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          name="price"
          type="number"
          placeholder="Giá (VND)"
          value={formData.price}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          name="quantity"
          type="number"
          placeholder="Số lượng"
          value={formData.quantity}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <div
          style={{
            gridColumn: "span 2",
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isEditing ? "Cập nhật" : "Thêm món"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  foodId: "",
                  name: "",
                  category: "",
                  cuisine: "",
                  ingredients: "",
                  price: "",
                  quantity: "",
                  description: "",
                  imageUrl: "",
                });
              }}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table
          width="100%"
          style={{ borderCollapse: "collapse", textAlign: "left" }}
        >
          <thead>
            <tr style={{ background: "#343a40", color: "white" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Mã</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tên</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Loại
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Ẩm thực
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Giá</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.foodId}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {f.foodId}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {f.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {f.category}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {f.cuisine}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {f.price.toLocaleString("vi-VN")} đ
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => editFood(f)}
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(f.foodId)}
                    style={{
                      padding: "5px 10px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
