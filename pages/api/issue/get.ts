// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const issues = await prisma.issue.findMany({
      where: { status: "approved" },
    });
    res.status(200).json(issues);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
