import { Vehicle } from "@/data/vehicles";
import {
  analyzeVehicle,
  estimateOwnership,
} from "@/lib/vehicle-intelligence";
import {
  formatPrice,
} from "@/lib/vehicle-search";

export function VehicleIntelligencePanel({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const intelligence = analyzeVehicle(vehicle);
  const ownership = estimateOwnership(vehicle);

  const scores = [
    ["القيمة مقابل السعر", intelligence.value],
    ["الاعتمادية", intelligence.reliability],
    ["إعادة البيع", intelligence.resale],
    ["سهولة الملكية", intelligence.ownership],
  ] as const;

  return (
    <section className="vehicle-intelligence-panel">
      <div className="intelligence-score-card">
        <span>AVOS Intelligence Score</span>
        <strong>{intelligence.overall}</strong>
        <small>
          دقة التحليل {intelligence.confidence}%
        </small>
      </div>

      <div className="intelligence-breakdown">
        <span>تحليل AVOS</span>
        <h2>{intelligence.summary}</h2>

        <div className="score-bars">
          {scores.map(([label, score]) => (
            <div key={label}>
              <div>
                <span>{label}</span>
                <strong>{score}%</strong>
              </div>
              <i>
                <b style={{ width: `${score}%` }} />
              </i>
            </div>
          ))}
        </div>
      </div>

      <div className="ownership-estimate">
        <span>تكلفة الملكية التقديرية</span>
        <h2>
          {formatPrice(
            ownership.fiveYearTotal,
          )}{" "}
          د.إ
        </h2>
        <small>خلال 5 سنوات</small>

        <dl>
          <div>
            <dt>الوقود سنويًا</dt>
            <dd>
              {formatPrice(
                ownership.yearlyFuel,
              )}{" "}
              د.إ
            </dd>
          </div>
          <div>
            <dt>التأمين سنويًا</dt>
            <dd>
              {formatPrice(
                ownership.yearlyInsurance,
              )}{" "}
              د.إ
            </dd>
          </div>
          <div>
            <dt>الصيانة سنويًا</dt>
            <dd>
              {formatPrice(
                ownership.yearlyMaintenance,
              )}{" "}
              د.إ
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
