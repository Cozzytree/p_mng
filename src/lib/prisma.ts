import { PrismaClient } from "@prisma/client";

// Prisma client instance
let prisma: PrismaClient;

// Check if we are in development mode
if (process.env.NODE_ENV === "development") {
  // If global.prisma is not defined, create a new PrismaClient instance.
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient();
  }
  // Assign the global.prisma to the local prisma variable.
  prisma = (globalThis as any).prisma;
} else {
  // In production mode, create a new instance each time.
  prisma = new PrismaClient();
}

// Connect to the database
prisma.$connect().catch((err) => {
  console.error("Error connecting to database:", err);
});

// Export the Prisma client instance
export default prisma;
