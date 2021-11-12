import { useLocation } from 'react-router-dom';

export interface IUseQuery {
  searchParams: string;
  urlSearchParams: URLSearchParams;
}

const useQuery = (): IUseQuery => {
  const searchParams = useLocation().search;

  return {
    searchParams,
    urlSearchParams: new URLSearchParams(searchParams) as URLSearchParams,
  };
}

export default useQuery;
