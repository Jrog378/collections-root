import api from "./api";
// import type { User } from "../pages/archive/User";
import type { Donor, Artist, Artwork, Repository } from "./Utils";

export const healthCheck = async (): Promise<string> => {
  const response = await api.get('/healthcheck');
  return response.data;
};

// export const getUser = async (userId: string): Promise<User> => {
//   const response = await api.get(`/api/user/${userId}`);
//   return response.data;
// };

// export const getAllUsers = async (): Promise<User[]> => {
//   const response = await api.get('/api/users');
//   return response.data;
// };

// export const CreateUser = async (user: User): Promise<User[]> => {
//   const response = await api.post('/api/user', user);
//   return response.data;
// };

// export const UpdateUser = async (user: User, userId: string): Promise<User[]> => {
//   const response = await api.put(`/api/user/${userId}`, user);
//   return response.data;
// };

// export const DeleteUser = async (userId: string): Promise<User[]> => {
//   const response = await api.delete(`/api/user/${userId}`);
//   return response.data;
// };

export const getArtwork = async (artId: string): Promise<Artwork> => {
  const response = await api.get(`/api/artwork/${artId}`);
  return response.data;
};

export const getAllArtwork = async (): Promise<Artwork[]> => {
  const response = await api.get('/api/allartwork');
  return response.data;
};

export const CreateArtwork = async (artwork: Artwork): Promise<Artwork[]> => {
  const response = await api.post('/api/artwork', artwork);
  return response.data;
};

export const CreateChunkArtwork = async (csvFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', csvFile);

  const response = await api.post('/api/file-create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const UpdateArtwork = async (artwork: Artwork, artId: string): Promise<Artwork[]> => {
  const response = await api.put(`/api/artwork/${artId}`, artwork);
  return response.data;
};

export const DeleteArtwork = async (artId: string): Promise<Artwork[]> => {
  const response = await api.delete(`/api/artwork/${artId}`);
  return response.data;
};

export const getArtist = async (artId: string): Promise<Artist> => {
  const response = await api.get(`/api/artist/${artId}`);
  return response.data;
};

export const getAllArtist = async (): Promise<Artist[]> => {
  const response = await api.get('/api/allartist');
  return response.data;
};

export const CreateArtist = async (artist: Artist): Promise<Artist[]> => {
  const response = await api.post('/api/artist', artist);
  return response.data;
};

export const UpdateArtist = async (artist: Artist, artId: string): Promise<Artist[]> => {
  const response = await api.put(`/api/artist/${artId}`, artist);
  return response.data;
};

export const DeleteArtist = async (artId: string): Promise<Artist[]> => {
  const response = await api.delete(`/api/artist/${artId}`);
  return response.data;
};

export const getDonor = async (donorId: string): Promise<Donor> => {
  const response = await api.get(`/api/donor/${donorId}`);
  return response.data;
};

export const getAllDonor = async (): Promise<Donor[]> => {
  const response = await api.get('/api/alldonor');
  return response.data;
};

export const CreateDonor = async (donor: Donor): Promise<Donor[]> => {
  const response = await api.post('/api/donor', donor);
  return response.data;
};

export const UpdateDonor = async (donor: Donor, donorId: string): Promise<Donor[]> => {
  const response = await api.put(`/api/donor/${donorId}`, donor);
  return response.data;
};

export const DeleteDonor = async (donorId: string): Promise<Donor[]> => {
  const response = await api.delete(`/api/donor/${donorId}`);
  return response.data;
};

export const getLocation = async (repository: string): Promise<Repository> => {
  const response = await api.get(`/api/location/${repository}`);
  return response.data;
};

export const getAllLocation = async (): Promise<Repository[]> => {
  const response = await api.get('/api/alllocation');
  return response.data;
};

export const CreateLocation = async (repository: Repository): Promise<Repository[]> => {
  const response = await api.post('/api/location', repository);
  return response.data;
};

export const UpdateLocation = async (repository: Repository, repositoryId: string): Promise<Repository[]> => {
  const response = await api.put(`/api/location/${repositoryId}`, repository);
  return response.data;
};

export const DeleteLocation = async (repositoryId: string): Promise<Repository[]> => {
  const response = await api.delete(`/api/location/${repositoryId}`);
  return response.data;
};