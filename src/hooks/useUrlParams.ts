import { ParamsType } from "greenpeace";
import { useParams } from "react-router";

export const useUrlParams = () => {
  const { couponType } = useParams<ParamsType>();
  return {
    couponType,
  };
}
