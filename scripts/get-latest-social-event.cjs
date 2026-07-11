const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.platformEvent.findFirst({
    where: {
      type: {
        in: [
          "InstagramVehiclePublicationRequested",
          "TikTokVehiclePublicationRequested",
          "GoogleSearchVehicleCampaignRequested",
        ],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!event) {
    throw new Error("No social PlatformEvent was found.");
  }

  console.log(JSON.stringify({
    id: event.id,
    type: event.type,
    status: event.status,
    entityId: event.entityId,
    createdAt: event.createdAt,
  }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
