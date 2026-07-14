import { App } from 'antd';

let globalMessage;
let globalNotification;
let globalModal;

export const AntdGlobalRegister = () => {
  const app = App.useApp();
  globalMessage = app.message;
  globalNotification = app.notification;
  globalModal = app.modal;
  return null;
};

export const message = {
  success: (content, duration, onClose) => {
    if (globalMessage) {
      return globalMessage.success(content, duration, onClose);
    }
    console.log('Success:', content);
  },
  error: (content, duration, onClose) => {
    if (globalMessage) {
      return globalMessage.error(content, duration, onClose);
    }
    console.error('Error:', content);
  },
  warning: (content, duration, onClose) => {
    if (globalMessage) {
      return globalMessage.warning(content, duration, onClose);
    }
    console.warn('Warning:', content);
  },
  info: (content, duration, onClose) => {
    if (globalMessage) {
      return globalMessage.info(content, duration, onClose);
    }
    console.info('Info:', content);
  },
  loading: (content, duration, onClose) => {
    if (globalMessage) {
      return globalMessage.loading(content, duration, onClose);
    }
    return () => {};
  }
};

export const notification = {
  success: (config) => globalNotification && globalNotification.success(config),
  error: (config) => globalNotification && globalNotification.error(config),
  warning: (config) => globalNotification && globalNotification.warning(config),
  info: (config) => globalNotification && globalNotification.info(config),
  open: (config) => globalNotification && globalNotification.open(config)
};

export const modal = {
  confirm: (config) => globalModal && globalModal.confirm(config),
  info: (config) => globalModal && globalModal.info(config),
  success: (config) => globalModal && globalModal.success(config),
  error: (config) => globalModal && globalModal.error(config),
  warning: (config) => globalModal && globalModal.warning(config)
};
