import apiResponse from "../../utils/apiResponse";
import catchAsync from "../../utils/catchAsync";
import { TodoService } from "./service";

const create = catchAsync(async (req, res) => {
  const data = await TodoService.create(req.body);

  apiResponse(res, {
    statusCode: 201,
    success: true,
    message: "Todo created successfully",
    data,
  });
});

const getAll = catchAsync(async (req, res) => {
  const data = await TodoService.getAll();

  apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "Todos retrieved successfully",
    data,
  });
});
const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await TodoService.getById(id);
  
  apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "Todo retrieved successfully",
    data,
  });
});
export const TodoController = {
  create,
  getAll,
  getById,
};
