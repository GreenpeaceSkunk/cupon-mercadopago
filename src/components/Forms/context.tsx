import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { ContextActionType, FormSharedType, initialState, reducer } from './reducer';
import { IData, ParamsType } from 'greenpeace';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App/context';

export interface IContext {
  data: IData;
  shared: FormSharedType;
  params: ParamsType;
  allowNext: boolean;
  submitted: boolean;
  submitting: boolean;
  error: string | null;
  dispatch: (action: ContextActionType) => void;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'FormContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [{ data, shared, allowNext, error, submitted, submitting }, dispatch] = useReducer(reducer, initialState);
  const {appData} = useContext(AppContext);
  const params = useParams<ParamsType>();

  useEffect(() => {
    (async () => {
      if(appData.settings.general.form_fields) {
        if(appData.settings.general.form_fields.location.country) {
          dispatch({
            type: 'SET_FORM_FIELDS_SETTINGS',
            payload: {
              countries: (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries`)).json()),
            },
          });
        }

        if(appData.settings.general.form_fields.location.province) {
          dispatch({
            type: 'SET_FORM_FIELDS_SETTINGS',
            payload: {
              provinces: (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries/${appData.settings.general.country.toLowerCase()}/places`)).json()).provinces,
            },
          });
        }

        if(appData.settings.general.form_fields.location.city) {
          dispatch({
            type: 'SET_FORM_FIELDS_SETTINGS',
            payload: {
              cities: (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries/${appData.settings.general.country.toLowerCase()}/places`)).json()).cities,
            },
          });
        }
      }
    })()
  }, [appData]);

  return useMemo(() => (
    <Provider
      value={{
        data,
        shared,
        params,
        allowNext,
        submitted,
        submitting,
        error,
        dispatch,
      }}>
        {children}
      </Provider>
  ), [
    appData,
    data,
    shared,
    params,
    allowNext,
    submitted,
    submitting,
    error,
    children,
    dispatch,
  ]);
};

export {
  ContextProvider as FormProvider,
  Consumer as FormConsumer,
  Context as FormContext,
}
