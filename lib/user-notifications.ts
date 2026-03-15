import { prisma } from "./prisma";

export async function createUserNotification(data: {
  userId: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  link?: string;
}): Promise<void> {
  try {
    await prisma.userNotification.create({
      data: {
        userId: data.userId,
        tipo: data.tipo,
        titulo: data.titulo,
        mensagem: data.mensagem,
        link: data.link || null,
      },
    });
  } catch {
    console.error("[user-notifications] Failed to create:", data);
  }
}

export async function createUserNotificationBulk(
  userIds: string[],
  data: { tipo: string; titulo: string; mensagem: string; link?: string }
): Promise<void> {
  try {
    await prisma.userNotification.createMany({
      data: userIds.map((userId) => ({
        userId,
        tipo: data.tipo,
        titulo: data.titulo,
        mensagem: data.mensagem,
        link: data.link || null,
      })),
    });
  } catch {
    console.error("[user-notifications] Bulk create failed:", data);
  }
}
