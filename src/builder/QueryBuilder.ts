/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from "mongoose";

const OP_MAP = {
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  ne: "$ne",
  in: "$in",
  nin: "$nin",
} as const;

type OpKey = keyof typeof OP_MAP;

function coerce(val: unknown): unknown {
  if (Array.isArray(val)) return val.map(coerce);
  if (typeof val !== "string") return val;

  const asNum = Number(val);
  if (!isNaN(asNum) && val.trim() !== "") return asNum;
  if (val === "true") return true;
  if (val === "false") return false;
  return val;
}

function convertBracketOps(obj: any): any {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const inner: any = {};
        for (const [op, raw] of Object.entries(v)) {
          const mapped = OP_MAP[op as OpKey];
          if (mapped) {
            if ((op === "in" || op === "nin") && typeof raw === "string") {
              inner[mapped] = raw.split(",").map((s) => coerce(s.trim()));
            } else {
              inner[mapped] = coerce(raw);
            }
          } else {
            inner[op] = convertBracketOps(raw);
          }
        }
        out[k] = inner;
      } else {
        out[k] = coerce(v);
      }
    }
    return out;
  }
  return obj;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  private totalCount = 0;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  async getTotalCount(): Promise<number> {
    if (this.totalCount === 0) {
      const countQuery = this.modelQuery.model.find(
        this.modelQuery.getFilter()
      );
      this.totalCount = await countQuery.countDocuments();
    }
    return this.totalCount;
  }

  search(searchableFields: string[]) {

    const raw = (this?.query?.search as string | undefined)?.trim();
    if (!raw) return this;

    const regex = escapeRegExp(raw);
    const orClauses: FilterQuery<T>[] = searchableFields.map(
      (field) =>
        ({ [field]: { $regex: regex, $options: "i" } } as FilterQuery<T>)
    );

    this.modelQuery = this.modelQuery.find({ $or: orClauses });
    return this;
  }

  filter() {
    const queryObject = { ...this.query };
    console.log("queryObject:", queryObject);

    const excludesFields = [
      "search",
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
    ];
    excludesFields.forEach((el) => delete (queryObject as any)[el]);
    const mongoFilter = convertBracketOps(queryObject);
    const numericFilter = { ...mongoFilter };

   // Filter by date here
   

    if (mongoFilter.roi !== undefined) {
      numericFilter.roi = { $lte: mongoFilter.roi };
    }

    if (mongoFilter.duration !== undefined) {
      numericFilter.duration = { $lte: mongoFilter.duration };
    }

    if (mongoFilter.crop_types) {
      let crops: string[] = [];
      if (typeof mongoFilter.crop_types === "string") {
        crops = mongoFilter.crop_types.split(",").map((c: any) => c.trim());
      } else if (Array.isArray(mongoFilter.crop_types)) {
        crops = mongoFilter.crop_types;
      }
      numericFilter.crop_types = { $in: crops };
    }
    this.modelQuery = this.modelQuery.find(numericFilter);
    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  async paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    await this.getTotalCount();
    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async getMeta() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const total = await this.getTotalCount();
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
export default QueryBuilder;
