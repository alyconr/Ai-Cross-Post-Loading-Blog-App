import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(url)
        .then((response) => {
          if (response.status !== 200) {
            throw Error('could not fetch the data');
          }
          setData(response.data.posts);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
          setData(null);
        });
    }, 0);
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
