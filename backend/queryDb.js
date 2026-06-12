const { prisma } = require('./src/lib/prisma');

async function main() {
  const subjects = await prisma.subject.findMany();
  console.log("=== SUBJECTS IN DATABASE ===");
  console.log(JSON.stringify(subjects, null, 2));

  const users = await prisma.user.findMany({
    where: { role: 'FACULTY' }
  });
  console.log("=== FACULTY IN DATABASE ===");
  console.log(JSON.stringify(users.map(u => ({ id: u.id, name: u.name, email: u.email })), null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
