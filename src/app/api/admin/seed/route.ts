import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import pool from "@src/lib/db";
import { requireAdmin } from "../_lib/requireAdmin";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const seedPath = path.join(process.cwd(), "src", "lib", "seed.sql");
    const sql = readFileSync(seedPath, "utf-8");

    const client = await pool.connect();
    try {
      await client.query(sql);
    } finally {
      client.release();
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        categories: "8 parent + 9 sub-categories inserted",
        products: "22 products inserted",
        images: "22 product images inserted",
        attributes: "product variants (storage, color, size) inserted",
      },
    });
  } catch (error: any) {
    console.error("Admin seed error:", error);
    return NextResponse.json({ message: "Seed failed", error: error.message }, { status: 500 });
  }
}
