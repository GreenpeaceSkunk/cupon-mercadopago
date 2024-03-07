import React, { useContext, useEffect, useMemo } from "react"
import useQuery from "../../../../../hooks/useQuery";
import { confirm } from "../../../../../services/transbank";
import { useNavigate, generatePath } from "react-router";
import { CheckoutFormContext } from "../../context"
import Elements from '../../../../Shared/Elements';
import { pixelToRem } from "meema.utils";
import { Loader } from "../../../../Shared";
import { css } from "styled-components";
import { postRecord } from "../../../../../services/greenlab";
import { AppContext } from "../../../../App/context";
import { FormContext } from "../../../context";

const Component: React.FunctionComponent<{}> = () => {
  const { searchParams, urlSearchParams } = useQuery();
  const { appData } = useContext(AppContext);
  const { data: { payment, user } } = useContext(FormContext);
  const navigate = useNavigate();
  const {
    params,
  } = useContext(CheckoutFormContext);
  
  useEffect(() => {
    (async () => {
      const txnStatus = (urlSearchParams.get('TBK_TOKEN') && urlSearchParams.get('TRANSACCION_ID')) ? 'done' : 'pending';
      if(urlSearchParams.get('TBK_TOKEN') && urlSearchParams.get('TRANSACCION_ID')) {
        await confirm({
          token: urlSearchParams.get('TBK_TOKEN') || '',
          transactionId: urlSearchParams.get('TRANSACCION_ID') || '',
        });
      }
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      /* Backup to Forma. */
      if(appData?.settings?.services?.forma?.form_id) {
        const payload = {
          address: user.address || '',
          amount: payment.amount === 'otherAmount' ? payment.newAmount : payment.amount,
          appUiVersion: appData.features.use_design_version,
          appName: appData.name,
          areaCode: user.areaCode,
          birthDate: user.birthDate,
          campaignId: appData?.settings?.tracking?.salesforce?.campaign_id,
          cardDocNumber:payment.docNumber,
          cardDocType: payment.docType,
          cardHolderName: payment.cardholderName,
          city: user.city || '',
          country: user.country,
          couponType: params.couponType ?? 'regular',
          docNumber: user.docNumber,
          docType: user.docType,
          email: user.email,
          firstName: user.firstName,
          fromUrl: document.location.href,
          genre: user.genre,
          lastName: user.lastName,
          mobileNumber: '',
          phoneNumber: user.phoneNumber,
          province: user.province || '',
          region: '',
          recurrenceDay: tomorrow.getDate(),
          txnDate: today,
          txnErrorCode: '',
          txnErrorMessage: '',
          txnStatus,
          urlQueryParams: `${searchParams}`, 
          userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
          utmCampaign: urlSearchParams.get('utm_campaign') || '',
          utmMedium: urlSearchParams.get('utm_medium') || '',
          utmSource: urlSearchParams.get('utm_source') || '',
          utmContent: urlSearchParams.get('utm_content') || '',
          utmTerm: urlSearchParams.get('utm_term') || '',
          zipCode: user.zipCode || '',
          token: urlSearchParams.get('TBK_TOKEN') || '',
          transactionId: urlSearchParams.get('TRANSACCION_ID') || '',
        };
        
        await postRecord(
          payload,
          appData?.settings?.services?.forma?.form_id,
        );
      }
      const timer = setTimeout(() => {
        navigate({
          pathname: generatePath(`/:couponType/forms/thank-you`, {
            couponType: `${params.couponType}`,
          }),
          search: `${searchParams}`,
        }, { replace: true });
      }, 1000);

      return () => {
        clearTimeout(timer);
      }
    })();
  }, []);

  return useMemo(() => (
    <Elements.Wrapper
      customCss={css`
        padding: ${pixelToRem(40)} ${pixelToRem(20)};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      `}
    >
      <Elements.Img src={`${process.env.PUBLIC_URL + '/images/transbank-webpay.png'}`} width='300px' height='auto' />
      <Elements.Span
        customCss={css`
          margin: ${pixelToRem(60)} 0;
          text-align: center;
        `}
      >Confirmando el pago, aguarde un momento<Loader/></Elements.Span>
    </Elements.Wrapper>
  ), []);
}

Component.displayName = 'TransbankConfirmPayment';
export default Component;
