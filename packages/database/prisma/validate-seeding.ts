/**
 * Validation script to verify database seeding was successful
 * Run with: npx ts-node prisma/validate-seeding.ts
 */
import * as path from "path";
import * as fs from "fs";

// Load environment variables
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

// Reuse the already-generated Prisma client from this package.
// (This repo generates Prisma into `generated/client`, so `@prisma/client` may not have `.prisma/` types.)
import { prisma } from "@pk/database";

async function validateSeeding() {
  console.log("🔍 Validating database seeding...\n");

  let allValid = true;
  const results: { table: string; count: number; status: string }[] = [];

  try {
    // Validate HOA Financial Records with new fields
    console.log("📊 Validating HOA Financial Records...");
    const financialRecords = await prisma.hOAFinancialRecord.findMany({
      select: {
        id: true,
        recordType: true,
        documentUrl: true,
        effectiveDate: true,
        description: true,
      },
    });
    results.push({
      table: "hOAFinancialRecord",
      count: financialRecords.length,
      status: financialRecords.length > 0 ? "✅" : "❌",
    });
    console.log(`   Found ${financialRecords.length} financial records`);
    
    // Check for document URLs
    // `financialRecords` may come back untyped depending on how the Prisma client is generated/imported,
    // so we explicitly type the callback arg to avoid `noImplicitAny` failures during build.
    const hasDocumentUrls = financialRecords.some(
      (r: { documentUrl: any }) => r.documentUrl !== null
    );
    if (hasDocumentUrls) {
      console.log("   ✅ Document URLs are present");
    } else {
      console.log("   ⚠️  Some records may be missing document URLs");
    }

    // Validate HOA Invoices
    console.log("\n📊 Validating HOA Invoices...");
    const invoices = await prisma.hOAInvoice.findMany({
      select: {
        id: true,
        hoaId: true,
        invoiceNumber: true,
        invoiceDate: true,
        invoiceAmount: true,
        unpaidInvoiceAmount: true,
        costPaid: true,
        vendorName: true,
        vendorBusinessId: true,
        serviceType: true,
        authorizingBoardMemberId: true,
        authorizingManagementCompanyId: true,
        financialRecordId: true,
      },
    });
    results.push({
      table: "hOAInvoice",
      count: invoices.length,
      status: invoices.length > 0 ? "✅" : "❌",
    });
    console.log(`   Found ${invoices.length} invoice records`);
    
    // Check for invoice fields
    const hasInvoiceFields = invoices.some(
      (i: { invoiceAmount: any; vendorName: any; invoiceNumber: any }) =>
        i.invoiceAmount !== null ||
        i.vendorName !== null ||
        i.invoiceNumber !== null
    );
    if (hasInvoiceFields) {
      console.log("   ✅ Invoice fields (invoiceAmount, vendorName, invoiceNumber, etc.) are present");
    } else {
      console.log("   ⚠️  Invoice fields may not be populated");
    }

    // Validate HOA Management Company
    console.log("\n📊 Validating HOA Management Company...");
    const managementCompanies = await prisma.hOAManagementCompany.findMany({
      select: {
        id: true,
        hoaId: true,
        managementCompanyId: true,
        contractStartDate: true,
        contractEndDate: true,
        isActive: true,
        contractAmount: true,
        contractType: true,
      },
    });
    results.push({
      table: "hOAManagementCompany",
      count: managementCompanies.length,
      status: managementCompanies.length > 0 ? "✅" : "❌",
    });
    console.log(`   Found ${managementCompanies.length} management company records`);

    // Validate key relationships
    console.log("\n🔗 Validating relationships...");
    const hoaWithManagement = await prisma.homeOwnerAssociation.findMany({
      include: {
        managementCompanies: true,
        financialRecords: true,
        invoices: true,
      },
    });
    console.log(`   HOAs with management companies: ${hoaWithManagement.filter((h: { managementCompanies: any[] }) => h.managementCompanies.length > 0).length}`);
    console.log(`   HOAs with financial records: ${hoaWithManagement.filter((h: { financialRecords: any[] }) => h.financialRecords.length > 0).length}`);
    console.log(`   HOAs with invoices: ${hoaWithManagement.filter((h: { invoices: any[] }) => h.invoices.length > 0).length}`);
    
    // Validate that invoices have exactly one authorizer
    const invoicesWithAuthorizers = hoaWithManagement.flatMap(
      (h: { invoices: any[] }) => h.invoices
    );
    const invoicesWithBothAuthorizers = invoicesWithAuthorizers.filter(
      (i: { authorizingBoardMemberId: any; authorizingManagementCompanyId: any }) =>
        i.authorizingBoardMemberId !== null && i.authorizingManagementCompanyId !== null
    );
    const invoicesWithNoAuthorizers = invoicesWithAuthorizers.filter(
      (i: { authorizingBoardMemberId: any; authorizingManagementCompanyId: any }) =>
        i.authorizingBoardMemberId === null && i.authorizingManagementCompanyId === null
    );
    const invoicesWithOneAuthorizer = invoicesWithAuthorizers.filter(
      (i: { authorizingBoardMemberId: any; authorizingManagementCompanyId: any }) =>
        (i.authorizingBoardMemberId !== null && i.authorizingManagementCompanyId === null) ||
        (i.authorizingBoardMemberId === null && i.authorizingManagementCompanyId !== null)
    );
    
    if (invoicesWithBothAuthorizers.length > 0) {
      console.log(`   ⚠️  ${invoicesWithBothAuthorizers.length} invoice(s) have BOTH authorizers set (should have exactly one)`);
    }
    if (invoicesWithNoAuthorizers.length > 0) {
      console.log(`   ⚠️  ${invoicesWithNoAuthorizers.length} invoice(s) have NO authorizer set (should have exactly one)`);
    }
    if (invoicesWithOneAuthorizer.length === invoicesWithAuthorizers.length && invoicesWithAuthorizers.length > 0) {
      console.log(`   ✅ All ${invoicesWithOneAuthorizer.length} invoice(s) have exactly one authorizer set`);
    }

    // Validate Business relationships
    const businessesAsVendors = await prisma.business.findMany({
      include: {
        hoaInvoicesAsVendor: true,
        hoaManagementCompanies: true,
      },
    });
    const vendorsWithInvoices = businessesAsVendors.filter(
      (b: { hoaInvoicesAsVendor: any[] }) => b.hoaInvoicesAsVendor.length > 0
    );
    const businessesAsMgmt = businessesAsVendors.filter(
      (b: { hoaManagementCompanies: any[] }) => b.hoaManagementCompanies.length > 0
    );
    console.log(`   Businesses as vendors (invoices): ${vendorsWithInvoices.length}`);
    console.log(`   Businesses as management companies: ${businessesAsMgmt.length}`);

    // Summary
    console.log("\n📋 Validation Summary:");
    console.log("=" .repeat(50));
    results.forEach((r) => {
      console.log(`${r.status} ${r.table}: ${r.count} records`);
      if (r.count === 0) allValid = false;
    });

    if (allValid) {
      console.log("\n✅ All validations passed!");
    } else {
      console.log("\n❌ Some validations failed!");
    }
  } catch (error) {
    console.error("❌ Validation error:", error);
    allValid = false;
  } finally {
    await prisma.$disconnect();
  }

  process.exit(allValid ? 0 : 1);
}

validateSeeding();

