import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    price: string;
    img: string;
    available: number;
    quantity: number;
    description: string;
    type: string;
    isFreebie?: boolean;
  }
  

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Product[]>(() => {
    const incomingCart = location.state?.cart;
    let initialCart = Array.isArray(incomingCart)
      ? incomingCart
      : incomingCart
      ? [incomingCart]
      : [];

    return initialCart.map((item) => ({
      ...item,
      price: typeof item.price === "string" ? item.price.replace(/[^\d.]/g, "") : item.price,
      quantity: item.quantity || 1,
    }));
  });
  

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Fetch products from API
  useEffect(() => {
    fetch("https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=all")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          price: item.price.replace(/[^\d.]/g, ""),
          quantity: 1,
        }));
        setProducts(mapped);
        setFiltered(mapped);
      });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("likedItems");
    if (stored) {
      setLiked(new Set(JSON.parse(stored)));
    }
  }, []);


  const updateQuantity = (id: string, delta: number, maxQty: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.quantity + delta, maxQty)),
            }
          : item
      );
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
  }, [cart]);

  const discount = useMemo(() => (subtotal > 100 ? 10 : 0), [subtotal]);

  const final = useMemo(() => subtotal - discount, [subtotal, discount]);

  const goBack = () => {
    
    localStorage.setItem("cartItems", JSON.stringify(cart));
    navigate(-1); 
  };

 
  const handleCheckout = () => {
    alert(`Checked out! Total: €${final.toFixed(2)}`);
    setCart([]); 
    navigate("/", { replace: true });
  };
  const applyOffers = (cart: Product[], products: Product[]): Product[] => {
    const updatedCart = [...cart];
    const coke = updatedCart.find((item) =>
      item.name.toLowerCase().includes("coca-cola")
    );
  
    if (coke && coke.quantity >= 6) {
      const existingFreeCoke = updatedCart.find(
        (item) => item.name.toLowerCase() === "coca-cola (free)"
      );
      if (!existingFreeCoke) {
        updatedCart.push({
          ...coke,
          id: `${coke.id}-free`,
          name: "Coca-Cola (Free)",
          quantity: 1,
          price: "0.00",
          isFreebie: true,
        });
      }
    }
  
    const croissant = updatedCart.find((item) =>
        item.name.toLowerCase().includes("croissant")
      );
    
      if (croissant && croissant.quantity >= 3) {
        const existingFreeCoffee = updatedCart.find(
          (item) => item.name.toLowerCase() === "coffee (free)"
        );
    
        if (!existingFreeCoffee) {
          const originalCoffee = products.find((p) =>
            p.name.toLowerCase().includes("coffee")
          );
    
          updatedCart.push({
            id: `${originalCoffee?.id || "coffee-free"}`,
            name: "Coffee (Free)",
            quantity: 1,
            price: "0.00",
            img: originalCoffee?.img || "", 
            available: originalCoffee?.available || 0,
            description: originalCoffee?.description || "Free coffee with croissant offer",
            type: originalCoffee?.type || "beverage",
            isFreebie: true,
        });
      }
    }
  
    return updatedCart;
  };
  
  useEffect(() => {
    setCart((prevCart) =>
      applyOffers(prevCart.filter((p) => !p.isFreebie), products)
    );
  }, [products, cart]);
  useEffect(() => {
  const filteredItems = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFiltered(filteredItems);
}, [searchQuery, products]);
    

  return (
    <div className="lg:p-20 sm:p-10">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 text-black"
      >
        ← Go Back
      </button>
      <header className="gap-4 mb-6 flex flex-col sm:flex-row items-center sm:items-center">
        <div className="text-black text-2xl font-semibold font-almarai mb-4 sm:mb-0">GROCERIES</div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-[900px] h-12 sm:h-16 px-4 sm:px-6 border border-[#BEBEBE] shadow-xl rounded-3xl outline-none text-lg bg-white text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-row items-center gap-4 mt-4 sm:mt-0">
          <div className="relative">
            <img src="/Icon.png" className="h-10 w-10 sm:h-12 sm:w-12" alt="like-icon" />
            {liked.size > 0 && (
              <span className="absolute -top-5 -right-5 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {liked.size}
              </span>
            )}
          </div>
          <img src="/avatar.png" className="w-12 h-12 sm:w-20 sm:h-20" alt="avatar" />
          <div className="relative">
            <img
              src="/cart.png"
              className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer"
              alt="cart"
              onClick={() => navigate("/checkout", { state: { cart } })}
            />
            {cart.length > 0 && (
              <span className="absolute -top-5 -right-5 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">No items in cart.</p>
      ) : (
        
        <>
        
          <div className="grid grid-cols-1 gap-6 mb-8 pr-0 sm:pr-52">
            
                {cart.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).map((item) => (
                    <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row border-gray-500 p-4 rounded-2xl shadow-xl gap-4 items-start ${
                        item.isFreebie ? "bg-green-50 border-dashed border-2 border-green-300" : ""
                    }`}
                    >
                    <img
                        src={item.img}
                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                        alt={item.name}
                    />
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap w-full">
                        <div className="flex flex-col w-full sm:w-[40%] min-w-[180px] mb-4 sm:mb-0">
                            <h2 className="text-xl font-bold text-black">
                            {item.name}{" "}
                            {item.isFreebie && (
                                <span className="text-sm text-green-600 font-semibold">(Free Item)</span>
                            )}
                            </h2>
                            <p className="text-sm mt-4 text-gray-500">Product Code: {item.id}</p>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-center min-w-[160px] gap-4 mb-4 sm:mb-0">
                            {!item.isFreebie ? (
                            <div className="flex items-center gap-2">
                                <button
                                className="px-3 py-1 border bg-red-500 text-white rounded-xl hover:bg-red-600"
                                onClick={() => updateQuantity(item.id, -1, item.available)}
                                >
                                −
                                </button>
                                <span className="px-2 text-black text-lg">{item.quantity}</span>
                                <button
                                className="px-3 py-1 border bg-green-500 text-white rounded-xl hover:bg-green-600"
                                onClick={() => updateQuantity(item.id, 1, item.available)}
                                >
                                +
                                </button>
                            </div>
                            ) : (
                            <p className="text-black text-md">Qty: {item.quantity}</p>
                            )}

                            {!item.isFreebie && item.available < 10 && (
                            <p className="text-sm px-6 py-1 mt-2 text-white bg-orange-400 rounded-xl font-medium">
                                Only {item.available} left!
                            </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 min-w-[120px] justify-end">
                            <p className="text-lg text-gray-500 whitespace-nowrap pr-12">
                            €{parseFloat(item.price).toFixed(2)}
                            </p>
                            {!item.isFreebie && (
                            <button
                                className="text-white bg-green-500 rounded-xl px-3 py-1 hover:bg-green-800"
                                onClick={() => removeFromCart(item.id)}
                                title="Remove"
                            >
                                ✕
                            </button>
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                ))}

            <div className="w-full flex justify-center mt-10">
              <div className="w-full max-w-full text-black grid grid-cols-3 gap-0 text-lg font-semibold border-t border-gray-300">
                {/* Subtotal */}
                <div className="col-span-1 flex justify-center items-center border-b border-gray-300 pl-96 py-3">
                  Subtotal
                </div>
                <div className="col-span-1 flex justify-end items-center border-b border-gray-300 py-3  text-gray-500 font-medium">
                  €{subtotal.toFixed(2)}
                </div>
                <div className="col-span-1 border-b border-gray-300"></div>

                {/* Discount */}
                <div className="col-span-1 flex justify-center items-center border-b border-gray-300 pl-96 py-4">
                  Discount
                </div>
                <div className="col-span-1 flex justify-end items-center border-b border-gray-300 py-4 text-gray-500 font-medium">
                  €{discount.toFixed(2)}
                </div>
                <div className="col-span-1 border-b border-gray-300"></div>

                {/* Total + Checkout */}
                <div className="col-span-1 flex justify-center items-center border-b border-gray-300 pl-96 py-4">
                  Total
                </div>
                <div className="col-span-1 flex justify-end items-center border-b border-gray-300 py-4  text-gray-500 font-medium">
                  €{final.toFixed(2)}
                </div>
                <div className="col-span-1 flex justify-end items-center border-b border-gray-300 py-4 pr-2">
                  <button
                    onClick={handleCheckout} 
                    className="px-4 py-2 bg-[#7FD287] text-white rounded-xl text-sm hover:bg-green-700"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
