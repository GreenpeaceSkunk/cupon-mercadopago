import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { css } from 'styled-components';
import Elements from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';
import { AppContext } from '../App/context';
import { getLocal, syncLocal } from '../../services/greenlab';
import { Loader, Logo } from '../Shared';

const Component: React.FunctionComponent<{}> = () => {
  const { appData } = useContext(AppContext);
  const [localData, setLocalData] = useState<Array<any>>([]);
  const [isFetching, setFetching] = useState<boolean>(false);

  const syncHandler = useCallback(async () => {
    setFetching(true);
    setLocalData(
      (await syncLocal(
        appData.name,
        appData.country,
      ))
    );
    setFetching(false);
  }, [localData]);

  useEffect(() => {
    setLocalData((getLocal(appData.name, appData.country)));
  }, []);

  return useMemo(() => (
    <Elements.Wrapper
      customCss={css`padding: ${pixelToRem(40)} 0;`}>
      <Elements.Wrapper>
        <Elements.Header customCss={css`
          display: flex;
          flex-direction: column;
          min-height: ${pixelToRem(200)};
          align-items: center;
        `}>
          <Logo color='green'/>
          <Elements.H1>Registros guardados localmente</Elements.H1>
          <Elements.Nav customCss={css`padding: ${pixelToRem(20)} 0;`}>
            {isFetching ? <Loader /> : <Elements.Button onClick={syncHandler} customCss={css`
              background: ${({theme}) => theme.color.primary.normal};
              font-size: ${pixelToRem(17)};
              padding: ${pixelToRem(10)} ${pixelToRem(20)};
            `}>Sincronizar</Elements.Button>}
          </Elements.Nav>
        </Elements.Header>
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
                    <Elements.Wrapper>**** **** **** {item.data.card.slice(item.data.card.length - 4)}</Elements.Wrapper>
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
      </Elements.Wrapper>
    </Elements.Wrapper>
  ), [
    appData,
    localData,
    isFetching,
  ]);
}

Component.displayName = 'Local';
export default Component;
