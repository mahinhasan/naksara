const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Create Permissions
  const permissionsData = [
    { action: 'CREATE', subject: 'Product', description: 'Create products' },
    { action: 'READ', subject: 'Product', description: 'Read products' },
    { action: 'UPDATE', subject: 'Product', description: 'Update products' },
    { action: 'DELETE', subject: 'Product', description: 'Delete products' },
    { action: 'CREATE', subject: 'Order', description: 'Create orders' },
    { action: 'READ', subject: 'Order', description: 'Read orders' },
    { action: 'UPDATE', subject: 'Order', description: 'Update orders' },
    { action: 'DELETE', subject: 'Order', description: 'Delete orders' },
    { action: 'CREATE', subject: 'User', description: 'Create users' },
    { action: 'READ', subject: 'User', description: 'Read users' },
    { action: 'UPDATE', subject: 'User', description: 'Update users' },
    { action: 'DELETE', subject: 'User', description: 'Delete users' },
    { action: 'READ', subject: 'Analytics', description: 'Read analytics/dashboard stats' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { action_subject: { action: p.action, subject: p.subject } },
      update: {},
      create: p,
    });
    permissions.push(perm);
  }
  console.log(`Seeded ${permissions.length} permissions.`);

  // 2. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Super Administrator with full access',
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'EMPLOYEE' },
    update: {},
    create: {
      name: 'EMPLOYEE',
      description: 'Store manager/employee role',
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: {
      name: 'CUSTOMER',
      description: 'Default role for registered customers',
    },
  });

  console.log('Seeded roles.');

  // 3. Link permissions to ADMIN and EMPLOYEE
  // Clear old mappings
  await prisma.rolePermission.deleteMany({});

  // ADMIN gets all permissions
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // EMPLOYEE gets Product and Order CRUD (except delete)
  const employeePermissions = permissions.filter(p => 
    p.subject === 'Product' || 
    p.subject === 'Order' || 
    p.subject === 'Analytics'
  );

  for (const perm of employeePermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: employeeRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log('Linked permissions to roles.');

  // 4. Create default users
  const passwordHash = await bcrypt.hash('adminpassword', 10);
  await prisma.user.upsert({
    where: { email: 'admin@naksara.com' },
    update: {},
    create: {
      email: 'admin@naksara.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      roleId: adminRole.id,
      isActive: true,
    },
  });

  const employeePasswordHash = await bcrypt.hash('employeepassword', 10);
  await prisma.user.upsert({
    where: { email: 'employee@naksara.com' },
    update: {},
    create: {
      email: 'employee@naksara.com',
      passwordHash: employeePasswordHash,
      firstName: 'Store',
      lastName: 'Manager',
      roleId: employeeRole.id,
      isActive: true,
    },
  });
  console.log('Seeded admin and employee users.');

  // 5. Seed categories
  const categoriesData = [
    { name: 'Handicrafts', slug: 'handicrafts', description: 'Exquisite hand-carved crafts' },
    { name: 'Home Decor', slug: 'home-decor', description: 'Elevate your living space' },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Artisan accessories and daily essentials' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }
  console.log('Seeded categories.');

  // 6. Seed a few products
  const productsData = [
    {
      name: 'Premium Brass Candle Holder',
      slug: 'premium-brass-candle-holder',
      sku: 'SKU-BRASS-01',
      description: 'Handcrafted solid brass candle holder with an antique finish.',
      price: 49.99,
      stockQuantity: 15,
      categoryId: categories.find(c => c.slug === 'home-decor').id,
      images: ['https://images.unsplash.com/photo-154349762230-e0cadf78f5db?q=80&w=2070'],
    },
    {
      name: 'Handwoven Jute Storage Basket',
      slug: 'handwoven-jute-storage-basket',
      sku: 'SKU-JUTE-02',
      description: 'Natural jute basket handcrafted by local artisans.',
      price: 29.50,
      stockQuantity: 3, // Low stock alert trigger
      categoryId: categories.find(c => c.slug === 'handicrafts').id,
      images: ['https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=1974'],
    },
    {
      name: 'Organic Wool Throw Blanket',
      slug: 'organic-wool-throw-blanket',
      sku: 'SKU-WOOL-03',
      description: 'Super soft throw blanket made from 100% organic local wool.',
      price: 89.00,
      stockQuantity: 20,
      categoryId: categories.find(c => c.slug === 'lifestyle').id,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999'],
    },
  ];

  for (const prod of productsData) {
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          description: prod.description,
          price: prod.price,
          stockQuantity: prod.stockQuantity,
          categoryId: prod.categoryId,
          isActive: true,
          images: {
            create: prod.images.map(url => ({ url, isMain: true })),
          },
        },
      });
    }
  }
  console.log('Seeded products.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
