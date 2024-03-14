import { useLocation } from 'react-router-dom';

export interface IUseQuery {
  searchParams: string;
  urlSearchParams: URLSearchParams;
}

const useQuery = (): IUseQuery => {
  return {
    searchParams: useLocation().search,
    urlSearchParams: new URLSearchParams(useLocation().search) as URLSearchParams,
  };
}

export default useQuery;
