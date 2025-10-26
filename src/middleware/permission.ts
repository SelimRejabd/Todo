import type { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "@casl/ability";
import { Action } from "../authz/actions";
import type { AppAbility, SubjectInput } from "../authz/ability";

export function requirePermission(
  action: Action,
  subjectOrFn: SubjectInput | ((req: Request) => SubjectInput)
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const ability = req.ability as AppAbility;
    const subject =
      typeof subjectOrFn === "function" ? subjectOrFn(req) : subjectOrFn;

    try {
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
      next();
    } catch (err) {
      next(err);
    }
  };
}
