import {useEffect, useState} from "react";
import {fetchRemoteProjects, getProjectsDataUrl} from "../utils/projectsRemote";

/**
 * Loads projects only from the configured remote URL (Google Sheets CSV by default).
 * No portfolio.js project rows are merged — sheet is the single source of truth.
 * On fetch failure or missing URL: empty list.
 */
export function usePortfolioProjects() {
  const remoteUrl = getProjectsDataUrl();

  const [state, setState] = useState(() => ({
    projects: [],
    loading: Boolean(remoteUrl),
    usedRemote: false
  }));

  useEffect(() => {
    const url = getProjectsDataUrl();

    if (!url) {
      setState({
        projects: [],
        loading: false,
        usedRemote: false
      });
      return;
    }

    const ac = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true
    }));

    fetchRemoteProjects(ac.signal)
      .then(({projects}) => {
        if (ac.signal.aborted) {
          return;
        }
        setState({
          projects: Array.isArray(projects) ? projects : [],
          loading: false,
          usedRemote: true
        });
      })
      .catch(() => {
        if (ac.signal.aborted) {
          return;
        }
        setState({
          projects: [],
          loading: false,
          usedRemote: false
        });
      });

    return () => {
      ac.abort();
    };
  }, [remoteUrl]);

  return state;
}
