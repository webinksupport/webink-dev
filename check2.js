// Test Prisma connection in standalone mode
async function test() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("CWD:", process.cwd());
  console.log("Checking for generated client...");
  
  try {
    // Try to import the Prisma adapter + client
    const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
    console.log("PrismaMariaDb loaded OK");
    
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    console.log("Adapter created OK");
    
    // Try loading Prisma client from generated path
    let PrismaClient;
    try {
      PrismaClient = require("./src/generated/prisma/client").PrismaClient;
      console.log("PrismaClient loaded from src/generated");
    } catch (e) {
      console.log("Failed to load from src/generated:", e.message);
      try {
        PrismaClient = require("./.next/standalone/src/generated/prisma/client").PrismaClient;
        console.log("PrismaClient loaded from standalone");
      } catch (e2) {
        console.log("Failed to load from standalone:", e2.message);
      }
    }
    
    if (!PrismaClient) {
      console.error("Could not load PrismaClient");
      return;
    }
    
    const prisma = new PrismaClient({ adapter });
    console.log("PrismaClient created");
    
    const count = await prisma.product.count();
    console.log("Product count:", count);
    
    await prisma.$disconnect();
    console.log("Disconnected OK");
  } catch (e) {
    console.error("Error:", e.message);
    console.error("Stack:", e.stack);
  }
}

test();
