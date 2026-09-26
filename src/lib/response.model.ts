export interface GenericResponse {
  message?: string;
  error?: string;
}

export interface GenericAPIResponse<T = any> extends GenericResponse {
  data?: T;
}

export interface AuthResponse<T = any> {
  token: string;
  member: T;
}

export interface PaginationResponse<T = any> extends GenericAPIResponse<T> {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}
