import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface WaitlistEntry {
  name: string;
  email: string;
  createdAt: string;
}

const WAITLIST_FILE = path.join(process.cwd(), "data", "waitlist.json");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureWaitlistFile() {
  await fs.mkdir(path.dirname(WAITLIST_FILE), { recursive: true });

  try {
    await fs.access(WAITLIST_FILE);
  } catch {
    await fs.writeFile(WAITLIST_FILE, "[]", "utf8");
  }
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  await ensureWaitlistFile();

  try {
    const raw = await fs.readFile(WAITLIST_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const emailInput = typeof body?.email === "string" ? body.email.trim() : "";
    const email = emailInput.toLowerCase();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const waitlist = await readWaitlist();
    const alreadyExists = waitlist.some((entry) => entry.email === email);

    if (alreadyExists) {
      return NextResponse.json(
        { success: false, message: "This email is already on the waitlist" },
        { status: 409 },
      );
    }

    const nextEntry: WaitlistEntry = {
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    waitlist.push(nextEntry);

    await ensureWaitlistFile();
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(waitlist, null, 2), "utf8");

    return NextResponse.json(
      { success: true, message: "Joined waitlist successfully", data: nextEntry },
      { status: 201 },
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
