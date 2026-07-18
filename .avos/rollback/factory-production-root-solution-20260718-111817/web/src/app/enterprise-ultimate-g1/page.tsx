import { AvosShell } from "../../components/avos-g1";

const capabilities = [
  "Global Design System",
  "AVOS Brand Runtime",
  "Logo System",
  "Light Theme Engine",
  "Dark Theme Engine",
  "RTL/LTR Engine",
  "Arabic Localization",
  "English Localization",
  "Responsive Web Shell",
  "Mobile App Shell",
  "Accessibility Engine",
  "Global Navigation",
  "Global Search",
  "Notification Center",
  "Profile Center",
  "Onboarding Engine",
  "Authentication Experience",
  "Landing Experience",
  "Marketplace Experience",
  "Vehicle Detail Experience",
  "Deal Experience",
  "Auction Experience",
  "Chat Experience",
  "AI Assistant Experience",
  "Admin Experience",
  "Dealer Experience",
  "Partner Experience",
  "Design Tokens",
  "UI Component Library",
  "Experience Configuration Center",
];

export default function EnterpriseUltimateG1Page() {
  return (
    <AvosShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-[28px] border border-[#d8cdbe] bg-[#fffdf8] p-8 shadow-[0_16px_40px_rgba(24,50,74,0.10)]">
          <p className="text-sm font-bold text-[#b8924a]">
            AVOS Enterprise · Global Experience
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-[#18324a]">
            AVOS Enterprise Ultimate Mega Bundle G1
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#66717c]">
            هوية AVOS، الشعار، الثيمات المريحة، دعم العربية والإنجليزية،
            RTL/LTR، نظام التصميم، وتجارب الويب والموبايل.
          </p>
        </section>

        <section
          id="experience"
          className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {capabilities.map((capability) => (
            <article
              key={capability}
              className="rounded-[20px] border border-[#d8cdbe] bg-[#fffdf8] p-5 shadow-sm"
            >
              <h2 className="font-bold text-[#18324a]">{capability}</h2>
            </article>
          ))}
        </section>
      </main>
    </AvosShell>
  );
}