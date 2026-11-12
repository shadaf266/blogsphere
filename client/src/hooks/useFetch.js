import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function useFetch(url, params) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const paramsKey = JSON.stringify(params || {});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get(url, { params })
      .then((res) => {
        if (cancelled) return;
        setData(res.data.data);
        setMeta(res.data.meta || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, paramsKey]);

  return { data, meta, loading, error };
}