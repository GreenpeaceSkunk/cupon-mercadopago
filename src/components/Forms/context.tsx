import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { ContextActionType, FormSharedType, ProvinceType, initialState, reducer } from './reducer';
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
      if(appData.settings.general.form_fields.registration.location.country.show) {
        dispatch({
          type: 'SET_FORM_FIELDS_SETTINGS',
          payload: {
            countries: (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries`)).json()),
          },
        });
      }
    })()
  }, [appData]);

  useEffect(() => {
    if(data.user.province) {
      dispatch({
        type: 'SET_FORM_FIELDS_SETTINGS',
        payload: {
          cities: shared.provinces?.filter((province: ProvinceType) => data.user.province === province.name)[0].cities,
        },
      });
    }
  }, [ data.user.province ])

  useEffect(() => {
    (async () => {
      if(data.user.country && appData.settings.general.form_fields.registration.location.province.show) {
        const provinces = (await (await fetch(`${process.env.REACT_APP_GREENLAB_API_URL}/location/world/countries/${data.user.country}`)).json());
        dispatch({
          type: 'SET_FORM_FIELDS_SETTINGS',
          payload: {
            provinces: (typeof provinces === 'object' && Object.keys(provinces).length === 0) ? [] : provinces,
            cities: [],
          },
        });
      }
    })();
  }, [appData, data.user.country]);

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
