import catchAsync from "../../utils/catchAsync";
import { UserService } from "./service";
import apiResponse from "../../utils/apiResponse";

const create = catchAsync(async (req, res) => {
  const userData = req.body;
  const data = await UserService.create(userData);
  apiResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data,
  });
});

const getAll = catchAsync(async (req, res) => {
  const data = await UserService.getAll();
  apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await UserService.getById(id);
  apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data,
  });
});

export const UserController = {
  create,
  getAll,
  getById,
};
