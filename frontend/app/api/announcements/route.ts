import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, title, content, date } = req.body;

  switch (req.method) {
    case "GET":
      const announcements = await prisma.announcement.findMany();
      return res.status(200).json(announcements);

    case "POST":
      const newAnnouncement = await prisma.announcement.create({
        data: {
          title,
          content,
          createdAt: new Date(date),
        },
      });
      return res.status(201).json(newAnnouncement);

    case "PUT":
      if (!id) return res.status(400).json({ error: "ID requis" });
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id: Number(id) },
        data: {
          title,
          content,
          createdAt: new Date(date),
        },
      });
      return res.status(200).json(updatedAnnouncement);

    case "DELETE":
      if (!id) return res.status(400).json({ error: "ID requis" });
      await prisma.announcement.delete({ where: { id: Number(id) } });
      return res.status(204).end();

    default:
      return res.status(405).end();
  }
}
