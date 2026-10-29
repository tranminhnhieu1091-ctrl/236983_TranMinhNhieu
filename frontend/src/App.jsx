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

      setMessage(
        isEditing
          ? "Đã cập nhật món ăn thành công!"
          : "Đã thêm món ăn thành công!",
      );
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
      ingredients: food.ingredients.join(", "),
    });
  };

  // --- PHẦN GIAO DIỆN (UI) ĐÃ ĐƯỢC LÀM ĐẸP ---
  return (
    <div
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        padding: "30px 20px",
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            color: "#1a73e8",
            textAlign: "center",
            fontSize: "28px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          HỆ THỐNG QUẢN LÝ MÓN ĂN
        </h2>

        {message && (
          <div
            style={{
              backgroundColor: message.includes("thành công")
                ? "#e6f4ea"
                : "#fce8e6",
              color: message.includes("thành công") ? "#1e8e3e" : "#d93025",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* Tìm kiếm */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
        >
          <input
            name="search"
            placeholder="🔍 Tìm tên, loại, ẩm thực..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "15px",
              outline: "none",
              transition: "box-shadow 0.3s",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #e8f0fe")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: "#1a73e8",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={handleClearSearch}
            style={{
              padding: "12px 24px",
              backgroundColor: "#f1f3f4",
              color: "#3c4043",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            Bỏ lọc
          </button>
        </form>

        {/* Form Thêm/Sửa */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px",
            border: "1px solid #e8eaed",
          }}
        >
          <h3
            style={{ margin: "0 0 20px 0", color: "#202124", fontSize: "20px" }}
          >
            {isEditing ? "✏️ Sửa thông tin món ăn" : "✨ Thêm món ăn mới"}
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <input
              name="foodId"
              placeholder="Mã món (VD: F01)"
              value={formData.foodId}
              onChange={handleChange}
              required
              disabled={isEditing}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: isEditing ? "#e9ecef" : "white",
              }}
            />
            <input
              name="name"
              placeholder="Tên món (VD: Phở bò)"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              name="category"
              placeholder="Loại (Món nước, Món cuốn...)"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              name="cuisine"
              placeholder="Ẩm thực (Miền Bắc, Miền Tây...)"
              value={formData.cuisine}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              name="ingredients"
              placeholder="Nguyên liệu (cách nhau dấu phẩy)"
              value={formData.ingredients}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              name="price"
              type="number"
              placeholder="Giá (VND)"
              value={formData.price}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              name="quantity"
              type="number"
              placeholder="Số lượng"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
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
                  padding: "12px 25px",
                  backgroundColor: "#34a853",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "15px",
                  width: isEditing ? "auto" : "100%",
                }}
              >
                {isEditing ? "Lưu thay đổi" : "Thêm món ăn"}
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
                  style={{
                    padding: "12px 25px",
                    backgroundColor: "#ea4335",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Hủy thao tác
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bảng Danh sách */}
        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "#5f6368",
              fontWeight: "bold",
            }}
          >
            ⏳ Đang tải dữ liệu...
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
              borderRadius: "8px",
              border: "1px solid #e8eaed",
            }}
          >
            <table
              width="100%"
              style={{
                borderCollapse: "collapse",
                textAlign: "left",
                backgroundColor: "white",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f1f3f4",
                    color: "#202124",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  <th style={{ padding: "15px", fontWeight: "bold" }}>Mã</th>
                  <th style={{ padding: "15px", fontWeight: "bold" }}>
                    Tên món
                  </th>
                  <th style={{ padding: "15px", fontWeight: "bold" }}>Loại</th>
                  <th style={{ padding: "15px", fontWeight: "bold" }}>
                    Ẩm thực
                  </th>
                  <th style={{ padding: "15px", fontWeight: "bold" }}>Giá</th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {foods.map((f, index) => (
                  <tr
                    key={f.foodId}
                    style={{
                      borderBottom: "1px solid #e8eaed",
                      backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "15px", fontWeight: "500" }}>
                      {f.foodId}
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        color: "#1a73e8",
                        fontWeight: "bold",
                      }}
                    >
                      {f.name}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <span
                        style={{
                          backgroundColor: "#e8f0fe",
                          color: "#1a73e8",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        {f.category}
                      </span>
                    </td>
                    <td style={{ padding: "15px" }}>{f.cuisine}</td>
                    <td
                      style={{
                        padding: "15px",
                        fontWeight: "bold",
                        color: "#d93025",
                      }}
                    >
                      {f.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => editFood(f)}
                        style={{
                          marginRight: "8px",
                          padding: "6px 12px",
                          backgroundColor: "#fbbc04",
                          color: "#000",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(f.foodId)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#ea4335",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
