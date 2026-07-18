import Link from "next/link";

const items = [
  { href: "/seller", label: "نظرة عامة" },
  { href: "/seller/inventory", label: "المخزون" },
  { href: "/seller/leads", label: "العملاء" },
  { href: "/seller/listings/new", label: "إضافة سيارة" },
  { href: "/ads", label: "الإعلانات" },
];

export function SellerNavigation() {
  return (
    <nav className="seller-navigation">
      <strong>AVOS Seller OS</strong>
      <div>
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
