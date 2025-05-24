export default function Header(){
    return(
        <header className="gap-8 mb-6 flex flex-row items-center">
        <div className="text-black text-2xl font-semibold font-almarai">GROCERIES</div>
        <input
          type="text"
          placeholder="Search..."
          className="w-[900px] h-16 px-6 border border-[#BEBEBE] shadow-xl rounded-3xl outline-none text-lg bg-white text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-row items-center gap-4">{/* Like (heart) icon with badge */}
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
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cart.length}
                </span>
            )}
            </div>
        </div>
      </header>

    )
}