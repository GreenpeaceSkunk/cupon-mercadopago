import { useLocation } from "react-router";

type CouponType = 'regular' | 'oneoff';

export default function useCouponType() {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter((v) => v !== '');
  
  return {
    couponType: (paths[0] !== 'regular' && paths[0] !== 'oneoff' || !paths.length) ? 'regular' : paths[0] as CouponType,
  }
}
