import { PrismaClient, RoleType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles: RoleType[] = ["ADMIN", "MEMBER", "OWNER", "USER"];

  for (const role of roles) {
    const roleExist = await prisma.role.findFirst({
      where: {
        role: role,
      },
    });

    await prisma.role.upsert({
      where: {
        id: roleExist?.id ?? "",
      },
      create: {
        role: role,
      },
      update: {},
    });
  }

  console.log("Success Seeding Role");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
