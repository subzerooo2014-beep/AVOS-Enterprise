"use client";

import {
  vehicleBrands,
  vehicleCities,
} from "@/data/vehicles";
import {
  useVehicleSearchStore,
} from "@/store/vehicle-search-store";

export function VehicleFilters() {
  const filters = useVehicleSearchStore(
    (state) => state.filters,
  );

  const setFilter = useVehicleSearchStore(
    (state) => state.setFilter,
  );

  const resetFilters = useVehicleSearchStore(
    (state) => state.resetFilters,
  );

  return (
    <aside className="vehicle-filters">
      <div className="filter-heading">
        <div>
          <span>بحث متقدم</span>
          <h2>فلترة السيارات</h2>
        </div>
        <button type="button" onClick={resetFilters}>
          إعادة ضبط
        </button>
      </div>

      <label className="filter-field">
        <span>بحث</span>
        <input
          value={filters.query}
          placeholder="ماركة، موديل، مدينة..."
          onChange={(event) =>
            setFilter("query", event.target.value)
          }
        />
      </label>

      <label className="filter-field">
        <span>الماركة</span>
        <select
          value={filters.brand}
          onChange={(event) =>
            setFilter("brand", event.target.value)
          }
        >
          <option value="">جميع الماركات</option>
          {vehicleBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>المدينة</span>
        <select
          value={filters.city}
          onChange={(event) =>
            setFilter("city", event.target.value)
          }
        >
          <option value="">جميع المدن</option>
          {vehicleCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <div className="filter-grid-two">
        <label className="filter-field">
          <span>الحالة</span>
          <select
            value={filters.condition}
            onChange={(event) =>
              setFilter(
                "condition",
                event.target.value as
                  | "new"
                  | "used"
                  | "",
              )
            }
          >
            <option value="">الكل</option>
            <option value="new">جديد</option>
            <option value="used">مستعمل</option>
          </select>
        </label>

        <label className="filter-field">
          <span>نوع الهيكل</span>
          <select
            value={filters.body}
            onChange={(event) =>
              setFilter(
                "body",
                event.target.value as typeof filters.body,
              )
            }
          >
            <option value="">الكل</option>
            <option value="suv">SUV</option>
            <option value="sedan">سيدان</option>
            <option value="coupe">كوبيه</option>
            <option value="pickup">بيك أب</option>
            <option value="hatchback">هاتشباك</option>
            <option value="van">فان</option>
          </select>
        </label>
      </div>

      <div className="filter-grid-two">
        <label className="filter-field">
          <span>الوقود</span>
          <select
            value={filters.fuel}
            onChange={(event) =>
              setFilter(
                "fuel",
                event.target.value as typeof filters.fuel,
              )
            }
          >
            <option value="">الكل</option>
            <option value="petrol">بنزين</option>
            <option value="diesel">ديزل</option>
            <option value="hybrid">هجين</option>
            <option value="electric">كهربائي</option>
          </select>
        </label>

        <label className="filter-field">
          <span>ناقل الحركة</span>
          <select
            value={filters.transmission}
            onChange={(event) =>
              setFilter(
                "transmission",
                event.target.value as
                  typeof filters.transmission,
              )
            }
          >
            <option value="">الكل</option>
            <option value="automatic">أوتوماتيك</option>
            <option value="manual">عادي</option>
          </select>
        </label>
      </div>

      <div className="filter-grid-two">
        <label className="filter-field">
          <span>من سنة</span>
          <input
            type="number"
            placeholder="2020"
            value={filters.minYear ?? ""}
            onChange={(event) =>
              setFilter(
                "minYear",
                event.target.value
                  ? Number(event.target.value)
                  : null,
              )
            }
          />
        </label>

        <label className="filter-field">
          <span>أعلى سعر</span>
          <input
            type="number"
            placeholder="500000"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              setFilter(
                "maxPrice",
                event.target.value
                  ? Number(event.target.value)
                  : null,
              )
            }
          />
        </label>
      </div>
    </aside>
  );
}
