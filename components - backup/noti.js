import {  notification } from 'antd';
export const noti = (type = "",msg ="",dsc = "") => {
    notification[type]({
      message: msg,
      description: dsc,
    });
  };