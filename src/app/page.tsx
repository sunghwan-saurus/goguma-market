export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">🍠 고구마마켓</h1>
          <button className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
            로그인
          </button>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        <p className="text-center text-gray-500 mt-20 text-lg">
          곧 멋진 중고거래 서비스가 오픈됩니다 🍠
        </p>
      </div>
    </main>
  );
}
