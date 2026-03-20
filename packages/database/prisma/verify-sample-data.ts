/**
 * Quick verification script to check sample data
 */
import * as path from "path";
import * as fs from "fs";

const dotenvPathCandidates = [
  path.join(__dirname, "../../../server/.env"),
  path.join(__dirname, "../../../client/.env"),
  path.join(__dirname, "../../../.env"),
  path.join(__dirname, "../../.env"),
];
for (const p of dotenvPathCandidates) {
  if (fs.existsSync(p)) {
    require("dotenv").config({ path: p });
    break;
  }
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifySamples() {
  console.log("🔍 Verifying sample data...\n");

  try {
    // Sample HOA Financial Record (Independent Audit)
    console.log("📄 Sample Independent Audit Record:");
    const auditRecord = await prisma.hOAFinancialRecord.findFirst({
      where: { recordType: "independent_audit" },
      include: { hoa: { select: { name: true } } },
    });
    if (auditRecord) {
      console.log(`   HOA: ${auditRecord.hoa.name}`);
      console.log(`   Record Type: ${auditRecord.recordType}`);
      console.log(`   Vendor: ${auditRecord.vendorName}`);
      console.log(`   Cost: $${auditRecord.costPaid}`);
      console.log(`   Requested by Board: ${auditRecord.requestedByBoardDirectors}`);
      console.log(`   Requested by Management: ${auditRecord.requestedByManagementCompany}`);
      console.log(`   Document URL: ${auditRecord.documentUrl}`);
    }

    // Sample Invoice Record
    console.log("\n📄 Sample Invoice Record:");
    const invoiceRecord = await prisma.hOAFinancialRecord.findFirst({
      where: { recordType: "invoice" },
      include: { hoa: { select: { name: true } } },
    });
    if (invoiceRecord) {
      console.log(`   HOA: ${invoiceRecord.hoa.name}`);
      console.log(`   Record Type: ${invoiceRecord.recordType}`);
      console.log(`   Vendor: ${invoiceRecord.vendorName}`);
      console.log(`   Amount: $${invoiceRecord.amount}`);
      console.log(`   Invoice #: ${invoiceRecord.invoiceNumber}`);
      console.log(`   Service Type: ${invoiceRecord.serviceType}`);
      console.log(`   Paid Date: ${invoiceRecord.paidDate}`);
    }

    // Sample Management Company
    console.log("\n🏢 Sample Management Company Record:");
    const mgmtCompany = await prisma.hOAManagementCompany.findFirst({
      where: { isActive: true },
      include: {
        hoa: { select: { name: true } },
        managementCompany: { select: { name: true } },
      },
    });
    if (mgmtCompany) {
      console.log(`   HOA: ${mgmtCompany.hoa.name}`);
      console.log(`   Management Company: ${mgmtCompany.managementCompany.name}`);
      console.log(`   Contract Type: ${mgmtCompany.contractType}`);
      console.log(`   Contract Amount: $${mgmtCompany.contractAmount}/month`);
      console.log(`   Start Date: ${mgmtCompany.contractStartDate}`);
      console.log(`   Active: ${mgmtCompany.isActive}`);
    }

    console.log("\n✅ Sample data verification complete!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySamples();

