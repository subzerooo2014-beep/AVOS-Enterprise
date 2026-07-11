const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const dealers = [{"email":"dealer-dubai@avos.local","name":"AVOS Dubai Motors","code":"AVOS-DXB-001","phone":"+971500000101","address":"Dubai, UAE","status":"ACTIVE"},{"email":"dealer-abudhabi@avos.local","name":"AVOS Abu Dhabi Auto","code":"AVOS-AUH-001","phone":"+971500000102","address":"Abu Dhabi, UAE","status":"ACTIVE"},{"email":"dealer-sharjah@avos.local","name":"AVOS Sharjah Cars","code":"AVOS-SHJ-001","phone":"+971500000103","address":"Sharjah, UAE","status":"ACTIVE"}];

async function main() {
  const results = [];

  for (const dealer of dealers) {
    const saved = await prisma.dealer.upsert({
      where: {
        code: dealer.code,
      },
      update: {
        name: dealer.name,
        status: dealer.status,
        address: dealer.address,
        email: dealer.email,
        phone: dealer.phone,
      },
      create: dealer,
    });

    results.push(saved);
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        count: results.length,
        dealers: results,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
