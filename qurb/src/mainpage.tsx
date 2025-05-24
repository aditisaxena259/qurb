import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: string;
  img: string;
  available: number;
  quantity: number; // current quantity in cart or selected
  description: string;
  type: string;
}

export default function Main() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Product[]>(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Persist cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  // Load products on mount
  useEffect(() => {
    fetch("https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=all")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFiltered(data);
      })
      .catch(() => {
        // fallback or error handling
        setProducts([]);
        setFiltered([]);
      });
  }, []);

  // Filter products on category or search change
  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const filteredItems = products.filter((item) => {
      const matchesCategory = category === "all" || item.type === category;
      const matchesSearch = item.name.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesSearch;
    });
    setFiltered(filteredItems);
  }, [products, category, searchQuery]);

  // Add item to cart with quantity check against availability
  const handleAddToCart = (item: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === item.id);
      if (existingIndex !== -1) {
        const existingItem = prev[existingIndex];
        if (existingItem.quantity < item.available) {
          const newCart = [...prev];
          newCart[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };
          return newCart;
        } else {
          return prev;
        }
      }
      if (item.available > 0) {
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("likedItems");
    if (stored) {
      setLiked(new Set(JSON.parse(stored)));
    }
  }, []);

  const handleToggleLike = (id: string) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem("likedItems", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="p-10 ml-8">
      <header className="gap-8 mb-6 flex flex-row items-center ">
        <div className="text-black text-2xl font-semibold font-almarai">GROCERIES</div>
        <input
          type="text"
          placeholder="Search..."
          className="w-[900px] h-16 px-6 border border-[#BEBEBE] shadow-xl rounded-3xl outline-none text-lg bg-white text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-row items-center gap-4">
          {/* Like (heart) icon with badge */}
          <div className="relative">
            <img src="/Icon.png" className="h-12 w-12" alt="like-icon" />
            {liked.size > 0 && (
              <span className="absolute -top-5 -right-5 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {liked.size}
              </span>
            )}
          </div>
          <img src="/avatar.png" className="w-20 h-20" alt="avatar" />
          <div className="relative">
            <img
              src="/cart.png"
              className="h-12 w-12 cursor-pointer"
              alt="cart"
              onClick={goToCheckout}
            />
            {cart.length > 0 && (
              <span className="absolute -top-5 -right-5 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="flex flex-row gap-4 mb-6">
          {["All Items", "Drinks", "Fruits", "Bakery"].map((label, idx) => {
            const cat = ["all", "drinks", "fruit", "bakery"][idx];
            return (
              <div
                key={cat}
                onClick={() => setCategory(cat)}
                className={`h-10 w-40 cursor-pointer border flex justify-center items-center border-[#BEBEBE] rounded-3xl font-almarai text-[#474747] text-center shadow-lg ${
                  category === cat ? "bg-black text-white" : ""
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        <div className="text-black font-bold text-3xl mb-6">Trending Items</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20 pr-0 md:pr-64">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-3xl shadow-md bg-white overflow-y-auto h-72 w-full grid grid-cols-2"
            >
              <div className="w-full h-full flex items-center justify-center">
                <img src={item.img} alt={item.name} className="object-cover w-44 h-44" />
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">{item.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <p
                    className={`text-sm mt-2 font-medium px-2 py-1 rounded-xl w-fit ${
                      item.available >= 10
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.available >= 10 ? "Available" : `${item.available} left`}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-md font-semibold text-black whitespace-nowrap">{item.price}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-0 m-0 border-none bg-transparent hover:scale-105 transition-transform"
                      disabled={item.available === 0}
                      title={item.available === 0 ? "Out of stock" : "Add to cart"}
                    >
                      <img src="/icon2.png" className="w-6 h-6" alt="add-to-cart" />
                    </button>
                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className="p-0 m-0 border-none bg-transparent hover:scale-105 transition-transform"
                    >
                      <img
                        src={liked.has(item.id) ? "/Icon.png" : "/Icon3.png"}
                        className="w-6 h-6"
                        alt="like"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
