const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const dealers = await prisma.dealer.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(
    JSON.stringify(
      {
        success: true,
        count: dealers.length,
        dealers,
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
