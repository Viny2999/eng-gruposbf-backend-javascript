import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export class AxiosService {

  public getInstance = (): AxiosInstance => {
    const axiosInstance = axios.create({
      baseURL: process.env.BASE_URL
    });
    return axiosInstance;
  }
}
