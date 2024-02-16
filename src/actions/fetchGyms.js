import React from "react";
import axios from "axios";
import {GET_GYMS} from "./types";
import {RONIN_API_BASE_URL} from "../config/api-config";
import {roninApiEndpoints} from "../config/default";

export const fetchGyms = () => async (dispatch) => {
    await axios
      .get(RONIN_API_BASE_URL + roninApiEndpoints.fetchGyms)
      .then(response => {
        dispatch({ type: GET_GYMS, payload: response.data });
      })
      .catch(error => {
        console.log(error);
        dispatch({type: GET_GYMS, payload: []})
      });
}