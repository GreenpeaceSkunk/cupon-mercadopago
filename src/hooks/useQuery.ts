import { useLocation } from 'react-router-dom';

export interface IUseQuery {
  searchParams: string;
  urlSearchParams: URLSearchParams;
}

const parseParams = (search: string) => {
  return search.replaceAll('%253F', '&').replaceAll('%3D', '=');
}

const useQuery = (): IUseQuery => {
  return {
    searchParams: parseParams(useLocation().search),
    urlSearchParams: new URLSearchParams(parseParams(useLocation().search)) as URLSearchParams,
  };
}

export default useQuery;
