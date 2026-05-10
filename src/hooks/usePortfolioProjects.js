import {useEffect, useMemo, useRef, useState} from "react";
import {
  fetchRemoteProjects,
  getProjectsDataUrl,
  normalizeStaticPortfolioProject
} from "../utils/projectsRemote";

/**
 * Loads projects for the Projects section:
 * - If `REACT_APP_PROJECTS_DATA_URL` is set: fetch JSON/CSV (see `projectsRemote.js`).
 * - On failure or empty remote list: fall back to static `bigProjects.projects`.
 * - When the sheet returns rows: static portfolio projects stay first; sheet rows are appended (deduped by name).
 * - Fresh responses are cached in sessionStorage (TTL via REACT_APP_PROJECTS_CACHE_MS) to limit refetching.
 */
export function usePortfolioProjects(bigProjects) {
  const remoteUrl = getProjectsDataUrl();
  const staticList = useMemo(() => {
    return (bigProjects.projects || []).map((p, i) =>
      normalizeStaticPortfolioProject(p, i)
    );
  }, [bigProjects.projects]);

  const staticRef = useRef(staticList);
  staticRef.current = staticList;

  const [state, setState] = useState(() => ({
    projects: remoteUrl ? [] : staticList,
    loading: Boolean(remoteUrl),
    usedRemote: false
  }));

  useEffect(() => {
    const url = getProjectsDataUrl();

    if (!url) {
      setState({
        projects: staticRef.current,
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
        const fallback = staticRef.current;
        // Always keep portfolio.js projects (e.g. Zync, PackPal) first, then add sheet rows that are not duplicates by title.
        let merged = fallback;
        if (projects.length > 0) {
          const seen = new Set(
            fallback.map(p => String(p.projectName || "").toLowerCase())
          );
          const extras = projects.filter(p => {
            const key = String(p.projectName || "").toLowerCase();
            if (!key || seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
          merged = [...fallback, ...extras];
        }
        setState({
          projects: merged,
          loading: false,
          usedRemote: projects.length > 0
        });
      })
      .catch(() => {
        if (ac.signal.aborted) {
          return;
        }
        setState({
          projects: staticRef.current,
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
