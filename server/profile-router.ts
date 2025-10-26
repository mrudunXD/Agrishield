import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { profileStates } from "@shared/schema";
import {
  ProfileDocument,
  ProfileDocumentSchema,
  defaultProfileDocument,
  safeParseProfile,
} from "@shared/profile";

const PROFILE_ROW_ID = "primary-profile";

const ensureDefaultProfile = () => {
  const existing = db
    .select()
    .from(profileStates)
    .where(eq(profileStates.id, PROFILE_ROW_ID))
    .get();

  if (existing) {
    return existing;
  }

  db.insert(profileStates)
    .values({
      id: PROFILE_ROW_ID,
      data: JSON.stringify(defaultProfileDocument),
      updatedAt: new Date(),
    })
    .run();

  return db
    .select()
    .from(profileStates)
    .where(eq(profileStates.id, PROFILE_ROW_ID))
    .get();
};

const parseRow = (row: { data: string } | undefined): ProfileDocument => {
  if (!row) {
    return defaultProfileDocument;
  }

  try {
    return safeParseProfile(row.data ?? "null");
  } catch (error) {
    console.error("Failed to parse profile row", error);
    return defaultProfileDocument;
  }
};

export const profileRouter = Router()
  .get("/", (_req, res) => {
    const row = ensureDefaultProfile();
    const profile = parseRow(row);
    res.json(profile);
  })
  .put("/", (req, res) => {
    const result = ProfileDocumentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid profile payload",
        issues: result.error.flatten(),
      });
    }

    const payload = {
      ...result.data,
      documents: result.data.documents ?? [],
      supportRequests: result.data.supportRequests ?? [],
      lastUpdated: new Date().toISOString(),
    } satisfies ProfileDocument;

    db.insert(profileStates)
      .values({
        id: PROFILE_ROW_ID,
        data: JSON.stringify(payload),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profileStates.id,
        set: {
          data: JSON.stringify(payload),
          updatedAt: new Date(),
        },
      })
      .run();

    res.json(payload);
  });
