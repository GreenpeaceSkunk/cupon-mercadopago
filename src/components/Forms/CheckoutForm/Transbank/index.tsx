import React, { useContext, useState, useRef, useMemo, useCallback, FormEvent, useEffect } from 'react';
import { css } from 'styled-components';
import Form from '../../../v1/Shared/Form';
import Elements from '../../../Shared/Elements';
import Shared from '../../../Shared';
import { AppContext } from '../../../App/context';
import { useNavigate } from 'react-router';
import { CheckoutFormContext, CheckoutFormProvider, IdentificationType } from '../context';
import { validateCardHolderName, validateCreditCard, validateCvv, validateEmptyField } from '../../../../utils/validators';
import { ERROR_CODES } from '../../../../utils/mercadopago';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { pixelToRem } from 'meema.utils';
import { OnChangeEvent } from 'greenpeace';
import { addOrRemoveSlashToDate } from '../../../../utils';
import moment from 'moment';
import { postRecord } from '../../../../services/greenlab';
import useQuery from '../../../../hooks/useQuery';
import { generatePath } from 'react-router';
import { suscribe } from '../../../../services/transbank';

const Component: React.FunctionComponent<{}> = () => {
  const checkoutFormRef = useRef<HTMLFormElement | any>();
  const { searchParams } = useQuery();
  const { appData } = useContext(AppContext);
  const navigate = useNavigate();
  const {
  //   submitting,
  //   allowNext,
  //   payment,
  //   user,
    params,
  //   identificationType,
  //   dispatchFormErrors,
  //   onChangeHandler,
  //   onUpdateFieldHandler,
  } = useContext(CheckoutFormContext);
  // const snackbarRef = useRef<ISnackbarRef>(null);

  // const onSubmitHandler = useCallback(async (evt: FormEvent) => {
  //   evt.preventDefault();
    
  //   if(!allowNext) {
  //     setShowFieldErrors(true);
  //     if(snackbarRef && snackbarRef.current) {
  //       snackbarRef.current.showSnackbar();
  //     }
  //   } else {
  //     const today = new Date();
  //     const tomorrow = new Date(today);
  //     tomorrow.setDate(tomorrow.getDate() + 1);

  //     dispatchFormErrors({ type: 'SUBMIT' });

  //     /* Backup to Forma. */
  //     if(appData?.settings?.service?.forma?.transactions_form) {
  //       await postRecord(
  //         {
  //           couponUiVersion: appData.features.use_design_version,
  //           couponName: appData.name,
  //           couponType: params.couponType ?? 'regular',
  //           firstName: user.firstName,
  //           lastName: user.lastName,
  //           birthDate: user.birthDate,
  //           email: user.email,
  //           genre: '',
  //           phoneNumber: user.phoneNumber,
  //           areaCode: user.areaCode,
  //           docNumber: user.docNumber,
  //           docType: user.docType,
  //           card: payment.cardNumber,
  //           card_type: parseInt(`${payment.cardType}`),
  //           country: user.country,
  //           city: user.city || '',
  //           address: user.address || '',
  //           countryRegion: user.province || '', // Change to province (create field)
  //           fullName: `${user.firstName} ${user.lastName}`,
  //           mPhoneNumber: '',
  //           campaignName: '',
  //           cardExpMonth: '',
  //           cardExpYear: '',
  //           amount: payment.amount,
  //           citizenIdType: '',
  //           errorCode: '',
  //           cardDocType: payment.docType,
  //           cardDocNumber:payment.docNumber,
  //           cardLastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
  //           cardCvv: payment.securityCode,
  //           cardExpiration: payment.cardExpiration,
  //           donationStatus: "pending",
  //           errorMessage: '',
  //           campaignId: appData?.settings?.tracking?.salesforce?.campaign_id,
  //           recurrenceDay: tomorrow.getDate(),
  //           transactionDate: today,
  //           fromUrl: document.location.href,
  //           userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
  //           utm: `utm_campaign=${urlSearchParams.get('utm_campaign')}&utm_medium=${urlSearchParams.get('utm_medium')}&utm_source=${urlSearchParams.get('utm_source')}&utm_content=${urlSearchParams.get('utm_content')}&utm_term=${urlSearchParams.get('utm_term')}`,
  //         },
  //         appData?.settings?.service?.forma?.transactions_form
  //       );
  //     }

  //     const timer = setTimeout(() => {
  //       dispatchFormErrors({ type: 'SUBMITTED' });
        
  //       navigate({
  //         pathname: generatePath(`/:couponType/forms/thank-you`, {
  //           couponType: `${params.couponType}`,
  //         }),
  //         search: `${searchParams}`,
  //       }, { replace: true });
  //     }, 250);

  //     return () => {
  //       clearTimeout(timer);
  //     }
  //   }
  // }, [
  //   user,
  //   payment,
  //   params,
  //   allowNext,
  //   navigate,
  // ]);

  useEffect(() => {
    // if(appData.features.payment_gateway.enabled) {
    //   const paymentGateway = appData.features.payment_gateway.third_party.toLowerCase();

    //   if(!pathname.includes(paymentGateway)) {
    //     navigate({
    //       pathname: generatePath(`${pathname}/${appData.features.payment_gateway.third_party.toLowerCase()}`, {}),
    //       search: `${searchParams}`,
    //     });
    //   }
    // }
  }, [])

  useEffect(() => {
    // Post to Transbank
    (async () => {
      if(appData.features.payment_gateway.enabled && appData.features.payment_gateway.third_party) {
        // const a = window.location.href.slice(0, window.location.href.indexOf('forms/')+'forms/'.length);
        // const apiResponseUrl = `${a}${searchParams}`;
        const apiResponseUrl = {
          href: window.location.href.slice(0, window.location.href.indexOf('coupon/')+'coupon/'.length),
          pathname: generatePath(`:couponType/forms/thank-you`, {
            couponType: `${params.couponType}`,
          }),
          search: `${searchParams}`,
        };
  
        const data = {
          nombre: "Doe",
          apellido: "Deer",
          rut: "30.686.957-4",
          email: "doe.deer.2@email.com",
          prefijo: "+56",
          telefono: "54545454",
          fechaNacimiento: "2000-11-30",
          region: "Antofagasta",
          pais: "Chile",
          provincia: "Antofagasta",
          comuna: "Antofagasta",
          calle: "Libertador",
          numero: 1000,
          monto: 10000,
          utmSource: "source",
          utmMedium: "medium",
          utmContent: "content",
          utmTerm: "term",
          utmCampaign: "campaign",
          tipoDonacion: "oneoff",
          titular: true,
          tarjetaHabienteRut: "4051885600446623",
          tarjetaHabienteNombre: "Doe Deer",
          apiResponseUrl: window.location.origin + generatePath(`/coupon/:couponType/forms/checkout/transbank/confirm`, {
            couponType: `${params.couponType}`,
          }),
          apiResponseUrlParams: searchParams,
        };
  
        const response = await suscribe(data);
  
        if(response.url_webpay) {
          if(checkoutFormRef.current) {
            const input = document.createElement('input');
            input.name = 'TBK_TOKEN';
            // input.type = 'hidden';
            input.value = response.token;
            checkoutFormRef.current.append(input);
            checkoutFormRef.current.action = response.url_webpay;
            // checkoutFormRef.current.submit();
          } 
        }
        
      } else {
        navigate({
          pathname: '/',
          search: `${searchParams}`,
        });
      }
    })();
  }, []);

  

  return useMemo(() => (
    <>
      Redireccionando ..
      <Form.Main ref={checkoutFormRef} method="POST" />
    </>
  ), [
    checkoutFormRef,
    appData,
  ]);
}

Component.displayName = 'TransbankCheckoutForm';
export default Component;
