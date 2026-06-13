import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up
  await prisma.finding.deleteMany()
  await prisma.pullRequest.deleteMany()
  await prisma.repository.deleteMany()
  await prisma.setting.deleteMany()

  // Seed Repositories
  await prisma.repository.create({
    data: { name: "acme-corp/frontend", status: "Connected", analyzedPrs: 0, lastSync: "10 mins ago" }
  })
  await prisma.repository.create({
    data: { name: "acme-corp/backend", status: "Connected", analyzedPrs: 0, lastSync: "1 hour ago" }
  })
  await prisma.repository.create({
    data: { name: "acme-corp/infrastructure", status: "Action Required", analyzedPrs: 0, lastSync: "2 days ago", error: "Missing permissions" }
  })

  // Seed Default Settings
  await prisma.setting.createMany({
    data: [
      { key: "checkHardcodedSecrets", value: "true" },
      { key: "checkOwasp", value: "true" },
      { key: "checkDependencies", value: "false" },
      { key: "sensitivityThreshold", value: "70" },
      { key: "systemPrompt", value: "You are an expert Senior Staff Engineer reviewing code.\\nAlways prioritize security over performance.\\nIf you see raw SQL queries, immediately flag them as high risk.\\nFor React components, ensure memoization is used only when strictly necessary." }
    ]
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
