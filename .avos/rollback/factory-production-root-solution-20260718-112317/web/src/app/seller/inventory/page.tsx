import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  SellerNavigation,
} from "@/components/seller-navigation";
import { vehicles } from "@/data/vehicles";
import {
  formatPrice,
} from "@/lib/vehicle-search";
import { getApiStatus } from "@/lib/api";

export default async function SellerInventoryPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell seller-page">
        <SellerNavigation />

        <div className="seller-section-heading">
          <span>Seller Inventory</span>
          <h1>إدارة مخزون السيارات</h1>
          <p>
            الأداء، الجودة، العملاء واقتراحات AVOS.
          </p>
        </div>

        <div className="seller-inventory-table">
          {vehicles.slice(0, 6).map((vehicle, index) => (
            <article key={vehicle.id}>
              <img src={vehicle.image} alt={vehicle.title} />
              <div>
                <span>منشور</span>
                <strong>{vehicle.title}</strong>
                <small>
                  {formatPrice(vehicle.price)} د.إ
                </small>
              </div>
              <div>
                <span>المشاهدات</span>
                <strong>{820 + index * 317}</strong>
              </div>
              <div>
                <span>العملاء</span>
                <strong>{5 + index * 3}</strong>
              </div>
              <div>
                <span>الجودة</span>
                <strong>{88 + (index % 4) * 3}%</strong>
              </div>
              <div>
                <span>اقتراح AVOS</span>
                <strong>
                  {index % 2 === 0
                    ? "أضف فيديو قصير"
                    : "راجع السعر الحالي"}
                </strong>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
