import axios from "axios";
import config from "./config";
import {
  profileStore
} from "../store/profileStore";

export const request = (url = "", method = "", data = {}, option = {}) => {
  let access_token = profileStore.getState().access_token;

  let headers = {
    "Content-Type": "application/json",
  };

  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  return axios({
      url: config.base_url + url,
      method: method,
      data: data,
      responseType: option.responseType || "json",
      headers: {
        ...headers,
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch(async (error) => {
      console.log("API ERROR =>", error);

      const response = error.response;

      if (response) {
        let data = response.data;

        if (data instanceof Blob) {
          const text = await data.text();

          try {
            data = JSON.parse(text);
          } catch (e) {
            data = {
              message: text || "Unknown Error",
            };
          }
        }

        const status = response.status;

        let errors = {
          message: data?.message,
        };

        // validation error
        if (data.errors) {
          Object.keys(data.errors).map((key) => {
            errors[key] = {
              validateStatus: "error",
              help: data.errors[key][0],
              hasFeedback: true,
            };
          });
        }

        // server error
        if (status == 500) {
          errors.message =
            data?.message ||
            "500 : មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ";

          return {
            error: true,
            status: status,
            errors: errors,
          };
        }

        return {
          error: true,
          status: status,
          errors: errors,
        };
      }

      return {
        error: true,
        errors: {
          message: "501 : មិនអាចតភ្ជាប់ Server បានទេ!",
        },
      };
    });
};