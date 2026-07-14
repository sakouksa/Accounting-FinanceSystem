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
  const {
    permissions
  } = profileStore.getState();

  if (permissions && permissions.length > 0) {
    // 1. Clean dot notation to database underscore notation (e.g. branches.create -> branches_create)
    let cleanCode = permission_code.replace(/\./g, '_').toLowerCase();
    
    // 2. Map standard actions
    cleanCode = cleanCode.replace('_read', '_view');
    cleanCode = cleanCode.replace('_edit', '_update');

    return permissions.some((item) => {
      if (!item) return false;
      const itemCode = (item.code || '').toLowerCase();
      const itemRoute = (item.route_key || '').toLowerCase();

      return itemCode === cleanCode || itemCode === permission_code.toLowerCase() || itemRoute === permission_code.toLowerCase();
    });
  }
  return false;
};