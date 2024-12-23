import { request } from '@@/exports';
import {DeleteFileParams, ProjectCreate, ProjectFileParams, ProjectUpdate} from '@/types/model';
import {ResponseStructure} from "@/utils/http-handle";

export async function getProjectList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/projects', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function createProject(params: ProjectCreate, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/create-project', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

export async function updateProject(id: number, params: ProjectUpdate, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/update-project/${id}`, {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

export async function deleteProject(id: number, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/delete-project/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function generateProjectDirs(id: number, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/generate-project-dirs/${id}`, {
    method: 'POST',
    ...(options || {}),
  });
}

export async function getProjectFilesList(params: ProjectFileParams) {
  return request<ResponseStructure>('/api/backend/v1/project-files-grouped-list', {
    method: 'GET',
    params: params,
  });
}

export async function deleteProjectFile(params: DeleteFileParams): Promise<ResponseStructure> {
  return request<ResponseStructure>('/api/backend/v1/project-files', {
    method: 'DELETE',
    data: params,
  });
}


export async function createProjectFile(params: API.CreateFileParams): Promise<ResponseStructure> {
  return request<ResponseStructure>('/api/backend/v1/project-files', {
    method: 'POST',
    data: params,
  });
}

export async function getAllCategories(): Promise<ResponseStructure> {
  return request<ResponseStructure>('/api/backend/v1/all-categories');
}

export async function getAllProjects(categoryId?: number): Promise<ResponseStructure> {
  return request<ResponseStructure>('/api/backend/v1/all-projects', {
    params: categoryId ? { category: categoryId } : {}
  });
}

export async function getAllProjectDirs(projectId?: number): Promise<ResponseStructure> {
  return request<ResponseStructure>('/api/backend/v1/all-project-dirs', {
    params: projectId ? { project: projectId } : {}
  });
}

export async function getProjectFilesSuffixByCategory(categoryId: number): Promise<ResponseStructure> {
  return request<ResponseStructure>(`/api/backend/v1/project-files-suffix-by-category/${categoryId}`);
}

export async function getFileContent(dirId: string | number, fileName: string = ''): Promise<ResponseStructure> {
  const url = '' !== fileName
    ? `/api/backend/v1/project-file-content/${dirId}/${fileName}`
    : `/api/backend/v1/project-file-content/${dirId}`;

  return request<ResponseStructure>(url, {
    method: 'GET',
  });
}


export async function getProjectFiles(dirId: string | number): Promise<ResponseStructure> {
  return request<ResponseStructure>(`/api/backend/v1/project-dir-files/${dirId}`, {
    method: 'GET',
  });
}

export async function getProjectFileVersions(projectDirId: number, fileName: string): Promise<ResponseStructure> {
  return request<ResponseStructure>(`/api/backend/v1/project-dir-files-versions/${projectDirId}/${fileName}`, {
    method: 'GET',
  });
}

export async function getProjectFileVersionContent(id: number): Promise<ResponseStructure> {
  return request<ResponseStructure>(`/api/backend/v1/project-dir-file-version/${id}`, {
    method: 'GET',
  });
}

export async function applyProjectFileVersion(id: number): Promise<ResponseStructure> {
  return request<ResponseStructure>(`/api/backend/v1/project-dir-file-apply-version/${id}`, {
    method: 'PUT',
  });
}
