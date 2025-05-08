import { UserType } from '@/configs/types/user';
import { db } from '@/db';

export const findUserRoles = async (user: UserType) => {
  const roles = await db.userRole.findMany({
    where: {
      userId: user.id,
    },
    include: {
      role: true,
    },
  });
  return roles.map((role) => role.role.name);
};
