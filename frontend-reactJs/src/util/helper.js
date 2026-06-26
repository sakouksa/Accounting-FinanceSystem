import dayjs from "dayjs";
import "dayjs/locale/km";
import {
  profileStore
} from "../store/profileStore";
// set local to Khmer
dayjs.locale("km");
export const dateClient = (date) => {
  if (date) {
    return dayjs(date).locale("km").format("DD MMMM YYYY, [ម៉ោង] HH:mm");
  }
  return null;
};
// for send to Database server (YYYY-MM-DD)
export const dateServer = (date) => {
  if (date) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return null;
};
// For converting values from Database to DatePicker (AntD)
export const formatToPicker = (date) => {
  return date ? dayjs(date) : null;
};
/**
 * function check permission (Action Permission)
 * @param {string} permission_code - ឧទាហរណ៍៖ 'branches.create', 'users.edit'
 * @returns {boolean} - true មានសិទ្ធិ, false អត់សិទ្ធិ
 */
export const isPermissionAction = (permission_code) => {
  // ១. កែឈ្មោះទៅជា permissions (មាន s) ឱ្យត្រូវតាម Zustand Store
  const {
    permissions
  } = profileStore.getState();

  if (permissions && permissions.length > 0) {
    return permissions.some((item) => {
      // ២. ទាញយក Key ពី DB មកផ្ទៀងផ្ទាត់ (ទោះជា API បោះមកជា key មួយណា ក៏មិនចោទជាបញ្ហា)
      const dbRoute = item.route_key || item.web_route_key || item.code || item.name || (typeof item === 'string' ? item : '');
      return dbRoute === permission_code;
    });
  }
  return false;
};