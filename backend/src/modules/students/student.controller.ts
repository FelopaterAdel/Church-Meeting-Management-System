import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as studentService from './student.service.js';
import type { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from './student.validation.js';

type StudentIdParams = {
  id: string;
};

const getStudentId = (req: Request): string => {
  return (req.params as StudentIdParams).id;
};

export const listStudents = async (req: Request, res: Response): Promise<void> => {
  const result = await studentService.listStudents(req.query as unknown as ListStudentsQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Students retrieved successfully',
    data: {
      students: result.students
    },
    meta: {
      pagination: result.pagination
    }
  });
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  const student = await studentService.getStudentById(getStudentId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student retrieved successfully',
    data: { student }
  });
};

export const getStudentQrData = async (req: Request, res: Response): Promise<void> => {
  const qrData = await studentService.getStudentQrData(getStudentId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student QR data retrieved successfully',
    data: { qrData }
  });
};

export const getStudentQrImage = async (req: Request, res: Response): Promise<void> => {
  const { qrImage } = await studentService.getStudentQrImage(getStudentId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student QR image generated successfully',
    data: { qrImage }
  });
};

export const resolveStudentByQrCode = async (req: Request, res: Response): Promise<void> => {
  const qrData = await studentService.resolveStudentByQrCode(req.params.qrCode as string);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student QR code resolved successfully',
    data: { qrData }
  });
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  console.log('hi', req.body);
  const student = await studentService.createStudent(req.body as CreateStudentInput);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Student created successfully',
    data: { student }
  });
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const student = await studentService.updateStudent(getStudentId(req), req.body as UpdateStudentInput);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student updated successfully',
    data: { student }
  });
};

export const softDeleteStudent = async (req: Request, res: Response): Promise<void> => {
  await studentService.softDeleteStudent(getStudentId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student deleted successfully'
  });
};
