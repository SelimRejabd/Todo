import type { Request, Response, NextFunction } from "express";
import { defineAbilityFor } from "../authz/ability";
import type { AppAbility } from "../authz/ability";
import { UserCtx } from "../modules/user";

export const attachAbility = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Define the ability based on the user context
  const userCtx: UserCtx = {
    id: req.user!.id,
    role: req.user!.role,
    level: req.user!.level || 0,
  };

  req.ability = defineAbilityFor(userCtx) as AppAbility;

  next();
};
