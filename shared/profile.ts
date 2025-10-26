import { z } from "zod";

export const FarmSchema = z.object({
  name: z.string().min(1),
  area: z.number().nonnegative(),
  crop: z.string().min(1),
  soilType: z.string().min(1),
  irrigationType: z.string().min(1),
});

export type Farm = z.infer<typeof FarmSchema>;

export const ProfileInfoSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  fpoCode: z.string().min(1),
  village: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
});

export type ProfileInfo = z.infer<typeof ProfileInfoSchema>;

export const DocumentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  number: z.string().min(1),
  notes: z.string().nullish(),
  uploadedAt: z.string().min(1),
});

export type ProfileDocumentEntry = z.infer<typeof DocumentSchema>;

export const BankAccountSchema = z.object({
  accountName: z.string().min(1),
  accountNumber: z.string().min(1),
  ifsc: z.string().min(1),
  branch: z.string().optional(),
  upi: z.string().optional(),
  linkedAt: z.string().min(1),
});

export type BankAccount = z.infer<typeof BankAccountSchema>;

export const SupportRequestSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  message: z.string().min(1),
  createdAt: z.string().min(1),
  status: z.enum(["open", "in-progress", "resolved"]),
});

export type SupportRequest = z.infer<typeof SupportRequestSchema>;

export const ProfileDocumentSchema = z.object({
  profile: ProfileInfoSchema,
  focusAreas: z.array(z.string()),
  farms: z.array(FarmSchema),
  documents: z.array(DocumentSchema).default([]),
  bankAccount: BankAccountSchema.nullable().optional(),
  supportRequests: z.array(SupportRequestSchema).default([]),
  lastUpdated: z.string().optional(),
});

export type ProfileDocument = z.infer<typeof ProfileDocumentSchema>;

export const defaultProfileDocument: ProfileDocument = {
  profile: {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    fpoCode: "FPO-KA-2024-123",
    village: "Kalaburagi",
    district: "Kalaburagi",
    state: "Karnataka",
    pincode: "585101",
  },
  focusAreas: ["Sustainable irrigation", "Soil stewardship", "Market readiness"],
  farms: [
    {
      name: "Farm Plot 1",
      area: 5,
      crop: "Mustard",
      soilType: "Red soil",
      irrigationType: "Drip",
    },
    {
      name: "Farm Plot 2",
      area: 3,
      crop: "Sunflower",
      soilType: "Black soil",
      irrigationType: "Sprinkler",
    },
  ],
  documents: [],
  bankAccount: null,
  supportRequests: [],
  lastUpdated: new Date().toISOString(),
};

export const safeParseProfile = (raw: unknown): ProfileDocument => {
  const result = ProfileDocumentSchema.safeParse(raw);
  if (!result.success) {
    return defaultProfileDocument;
  }

  return {
    ...result.data,
    documents: result.data.documents ?? [],
    supportRequests: result.data.supportRequests ?? [],
    lastUpdated: result.data.lastUpdated ?? new Date().toISOString(),
  };
};
