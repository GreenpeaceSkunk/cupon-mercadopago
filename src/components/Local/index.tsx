import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { css } from 'styled-components';
import Elements from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';
import { AppContext } from '../App/context';
import { getLocal, syncLocal } from '../../services/greenlab';
import { Loader, Logo } from '../Shared';
import useQuery from '../../hooks/useQuery';
import { useLocation } from 'react-router-dom';

const Component: React.FunctionComponent<{}> = () => {
  const { appData } = useContext(AppContext);
  const {searchParams, urlSearchParams} = useQuery();
  const [localData, setLocalData] = useState<Array<any>>([]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [hunterId, setHunterId] = useState<number>(-1);
  const location = useLocation();

  const syncHandler = useCallback(async () => {
    console.log(urlSearchParams.toString())
    setFetching(true);
    setLocalData(
      (await syncLocal(
        appData.name,
        appData.country,
        urlSearchParams.toString(),
      ))
    );
    setFetching(false);
  }, [localData, hunterId, urlSearchParams]);

  useEffect(() => {
    if(hunterId !== -1) {
      urlSearchParams.set('hid', `${hunterId}`)
    }

    if(hunterId === 0) {
      urlSearchParams.delete('hid')
    }
    window.history.pushState(null, '', "?"+urlSearchParams.toString());
  }, [hunterId]);

  useEffect(() => {
    if(urlSearchParams.has('hid')) {
      setHunterId(parseInt(`${urlSearchParams.get('hid')}`));
    }

    setLocalData((getLocal(appData.name, appData.country)));
  }, []);

  return useMemo(() => (
    <Elements.Wrapper customCss={css`padding: ${pixelToRem(40)} 0;`}>
      <Elements.Header customCss={css`
        display: flex;
        flex-direction: column;
        min-height: ${pixelToRem(200)};
        align-items: center;
      `}>
        <Logo color='green' customCss={css`margin: auto;`}/> 
        <Elements.H1>Registros guardados localmente</Elements.H1>
        <Elements.Nav customCss={css`padding: ${pixelToRem(20)} 0;`}>
          {isFetching ? (
            <Loader />
          ) : (
            <Elements.Button
              onClick={syncHandler}
              disabled={hunterId === -1 || hunterId === 0 || !localData.length}
              customCss={css`
                background: ${({theme}) => theme.color.primary.normal};
                font-size: ${pixelToRem(17)};
                padding: ${pixelToRem(10)} ${pixelToRem(20)};
            `}>Sincronizar</Elements.Button>
          )
          }
        </Elements.Nav>
      </Elements.Header>
      <Elements.Wrapper
        customCss={css`display: flex;flex-direction: column;`}
      >
        {appData.features.sync_local.hunters ? (
          <>
            <Elements.Select
              value={hunterId}
              onChange={(evt) => setHunterId(parseInt(evt.currentTarget.value))}
              customCss={css`
                padding: ${pixelToRem(4)} ${pixelToRem(10)};
                margin: ${pixelToRem(10)} auto;
                text-align: center;
              `}
            >
              <Elements.Option value={0}>Seleccionar el captador</Elements.Option>
              {appData?.features.sync_local.hunters.total && (
                Array
                  .from({length: appData.features.sync_local.hunters.total}, (_, i) => i + 1)
                  .map(value => (
                    <Elements.Option key={value} value={value}>Captaror #{value}</Elements.Option>
                  ))
              )}
            </Elements.Select>
            <Elements.Wrapper
              customCss={css`
                width: 80%;
                margin: auto;
              `}
            >
              {localData.length ? <Elements.Ul>
                {localData.map(
                  (item: any, idx: number) => (
                    <Elements.Li key={idx}>
                      <Elements.Wrapper
                        customCss={css`
                          display: grid;
                          grid-template-columns: repeat(1, 1fr);
                          gap: 10px;
                          width: 100%;
                          min-height: ${pixelToRem(50)};
                          align-items: center;
                          padding: ${pixelToRem(20)};

                          &:nth-child(odd) {
                            background: #f7f7f7;
                          }

                          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                            grid-template-columns: repeat(7, 1fr);
                            padding: ${pixelToRem(10)};
                          }
                        `}
                      >
                        <Elements.Wrapper>{item.date}</Elements.Wrapper>
                        <Elements.Wrapper>{item.data.firstName} {item.data.lastName}</Elements.Wrapper>
                        <Elements.Wrapper>{item.data.amount}</Elements.Wrapper>
                        <Elements.Wrapper>{item.data.cardDocType} {item.data.cardDocNumber}</Elements.Wrapper>
                        <Elements.Wrapper>{item.data.card_type}</Elements.Wrapper>
                        <Elements.Wrapper>**** {item.data.card.slice(item.data.card.length - 4)}</Elements.Wrapper>
                        <Elements.Wrapper>
                          <Elements.Span
                            customCss={css`
                              background-color: ${item.synced ? 'lightgreen' : 'orange'};
                              display: inline-flex;
                              padding: ${pixelToRem(2)} ${pixelToRem(6)};
                              text-align: center;
                              min-width: ${pixelToRem(60)};
                              font-size: ${pixelToRem(14)};
                              border-radius: ${pixelToRem(4)};
                          `}>{item.synced ? 'Sincronizado' : 'Sin sincronizar'}</Elements.Span>
                        </Elements.Wrapper>
                      </Elements.Wrapper>
                      <Elements.Wrapper
                        customCss={css`
                          padding: ${pixelToRem(30)};

                          code {
                            word-break: break-all;
                          }
                        `}
                      >
                        <code>
                          {JSON.stringify(item.data)}
                        </code>
                      </Elements.Wrapper>
                    </Elements.Li>
                  )
                )}
              </Elements.Ul> : <Elements.Span customCss={css`display: block;text-align: center;`}>No hay registros pendientes por sincronizar</Elements.Span>}
            </Elements.Wrapper>
          </>
        ) : (
          <Elements.Span customCss={css`display: block;text-align: center;`}>La aplicación no es compatible con la funcionalidad de sincronización local.</Elements.Span>
        )}
      </Elements.Wrapper>
    </Elements.Wrapper>
  ), [
    appData,
    localData,
    isFetching,
    hunterId,
    searchParams,
    urlSearchParams,
    location,
  ]);
}

Component.displayName = 'Local';
export default Component;
