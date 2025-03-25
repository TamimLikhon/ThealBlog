"use client"
export default function CategorySelector({ selectedCategory, onChange }) {
    const categories = ["Science", "Crypto", "AI"];
  
    return (
      <select value={selectedCategory} onChange={(e) => onChange(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    );
  }
  