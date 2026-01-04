// const APP_BACKEND_API = process.env.EXPO_PUBLIC_API_URL;

const APP_BACKEND_API = 'https://3bbf-2409-40d0-f8-123a-b87b-a585-5c6f-34d1.ngrok-free.app';
const DRIVER_API_URL = APP_BACKEND_API + "/api/driver";
const USER_API_URL = APP_BACKEND_API + "/api/user";
const ORDER_API_URL = APP_BACKEND_API + "/api/orders";

export const Key = {
    APP_BACKEND_API,
    DRIVER_API_URL,
    ORDER_API_URL,
    USER_API_URL,
    mapApiKey: '',
    unsplashApiKey: "",
};

export default Key;
