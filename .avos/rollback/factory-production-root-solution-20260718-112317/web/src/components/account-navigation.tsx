import Link from "next/link";

const items = [
  { href: "/account", label: "الرئيسية" },
  { href: "/account/saved", label: "المحفوظات" },
  { href: "/account/messages", label: "الرسائل" },
  { href: "/account/bookings", label: "الحجوزات" },
  { href: "/account/offers", label: "العروض" },
];

export function AccountNavigation() {
  return (
    <nav className="account-navigation">
      <strong>حسابي في AVOS</strong>
      <div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
