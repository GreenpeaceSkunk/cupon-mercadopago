# Landing cupon mercado pago

Cupón está integrado con Mercadopago

# Cupones Regular y Oneoff
Para ser usado como `oneoff` simplemente agregar `/oneoff` al final del path, por defecto es de tipo `regular`. 

Domino y subdominio -> `https://unite.greenpeace.org.ar/`
Path ->  sk/coupon/`regular|oneoff`/forms/subscribe
Parametros -> `?ref=skunk&..`

Regular: https://unite.greenpeace.org.ar/sk/coupon/`regular`
Oneoff: https://unite.greenpeace.org.ar/sk/coupon/`oneoff`

## UTMS
Se puede probar con los siguientes parametros de UTM
`?utm_source=source_stg&utm_medium=medium_test&utm_campaign=campaign_test&utm_term=term_test&utm_content=content_test`

https://unite.greenpeace.org.ar/sk/coupon-test?utm_source=source_test&utm_medium=medium_test&utm_campaign=campaign_test&utm_term=term_test&utm_content=content_test

# Variables de entorno

```
PUBLIC_URL="/sk/coupon/"

REACT_APP_ENVIRONMENT="production"
REACT_APP_NAME="mercadopago_coupon"
REACT_APP_WEBSITE_TITLE="Sustentabilidad | Greenpeace"
REACT_APP_DEFAULT_REF_PARAM="skunk"

REACT_APP_CAMPAIGN_ID="7015c0000016j7X"

REACT_APP_GOOGLE_TAG_MANAGER="GTM-TZB6GQ3"
REACT_APP_GOOGLE_ANALYTICS_ID="UA-175817761-1"

REACT_APP_FACEBOOK_PIXEL_ID=713455948697688

REACT_APP_HOTJAR_ID="2619010"
REACT_APP_HOTJAR_SV="6"

REACT_APP_DATA_CRUSH_PORTAL_ID=90
REACT_APP_DATA_CRUSH_SYNCHRO_KEY="NkVkrTPkUu7A8GtbrzanbWZCC7LoAu7gGC9Oe0J0nCNe7DgVmB"
REACT_APP_DATA_CRUSH_EVENT_SK_DONACION_PASO_1="90ewFHJUH5NTbIY9c"
REACT_APP_DATA_CRUSH_EVENT_SK_DONACION_PASO_2="903NkNhZXaQEFkgrM"

REACT_APP_SHARE_URL="https://unite.greenpeace.org.ar/sk/regular"
REACT_APP_SHARE_FACEBOOK_TITLE="¡Vivir una vida sustentable es posible si cada persona hace su pequeño esfuerzo! 🌱 Unite vos también a la sustentabilidad con Greenpeace 👇"
REACT_APP_SHARE_TWITTER_TITLE="El camino hacia la sustentabilidad es responsabilidad compartida. Sumate vos también para hacer la diferencia desde acá 👇"
REACT_APP_SHARE_WHATSAPP_TITLE="¡Hola! Me uní al consumo responsable con la campaña de Sustentabilidad de Greenpeace. ¡Unite vos también! Mirá 👇"
REACT_APP_SHARE_EMAIL_SUBJECT="Colaborá vos también con el medio ambiente"
REACT_APP_SHARE_EMAIL_BODY="¡Hola! Hoy hice mi aporte para cuidar el planeta con Greenpeace. Mientras más seamos, mejor. Colaborá vos también desde acá:"

REACT_APP_PRIVACY_POLICY_URL="https://www.greenpeace.org/argentina/politica-privacidad/"

REACT_APP_AUTOFILL_VALUES=false

REACT_APP_MERCADOPAGO_API_URL="https://api.mercadopago.com/v1"

REACT_APP_GREENPEACE_MERCADOPAGO_API_URL="https://dona.greenpeace.org.ar/gp"
REACT_APP_GREENPEACE_FACEBOOK="https://www.facebook.com/GreenpeaceArg/"
REACT_APP_GREENPEACE_TWITTER="https://twitter.com/GreenpeaceArg"
REACT_APP_GREENPEACE_INSTAGRAM="https://www.instagram.com/greenpeacearg/"

```

CHANGELOG
- 2.28.0 
  - Se modificó el script de Hotjar
- 2.28.1 
  - Se modificó el ID de Hotjar por 2797198
  