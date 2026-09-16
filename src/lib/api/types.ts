export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface BackendErrorResponse {
  success: false;
  status: number;
  code: string;
  message: string;
  data?: unknown;
}
