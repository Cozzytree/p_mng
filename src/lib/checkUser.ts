import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const loggedUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedUser) return loggedUser;

    const username = user.firstName + " " + user.lastName;

    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: username,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      },
    });
    return newUser;
  } catch (err) {
    return err;
  }
};
