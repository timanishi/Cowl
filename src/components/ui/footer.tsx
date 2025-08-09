import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <Link 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              利用規約
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
            © 2025 Cowl. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}