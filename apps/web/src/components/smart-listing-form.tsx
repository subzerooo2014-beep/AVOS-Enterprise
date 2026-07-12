"use client";

import { useMemo, useState } from "react";

const steps = [
  "المعلومات الأساسية",
  "المواصفات",
  "الصور والفيديو",
  "التسعير الذكي",
  "المراجعة",
];

export function SmartListingForm() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2025");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const quality = useMemo(() => {
    let score = 35;
    if (title.length > 8) score += 15;
    if (brand) score += 10;
    if (model) score += 10;
    if (Number(year) >= 2020) score += 10;
    if (Number(price) > 0) score += 10;
    if (description.length > 40) score += 10;
    return Math.min(100, score);
  }, [title, brand, model, year, price, description]);

  return (
    <div className="smart-listing-layout">
      <aside>
        <span>جودة الإعلان</span>
        <strong>{quality}%</strong>
        <i>
          <b style={{ width: `${quality}%` }} />
        </i>

        <div>
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              className={step === index ? "active" : ""}
              onClick={() => setStep(index)}
            >
              <span>{index + 1}</span>
              {label}
            </button>
          ))}
        </div>
      </aside>

      <section>
        <div className="listing-step-heading">
          <span>
            الخطوة {step + 1} من {steps.length}
          </span>
          <h2>{steps[step]}</h2>
        </div>

        {step === 0 ? (
          <div className="listing-form-grid">
            <label>
              <span>عنوان الإعلان</span>
              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Range Rover Sport HSE"
              />
            </label>
            <label>
              <span>الماركة</span>
              <input
                value={brand}
                onChange={(event) =>
                  setBrand(event.target.value)
                }
                placeholder="Land Rover"
              />
            </label>
            <label>
              <span>الموديل</span>
              <input
                value={model}
                onChange={(event) =>
                  setModel(event.target.value)
                }
                placeholder="Range Rover Sport"
              />
            </label>
            <label>
              <span>السنة</span>
              <input
                value={year}
                onChange={(event) =>
                  setYear(event.target.value)
                }
                type="number"
              />
            </label>
            <label className="full">
              <span>الوصف</span>
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="اكتب وصفًا أو دع AVOS ينشئه..."
              />
            </label>
          </div>
        ) : (
          <div className="listing-placeholder">
            <strong>{steps[step]}</strong>
            <p>
              ستتم معالجة هذه المرحلة بواسطة AVOS
              مع فحص الجودة واقتراح التحسينات.
            </p>
            {step === 3 ? (
              <input
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                type="number"
                placeholder="السعر المقترح"
              />
            ) : null}
          </div>
        )}

        <div className="listing-actions">
          <button
            type="button"
            disabled={step === 0}
            onClick={() =>
              setStep((current) =>
                Math.max(0, current - 1),
              )
            }
          >
            السابق
          </button>
          <button
            type="button"
            disabled={step === steps.length - 1}
            onClick={() =>
              setStep((current) =>
                Math.min(steps.length - 1, current + 1),
              )
            }
          >
            التالي
          </button>
        </div>
      </section>
    </div>
  );
}
