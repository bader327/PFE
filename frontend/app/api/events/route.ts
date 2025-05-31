import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, title, description, date } = req.body;

  switch (req.method) {
    case "GET":
      const events = await prisma.event.findMany();
      return res.status(200).json(events);

    case "POST":
      const newEvent = await prisma.event.create({
        data: { title, description, date: new Date(date) },
      });
      return res.status(201).json(newEvent);

    case "PUT":
      if (!id) return res.status(400).json({ error: "ID requis" });
      const updatedEvent = await prisma.event.update({
        where: { id: Number(id) },
        data: { title, description, date: new Date(date) },
      });
      return res.status(200).json(updatedEvent);

    case "DELETE":
      if (!id) return res.status(400).json({ error: "ID requis" });
      await prisma.event.delete({ where: { id: Number(id) } });
      return res.status(204).end();

    default:
      return res.status(405).end();
  }
}
