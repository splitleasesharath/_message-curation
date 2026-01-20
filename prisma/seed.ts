import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Split Bot user
  const splitBotUser = await prisma.user.upsert({
    where: { email: 'splitbot@splitlease.com' },
    update: {},
    create: {
      email: 'splitbot@splitlease.com',
      firstName: 'Split',
      lastName: 'Bot',
      isSplitBot: true,
      role: 'ADMIN',
    },
  });
  console.log('Created Split Bot user:', splitBotUser.id);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@splitlease.com' },
    update: {},
    create: {
      email: 'admin@splitlease.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', adminUser.id);

  // Create support staff user
  const supportUser = await prisma.user.upsert({
    where: { email: 'support@splitlease.com' },
    update: {},
    create: {
      email: 'support@splitlease.com',
      firstName: 'Support',
      lastName: 'Staff',
      role: 'SUPPORT_STAFF',
    },
  });
  console.log('Created support user:', supportUser.id);

  // Create Split Bot templates
  const templates = [
    {
      name: 'redacted_contact_info',
      description: 'Template for when contact info is redacted',
      template:
        "We noticed your message contained contact information. For your safety and security, we've removed it. Please use Split Lease messaging for all communications.",
      category: 'REDACTED_CONTACT_INFO' as const,
    },
    {
      name: 'limit_messages',
      description: 'Template for limiting message frequency',
      template:
        'We noticed a high volume of messages in this conversation. Please consolidate your messages to help keep the conversation organized.',
      category: 'LIMIT_MESSAGES' as const,
    },
    {
      name: 'lease_documents_signed',
      description: 'Template for lease documents signed notification',
      template:
        'Great news! Your lease documents have been signed and processed. You can now proceed with your move-in arrangements.',
      category: 'LEASE_DOCUMENTS_SIGNED' as const,
    },
  ];

  for (const template of templates) {
    const created = await prisma.splitBotTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
    console.log('Created template:', created.name);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
