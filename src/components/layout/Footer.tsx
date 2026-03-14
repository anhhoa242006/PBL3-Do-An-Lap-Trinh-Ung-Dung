import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiYoutube, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📱</span>
              <span className="text-xl font-bold text-white">PhoneStore</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Chuỗi cửa hàng điện thoại & phụ kiện chính hãng uy tín hàng đầu Việt Nam. Cam kết giá tốt nhất.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <FiYoutube size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <FiInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/dien-thoai" className="hover:text-white transition-colors">📱 Điện thoại</Link></li>
              <li><Link to="/category/may-tinh-bang" className="hover:text-white transition-colors">📟 Máy tính bảng</Link></li>
              <li><Link to="/category/phu-kien" className="hover:text-white transition-colors">🎧 Phụ kiện</Link></li>
              <li><Link to="/category/laptop" className="hover:text-white transition-colors">💻 Laptop</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">🚚 Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🔄 Đổi trả 30 ngày</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🛡️ Bảo hành 12-24 tháng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">💳 Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🔒 Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiPhone size={14} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">1800-6789 (Miễn phí)</p>
                  <p>7:30 - 22:00 mỗi ngày</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={14} className="shrink-0" />
                <a href="mailto:cskh@phonestore.vn" className="hover:text-white transition-colors">
                  cskh@phonestore.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin size={14} className="shrink-0 mt-0.5" />
                <span>350 Lê Văn Hiến, Đà Nẵng</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2024 PhoneStore. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-2">
            <img src="https://placehold.co/40x25/f8f8f8/999?text=VISA" alt="Visa" className="h-6 rounded" />
            <img src="https://placehold.co/40x25/f8f8f8/999?text=MC" alt="Mastercard" className="h-6 rounded" />
            <img src="https://placehold.co/40x25/f8f8f8/999?text=VNP" alt="VNPay" className="h-6 rounded" />
            <img src="https://placehold.co/40x25/f8f8f8/999?text=MOMO" alt="MoMo" className="h-6 rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}
