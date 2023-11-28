import { toast, ToastOptions } from 'react-toastify';

const commonConfig : ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light'
};

export function toggleToast(type: Number | string | null | undefined, message: string | null | undefined) {
  switch (type) {
    case 'pending':
      toast.loading(message, commonConfig);
      break;
    case 200:
    case 'success':
      toast.success(message + ' 👌', commonConfig);
      break;
    case 400:
    case 'rejected':
      toast.error(message + ' 🤯', commonConfig);
      break;
    default:
      break;
  }
}